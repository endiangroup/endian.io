+++
title = "The Limits of BDD"
authors = "Paul M Fox"
summary = "We love behaviour driven development, and we'd like to make it even better."
icon_tag = "magnifying-glass"
draft = false
+++
Let’s put our biases on the table, shall we? We at Endian love Behaviour-Driven Development. Our appreciation for its elegance and beauty is bottomless, and from the first time we saw it across a crowded landscape of software development processes, we knew our affections would never waver. BDD is The One. We’re going to be together forever. In an only slightly figurative sense, we’re going to have its babies.

I mention this because of the nature of love. Sure it’s patient and kind, but it’s also about improvement. Loving a person or a thing or a software development process isn’t about maintaining a perfect, unchanging moment. It is the simple privilege of watching the object of your affections grow from a sapling into a mighty oak.  And maybe doing a little pruning.

This article is about the limits of BDD. The things it does well, and the problems it has. At the end we’ll examine some possible solutions and improvements. We really do love it, and that means we want it to be better.

## TL;DR for millenials

BDD is pretty good as a [specification-driven](http://ndn.sh/5-cs) process, but it has some issues. If you’re reading the article you probably know the benefits: great for team consensus, documentation, QA, etc. 

There’s a bit of a hiccup when it comes to project management, and there can sometimes be a bit of a gulf between the this-is-what-the-users-want of the specification and the this-is-how-that-will-work nature of engineering. 

Finally, there’s quite a significant problem when users want something that they can’t have, especially when the reasons why they can’t have it aren’t immediately clear.

The article ends with some proposed solutions, which you can read for yourself.

## Defining BDD

Don’t worry, I’m not going to replicate the Wikipedia article here. Instead, I’m going to give a much shorter definition: *BDD is a way of specifying and delivering a really solid, well-tested software product by using an example-centric natural language that can be understood by techy people, non-techy people and computers alike*. 

Obviously there’s more to it, but the highlight here is the value: it allows people and their tools to work together, each focused on their individual tasks, without losing sight of the thing they’re trying to create. There are a few differing approaches to BDD, but however you do it the core process is having conversations that result in a specification. That specification will then be used to make and test a product.

There is plenty of good literature on how to write code in a test-driven way. We’re going to focus on BDD as a specification-driven process in this article. 

## Measuring specifications

We published a door-stopping, insomnia-curing [whitepaper](http://ndn.sh/5-cs) on the five integral properties that a good specification should have. To save you some time, the properties are:

1. Canonical. There should be one source of truth for the specification
2. Coherent. It should make logical sense.
3. Comprehensible. Everyone involved should be able to understand the parts that concern them .
4. Comprehensive. It should cover everything that needs to be covered.
5. Current. It should be versional, as in version control.

We also identified nine general uses of a specification, each of which require one or more of the properties above:

1. Complex interaction with other systems. In software, this usually means publishing or consuming APIs.
2. Design verification and testing. Automatic and manual functional testing.
3. Documentation. Good specifications are documentation in themselves.
4. End user identification. Working out who benefits from the specification.
5. Product design. Using the requirements to figure out the code.
6. Project management. Making sure the product is going along nicely.
7. Requirements identification. Figuring out your goals and constraints.
8. Requirements management. Analysing and tracing new requirements.
9. Team consensus. Putting everyone on the same page.

Together, these are the elements of a truly great specification that can be used to build almost anything. The mighty oak that BDD will one day become could be a reliable standard in software engineering, and will produce a specification of Olympian power &mdash; but what can it do today?

## Things BDD is really good for

I promise to keep this bit short.

There are a couple of ways of expressing a BDD specification, but we can all agree that the textural version - in the ubiquitous, [Cucumber-esque](https://cucumber.io/) language, with stories and scenarios written out neatly - is by its nature coherent, comprehensible and, hopefully,  comprehensive. We’ve all seen BDD specs that have gone a little wonky over time, but in general they’re clean, presentable and intuitive to everyone. 

Those fundamental properties allow for some great things. Automated and manual functional testing? Easy; that’s what the process is designed for. Documentation? From the internal perspective, we get it for free! End-user and requirements identification? Child’s play. I did all that this morning between breakfast and the gym. And don’t get me started on team consensus. Do you even have to ask? We’ve created a document that spells out every behaviour of the system with examples of how it should work *and* what should happen when things go wrong… and it’s written in natural language. 

## Things BDD is okay for

Have you ever built an API or a plugin using BDD? How about an embedded system, say for an IoT application? I have, and it’s not ideal.  There’s a rule that we came up with writing stories and scenarios: *use the lowest level of abstraction that everyone will understand* (The bizdev guy doesn’t really care which scenarios trigger 503 error responses in our web API, but the engineers do). So we keep the requirements in general, behaviour terms - *As an API consumer, When I make an invalid request Then I should see an error* - and that means we have to make a technical sub-specification to underwrite the requirements, and this is troubling to me. It’s not a problem exactly, but it’s not perfect.

Project management with BDD is interesting. There’s more detail in the next section, but using your specification for the purposes of monitoring and reporting can be a rewarding experience, if it’s set up properly. We tend to use a continuous integration system (my favourite is [drone.io](https://drone.io/), if anyone’s interested) that runs all behaviour tests on git commit. That means we know at any time whether a given story or scenario is in a red, green or amber state. Sort of, anyway; feature branches in the code make it confusing sometimes. It also means we could theoretically extract that information into an automatic progress report, but we rarely do. It’s awkward, at best, and kind of frustrating because we know the information is in there, but we can’t get at it (though solutions are coming, as we’ll see).

## Things BDD is not good for

As noted above, BDD doesn’t help with the internal parts of technical product design at all. Everyone involved gets together to figure out the behaviour of the product (good so far) and then everyone non-technical dusts off their hands, pats each other on the back, and heads to the bar in celebration. The developers, on the other hand, are left in thunderous silence, wondering *How in blazes are we going to make this happen?*.

That’s facetious, of course, but not completely inaccurate. Keeping all eyes on the prize is incredibly important, but wouldn’t it be better if there were any standard way of using the specification to inform the code architecture? 

And yes, I know the development part of BDD is an iterative process, wherein the test for each step is satisfied individually, thus organically growing the codebase while making sure it’s rigorously tested. I know what [ATDD](https://www.agilealliance.org/glossary/atdd) is. That’s all well and good, and as a software engineer it makes my life fairly easy, but it seems like there’s quite a chasm between *what we want*  and *how it’s going to happen.*

This is especially annoying for project management. A pure behavioural approach makes resourcing tricky - what skills do we need and how many people? - and it makes planning a whole product build nearly impossible if the product is something that hasn’t existed before. For the right kind of project, the sort where you can afford slow and careful iterations, it’s perfect; for everything else it’s really confusing.

While we’re on that topic, let’s talk about the specter at the feast: canon. Where do you actually store your specification? What is the appropriate single source of truth for a team of mixed technical inclination? I’m going to make a confession now: we used Google Spreadsheets for our specifications.  It was the only thing that we could get everyone to understand and easily access. We also stored the .feature files, exported via a script, in version control, and treated them a bit like dependencies.   

If that sort of thing sounds normal to you, and from my limited research it is fairly normal for medium teams upward, then you are also living in the nightmare Stockholm syndrome world of practical BDD. There’s a reason many organisations never even consider using BDD: the tooling just isn’t there. Ask anyone who noticed a consistent mistake in the wording of a particular step in multiple scenarios while they were writing test code, and then had to fix it. There are profane rituals with fewer sacrifices and less blood. 

## Things BDD sucks at

All of that is nitpicking, really, compared to the monolithic problem with BDD: it is, in its current form, unworkably terrible at capturing and tracing constraints. I’ll unpack that shortly and give some examples, but first let’s define some terms.

Requirements come in two flavours: goals and constraints. Goals are things you want the product to do or be, and constraints are restrictions or unavoidable conditions that the product must adhere to. 

I like to imagine the goal as a shining beacon on the horizon, and the constraints are the partially uncharted landscape across which we must build a road that goes to the beacon. We initially assume that the road can be more or less straight and flat.  As we progress across the landscape building our road, we encounter unexpected features. A deep gully that needs a bridge, or unstable chalk cliffs we’ll have to build around. My initial user story of ‘I want a road that goes directly from here to the beacon’ has become a bit more complicated.

Constraints emerge fairly often during development for a simple reason: the end user (or ‘actor’ in BDD parlance) wants things that are not realistic. The worst part is, the reasons why their desires aren’t realistic may be so esoteric or complex that they only become apparent when you start trying to satisfy them. In other words the outside-in methodology, while valiant and brilliant, needs to be able to accept inside-out backpressure. And BDD doesn’t handle it well.

## A case study of the big problem

We have a client who are building an autonomously stable cryptocurrency (which is a fancy way of saying ‘internet money that keeps its value without governance’). The entire stack of products is being built with BDD. As you might imagine, there are quite a lot of moving parts, but one of the key user stories was something like this:

```
As an account holder
I want the value of my money to remain constant
So that I can budget
``` 

And another was:

```
As an account holder
I want to pay as little as possible for transactions
So I can make the best use of my money
``` 

(I’ve simplified the terms a bit to make it comprehensible to people who aren’t economists, like myself.)

The thing is that cryptocurrencies, as a general rule, are inside-out designs. Their developers find the imaginary point where certain mathematical properties, game theoretic principles and software engineering meet &mdash; and then they capitalise on it. The stuff that we end up using them for - [money](https://bitcoin.org), [contracts](https://ethereum.org) and [digital real estate](https://urbit.org) - are emergent properties of the system, not the *purpose* of the system. 

In itself, the inside-outness is not too much of an issue. There are still users and they still want things that can be specified and tested. The problem is that their desires are unrealistic in ways that aren't immediately obvious.

In this case there were two specific, emergent problems. The system is highly complex, so you’ll have to trust me when I gloss over the details:

1. It turned out it wasn’t possible for the value of the currency to be perfectly constant at all times. If one were to plot the value of the currency on a graph, the line wouldn’t be horizontal; it would be sort of wiggly over a short time series, and more or less flat over a long time series. Thus, the `account holder` cannot have a constant value in a literal sense.

2. Some simple game theory modelling shows that the system needs a variable transaction fee, and it’s rarely negligible. Technically the transactions could be free for the `account holder`, but it would make the internals of the system untenable.

Which leaves us with a bit of a problem from the user perspective. How can we be honest about the desires of our actors and also capture the emergent constraints from the engineering team?  Once we’ve captured the constraints, how do we make sure we can trace them through the specification, and how can we be sure the scenarios cover everything they need to for acceptance testing?

This became something of a problem for us. We ended up having repeated conversations about what the phrases ‘remain constant’ and ‘little as possible’ meant in context. We ended up storing metadata alongside the specification, and making contrived, occasionally contradicting scenarios that didn’t seem to be derived from the user stories at all. 

I’ve only given you two problematic examples from that specification. There were dozens, most more complex than the ones above.  It was a mess.

## Some eventual solutions

The minor problems of BDD - especially the barriers to entry for new practitioners with mixed technical and non-technical stakeholders - can be solved with better tooling. 

At the moment it’s hard to get the entire team working on the same specification in a canonical location, but it won’t be forever. [Cucumber Pro](https://cucumber.io/pro) is in active development, and it’s promising. We at Endian are working on our own toolchain, which we call [SpecStack](https://github.com/endiangroup/specstack), which exploits some of the amazing features of git to create a universal interface to specification writing and refactoring. You can check out the early work-in-progress version on our [GitHub](https://github.com/endiangroup/specstack).

The gulf between the specification and the implementation is a little tricky to bridge. Other methodologies approach this problem using concepts like [Event Storming](https://www.eventstorming.com) or more traditional frameworks like [Scrum](https://en.wikipedia.org/wiki/Scrum_%28software_development%29). We’ve tried those approaches with varying degrees of success in different conditions. They synergise well enough with BDD under the right conditions, but they don’t feel like a perfect fit.

We have two novel solutions which will be the topic of future articles: a project management approach we call the CID Grid, and a speculative functional programming metalanguage that treats feature file entities as first class objects, and can be used to generate production code.

Finally, we believe we have a workable solution for the tracing of constraints in BDD specifications. It will be the topic of the next article in this series. We call it the Dialogic Approach, and we think of it as  a way to welcome unexpected complications into your specification and into your heart.
