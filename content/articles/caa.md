+++
title = "Caa article title"
+++
Compare-and-Authenticate (CAA) is a tiny algorithm for centrally managing the validity of a set of distributed sessions. It currently has a single Go implementation found here: https://github.com/endiangroup/compandauth.

In this article we'll explore how we conceived of this solution given the problem and how it works in detail.

## The Context

Whilst working with a previous startup client, we were tasked with porting everything from a very functional MVP Ruby codebase to Go with no noticeable service disruption.

The product was a geo-location recommendation engine for professional drivers in the form of  iOS and Android apps. Both the apps and the service were free and had thousands of users at the time (this was in 2016) of whom hundreds were active daily.

The backend system was in 2 parts when we joined:  a 'RESTful' Ruby API  for handling app requests and a Go service for dealing with geo-location recommendations. Both components  shared a Postgres Database. All useful functionality in the app relied on API calls.

>>> D: current architecture -> new achitecture

The Ruby service sat directly behind the mobile apps and managed sessions. The setup at this point was a long lived JWT living on the mobile device itself,  which had a payload like this:

```json
{
	"session_uuid": "...",
	"user_uuid": "...",
	"persisted": true,
	"exp": "...12 months..."
}
```

The database had a `sessions` table that was  referenced by the client-side JWT:

```ruby
create_table(:sessions) do
	primary_key :id
	column :user_id, "integer"
	column :uuid, "text", :null=>false
	column :expires_at, "timestamp without time zone", :null=>false
	column :created_at, "timestamp without time zone", :null=>false
	column :updated_at, "timestamp without time zone", :null=>false

	...indexes...
end
```

You may be wondering what that `persisted` flag is doing. Well, it acted as a semi-tether between the JWT and the database sessions table. The governing code looked  something like this:

```ruby
  def self.session_from_token(token)
    begin
      s = Session.from_token(token)
    rescue Session::TokenError
      return nil
    end

    if s.persisted?
      persisted_session = Session.first(uuid: s.uuid)
      return s if persisted_session && persisted_session[:expires_at] >= Time.now.utc
      return nil
    else
      return s
    end
  end
```

I say *semi*-tether because if the key `persisted` didn't exist (thus indicating it wasn't saved in the DB) then the original session from token is returned. I don’t recall the original reason for its existence, but I suspect it was added after JWTs had been issued and before the session table existed (and the 1 user 1 session requirement came in).

So the login and authentication flow would look as follows:

1. First time user starts app
2. Asked to enter phone number
3. Receives text message with 6-digit code
4. Enters 6-digit code into app
5. API: User looked up
6. API: If not found created
7. API: If any prior sessions exist in DB, delete all (one active session per user)
8. API: New session created for User
9. API: JWT created and returned referencing session and user
10. App can successfully make requests to API with JWT

Finally, there was an nginx proxy in front of both services, which allowed granular control of redirecting endpoints to different services.

(It should be noted that, before we arrived, there had been two prior development teams working on this codebase. The first was from a large consultancy, who got the project started. They were later replaced by independent contractors, by whom we were very impressed.)

## The Problem

We needed to migrate the login endpoint to the Go service (everything else had been moved already) and add request authentication on existing Go endpoints (which currently had none; not a major issue but the time had come to bring it back). There were, however, a few restrictions that applied:

1. There could be no impact to the service or UX. So no mass logout and reauthentication
2. There could only be one active session per user… With the exception that we could have multiple sessions on test users (this was required for manual service tuning and app store reviews)

Additionally there were some nice-to-haves:

1. Locking whole user accounts
2. Revoking all current sessions

## The Solution(s)

The immediate and obvious solution was to re-implement the existing Ruby behaviours like for like, adding in the session management to the Go codebase and doing the switch on the proxy. Honestly though, it just felt messy. Embedding a `session_uuid` into a JWT which served the sole purpose of ensuring 1 session per user (as well as managing expiration... which JWT's already do) didn’t seem right. It would also mean  inheriting the cruft of `persisted` &mdash; a strange flag that seemed to only serve a purpose if it were set to `false` (ie. deny request), and likely the product of changing requirements post go-live.

So, what else could we do and could we make it cleaner? The brainstorming began...

We started by thinking about what sort of setup you have with a central server and sessions issued as JWT's. What kept coming to mind was multiple views of the world, where the central service had the authoritative ‘current’ view and each device/user had its own ‘snapshot’ (the JWT when it was issued). We couldn't touch the JWT's until requests were made, but what would happen if you had an old JWT on some device that hadn't made a request in some time? We wanted to passively (relative to that device) invalidate its JWT without having to communicate with it.

We kept pondering and hit across a concept that seemed analogous to the problem space, *compare-and-swap*. For those who aren't familiar, its used in multithreaded applications (and distributed applications like key/value stores) for synchronization where a 'master' integer (not originally an integer, but now tends to be see ABA problem) is stored, and each sub-thread that wants to 'act' attempts to write to the memory location offering its current view (read: copy of 'master' integer) and if it matches allowing it to 'act' (incrementing the master integer). If its current view is wrong (some thread got in between when it read the 'master' integer and when it attempted to 'act') then it's denied and it must try again. As such the thread that has the most current view is allowed to perform its operation.

This seemed perfect, but what would it look like for JWT's? We also wanted more than just 1 session to be valid at a time for our test users. How did that fit this pattern?

The next idea came from rate limiters and sliding windows. What if we could nominate some fixed number of current sessions that are valid? That seemed perfect.

Now all that was left was how to shoe-horn in our new solution into existing JWT’s such that we created no impact on service or UX. This is where one of my favourite features of Go comes into play, ero value.  Go will default a type to some zero value. For integers that value is, predictably, `0`. What that means for our problem is the absence of some key in existing JWTs could be defaulted to `0` without us touching it.

We had all the pieces, now to put them together.

## Compare-and-Authenticate (CAA)

CAA is extremely simple at its core. There is a 'master' integer stored centrally and a copy of that integer is embedded into each new session generated it. When you receive a session, you fetch the 'master' integer and extract the session integer, add your sliding window size to it and see if its more than or equal to the 'master' integer. If its not, its too old and considered invalid; if it is, it’s valid. So for example:

1. 'master' integer = 10
2. incoming request with session integer = 5
3. sliding window size = 1
4. sessiong integer + sliding window size = 6
5. 6 is not greater than or equal to 10, invalid

1. 'master' integer = 10
2. incoming request with session integer = 9
3. sliding window size = 2
4. sessiong integer + sliding window size = 11
5. 11 is greater than or equal to 10, valid

If you want to revoke all active sessions, you increment the 'master' integer by the size of the sliding window:

1. 'master' integer = 10
2. sliding window size = 5
3. set 'master' integer = 15

Furthermore, if you want to lock an entire 'user', we just flip the sign bit on the 'master' integer to negative. Any incoming sessions that are compared to a 'master' integer that is negative are considered locked.


