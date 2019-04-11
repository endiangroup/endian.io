+++
title = "Compare-and-Authenticate: Lightweight distributed session management"
authors = "Adrian Duke"
summary = "Compare-and-Authenticate (CAA) is a tiny algorithm for centrally managing the validity of a set of distributed sessions. We take a look at how we conceived of this solution given the problem we faced."
icon_tag = "lock"
draft = false
css = "caa"
+++

Compare-and-Authenticate (CAA) is a tiny algorithm for centrally managing the validity of a set of distributed sessions. It currently has a single Go implementation found on [GitHub](https://github.com/endiangroup/compandauth).

In this article we'll explore how we conceived of this solution given the problem and get into how it works in detail.

## The Context

Whilst working with a previous startup client, we were tasked with porting everything from a very functional MVP Ruby codebase to Go with no noticeable service disruption.

The product was a geo-location recommendation engine for professional drivers in the form of an iOS and Android app. Both the apps and the service were free and had thousands of users at the time (this was 2016) of whom hundreds were active daily.

The backend system was in 2 parts when we joined:  a 'RESTful' Ruby API for handling app requests and a Go service for dealing with geo-location recommendations. Both components shared a Postgres Database. All useful functionality in the app relied on API calls.

The Ruby service sat directly behind the mobile apps and managed sessions. The setup at this point was a long-lived JWT living on the mobile device itself, which had a payload as follows:

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

I say *semi*-tether because if the key `persisted` didn't exist (thus indicating it wasn't saved in the DB) then the original session from token is returned. I don’t recall the original reason for its existence, but I suspect it was added after JWT’s had been issued and before the session table existed (and a 1 user 1 session requirement came in).

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

*(It should be noted that, before we arrived, there had been two prior development teams working on this codebase. The first was from a large consultancy, who got the project started. They were later replaced by independent contractors, by whom we were very impressed.)*

## The Problem

We needed to migrate the login endpoint to the Go service (everything else had been moved already) and add request authentication on existing Go endpoints (which currently had none; not a major issue but the time had come to bring it back). There were, however, a few restrictions that applied:

1. **There could be no impact to the service or UX**. So no mass logout and reauthentication
2. **There could only be one active session per user**... with the exception that we could have multiple sessions on test users (this was required for manual service tuning and app store reviews)
3. **The app developers were mid-rewrite of the Android version** (unbeknown to management or in fact the PO/PM) and so it was preferred if we didn’t impose changes on the app side.

Additionally there were some nice-to-haves:

1. **Locking/Unlocking whole user accounts**. Preventing any valid session from performing any action temporarily
2. **Revoking all active sessions**. Invalidating all currently valid sessions

## The Solution(s)

The immediate and obvious solution was to re-implement the existing Ruby behaviours like for like, adding in the session management to the Go codebase and doing the switch on the proxy. Honestly though, it just felt messy...

Embedding a `session_uuid` into a JWT which served the sole purpose of ensuring one session per user (as well as managing expiration... which JWT's already do) didn’t seem right. It would also mean inheriting the cruft of `persisted` &mdash; a strange flag that seemed to only serve a purpose if it were set to `false` (ie. deny request), and likely the product of changing requirements post go-live.

So, what else could we do and could we make it simpler? The brainstorming began...

We started by thinking about what sort of situation you have with a central server and sessions issued as JWT's. What kept coming to mind was multiple views of the world, where the central service had the authoritative 'current' view and each device/user had its own 'snapshot' (the JWT when it was issued).

We couldn't touch the JWT's until requests were made, so what would happen if you had an old JWT on some device that hadn't made a request in some time? In effect we wanted to passively invalidate JWT's without having to communicate with them.

We kept pondering and hit across a concept that seemed analogous to the problem space, *compare-and-swap*. For those who aren't familiar, it's used in multithreaded applications (and distributed applications like key/value stores) for synchronization where a 'master' integer is stored centrally, and each thread/client that wants to 'act' attempts to write to the central location offering its current view (read: copy of 'master' integer) and if it matches allowing it to 'act' (incrementing the 'master' integer).

If the current view is wrong (say some thread acted in between when it read the 'master' integer and when it attempted to 'act') then it's denied and it must try again. As such the thread/client that has the most current view is allowed to perform its operation.

<blockquote>
Compare-and-swap (CAS) is an atomic instruction used in multithreading to achieve synchronization. It compares the contents of a memory location with a given value and, only if they are the same, modifies the contents of that memory location to a new given value. This is done as a single atomic operation. The atomicity guarantees that the new value is calculated based on up-to-date information; if the value had been updated by another thread in the meantime, the write would fail.
<cite><a href="https://en.wikipedia.org/wiki/Compare-and-swap">https://en.wikipedia.org/wiki/Compare-and-swap</a></cite>
</blockquote>

This seemed perfect, but what would it look like for JWT's? We also wanted more than just 1 session to be valid at a time for our test users. How did that fit this pattern?

The next idea came from rate limiters and sliding windows. Sliding windows tend to be implemented in either compressed or discrete manners (the former loses precision in place of lower storage requirements, the latter being perfectly granular tracking every event). (See [this great article](https://www.figma.com/blog/an-alternative-approach-to-rate-limiting) for a good insight into a sliding window approach to rate limiting)

Due to the nature of our needs, trying to get away from a bulky session system, it seemed appropriate to explore a compressed way of solving the issue. What we ideally wanted was some sliding window of valid sessions and for that window to be configurable centrally.

Now all that was left was how to shoehorn our new solution into existing JWT’s such that we created no impact on service or UX. Here we faced an issue of existing behaviour app side that we couldn’t quickly change; only updating the JWT on a successful login, which meant we had to maintain the validity of the existing tokens in circulation.

Seeing as the JWT’s were JSON and we decoded said JSON into a struct in Go, we needed ideally a solution that could make use of Go’s zero values (given a type, Go will default its value to some predefined zero value, for int it's `0`, for strings it's `""`, etc.). Using zero values means we can add a field to a struct and regardless if it's present in the JSON (JWT payload) that field’s value will be zeroed.

We had all the pieces, now to put them together.

## Compare-and-Authenticate (CAA)

CAA is extremely simple at its core. There is a 'master' integer stored centrally and a copy of that integer is embedded into each new session at creation (whilst the 'master' integer is incremented). When you (server) receive a session, you fetch the 'master' integer and extract the session integer, add your sliding window size to it and see if it's more than or equal to the 'master' integer. If it's not, it's too 'old' and considered invalid; if it is, it’s valid. So for example:

User logs in:

1. 'master' integer = `0`
2. user submits a successful login request
3. session is created with a copy of 'master' integer = `0`
4. 'master' integer is incremented = `1`

User makes a request:

1. 'master' integer = `1`
2. incoming request with session integer = `0`
3. sliding window size = `1`
4. session integer + sliding window size `0 + 1 = 1`
5. `1` is greater than or equal to `1`; valid

Chronological view of logins with sliding window size of `1`:

{{< figure src="img/slide-1_master-4.svg" >}}

Chronological view of logins with sliding window size of `2`:

{{< figure src="img/slide-2_master-103.svg" >}}

If you want to revoke all active sessions, you increment the 'master' integer by the size of the sliding window:

1. 'master' integer = `10`
2. sliding window size = `5`
3. set 'master' integer `10 + 5 = 15`

If you want to lock an entire 'user', we just flip the sign bit on the 'master' integer to it’s negative. Any incoming sessions that are compared to a 'master' integer that is negative are considered locked.

1. 'master' integer = `-10`
2. incoming request with session integer = `9`
3. 'master' integer is negative; invalid

When you want to unlock that 'user' just flip the sign bit back to positive. All previously valid sessions will return to being valid.

Here's an interactive version of all of the above:

{{< articles/compandauth/caa >}}

## The Outcome

We built the CAA system in a few hours after coming up with the final solution (~100 lines of code + ~200 for tests) and had it wired into the codebase in a day.

It needed a minor database migration, adding a `caa` column (`bigint`) to our user table as part of the deploy. Once deployed and after getting over a minor hiccup of defaulting the `caa` column to `0` and not `1`, all traffic was routed to the Go service and existing sessions were now authenticating successfully.

The properties worked perfectly for our problems. No mass reauthentication was needed. We could re-use existing JWT’s in circulation that didn’t contain a session integer (`session_caa`) field using Go’s int zero value of `0` by means of its absence.

All new sessions issued by the Go service would create a JWT that looked as follows:
```json
{
	"session_caa": some_int,
	"exp": "...12 months..."
}
```

Setting the sliding window size to `1` directly in the codebase (could of existed in the database or config, but there was no initial need) meant we could enforce 1 active session per user. We then added a very small amount of exceptional code for our test users that allowed us to have a different sliding window size (I think `5` or something like that).

Finally it required no changes to the app codebase to work, which was a boon for the app developers racing through the Android rebuild (which they did successfully unbeknown to the PM and management).

All in all it was a success as defined by the initial problems we faced and reduced the complexity of the system. It was very satisfying to run the migration which dropped the session table, and even more satisfying to switch off the Ruby service.

---

## In Detail...

In the examples above the sliding window represents the set of valid sessions, which is always the range 'master' integer `N`, sliding window size `w` to give: `[N-w..N-1]`

Conversely all invalid sessions are expressed in the range: `[0..N-w-1]`

The range of all issued sessions is: `[0..N-1]`

Additionally when a 'master' integer is negative `-N` all sessions are considered invalid regardless of the sliding window size or session integer.

The 'master' integer is only incremented when a successful login happens, in effect pushing the smallest (oldest) session inside the set of valid sessions out (moving it from `N-w` to `N-w-1`).

*(note: The reasoning for all those `-1`’s is down to wanting the first valid session integer to be `0` and because we can only increment the 'master' integer upon successful login)*

Due to the 'compressed' nature of this solution precision is lost, that precision is in the ability to pick a particular valid session to invalidate e.g. 

```gherkin
Scenario: Invalidate S3
	Given 'master' integer `N = 5`
	And sliding window size `w = 3`
	And issued sessions [S0, S1, S2, S3, S4]
	When I increment `N` by `2`
	Then 'master' integer should be `N = 7`
	And `S2` is now invalid
	And `S3` is now invalid
```

We can’t target `S3` precisely and have to invalidate `S2` in the process when incrementing `N`. However we can still get 2 useful behaviours given the imprecision, we can easily invalidate all valid sessions in one go (logout all active sessions), likewise we can invalidate all but the latest session (logout all other active sessions before this one).

Given that, we can express the interface of this system concisely in Go as follows:

```go
type SessionCAA int64

type CAA interface {
	Lock()
	Unlock()
	IsLocked() bool

	IsValid(SessionCAA, int64) bool

	Revoke(int64)
	Issue() SessionCAA
	HasIssued() bool
}
```

All methods that don’t return a `bool` mutate the 'master' integer in some form. Using this interface also gives us a neat ability to create an alternative implementation using unix timestamps with a separate set of behaviours. I’ll leave it up to the reader to figure out what properties that brings and what it might be useful for (or for the less inclined you can take a look at the [README](https://github.com/endiangroup/compandauth/blob/master/README.md)).

For the very inclined, you can find the TLA+/PlusCal version of the above in [the repo](https://github.com/endiangroup/compandauth/blob/master/compareandauth.tla).

---

