+++
title = "Adject Clarity: Five Integral C-Words of Maximally Useful Product Specification for Teams"
+++
## Abstract

When humans work in teams to create something, they must be in agreement about what they're creating in order to maximise their chances of success. Without consensus on the final form of their product, there is a risk that individual team members may create or contribute to components or features that are misaligned with the rest of the team. The risk of misalignment is inversely proportional to the degree of consensus of the team as a whole: the less they agree, the more likely they are to mismatch their output.

More importantly, the product must be fit for its intended purpose.  A perfectly harmonious team may create a fantastic product, but if it doesn't solve the problem it was intended for, its real-world function is very likely to be diminished. Complete agreement doesn't guarantee success, and a great product idea doesn't guarantee successful completion. 

One common solution to these problems is to create a specification. Working from the intended real-world application of their product through to the details of its creation<sup id="a1">[1](#f1)</sup>, it's possible for a team to explicitly catalogue the requirements of their product in such a way that all team members can work toward satisfying them.  A well-specified product will be much more likely to be fit for purpose, and the team creating it will have a significantly increased chance of working together cohesively.

There are many approaches to specification creation. Goals, considerations and constraints for product design vary between products, teams and even individual team members. In light of all that variation, the most significant measurement of a specification’s appropriateness in any given situation is its *utility*; that is, the extent to which it is practical or beneficial to a particular team creating a particular product.

We propose that, in order to have maximal utility, a product specification must be *canonical*, *coherent*, *comprehensible*, *comprehensive* and *current*. These five attributes, known in this document as the *C-Words*, constitute a minimum property set for highly practicable and flexible product specifications. Only teams using specifications that embody all five C-Words could be afforded all the possible benefits of an explicit specification. 

In order to prove this claim, we will show that removing or failing to embody one or more of the C-words will significantly impede the potential utility of a specification, and may have negative resulting implications on the product. We will also demonstrate that the C-Words, as a complete set and in various combinations, are a generally integral part of specifying products. To accomplish this, we will show that there are no useful specifications that do not embody at least one C-Word.

## 1 Definitions of terms

Before proceeding with a logical proof, it is necessary to clarify the use of words in this document. Since all of these words are used in other contexts with other connotations and meanings, they are defined in relation to product specifications as follows:

### 1.1 General terms

#### 1.1.1 Product

In practice, a product is anything produced or sold, but the specific meaning here is the consequence of the efforts of a team. The general purpose of a product is to solve a problem or add value to something in the real world.

#### 1.1.2 Specification

A specification is an explicit set of requirements for a product, material or service. 

In the real world, specifications range from the completely informal (hand-drawn diagrams, written instructions, recipes, etc) to the rigorously formal<sup id="a2">[2](#f2)</sup> (blueprints, construction manuals or industrial designs). Specifications may or may not conform to various technical standards, and are sometimes expressed in discrete parts. For example, it's common in engineering to create a ISO-standard requirement specification and an ISO-standard product specification that describes the solutions.

For the purposes of this document, a specification includes both requirements and solutions. The specific focus of the authors is software specifications by example<sup id="a3">[3](#f3)</sup>, but the 5 C-Words apply to any explicit set of requirements that must be satisfied by a team in order achieve a goal.

#### 1.1.3 Team

A team is a group of one or more humans who are working together in order to create a particular product. 

As discussed below, there is utility in creating computer-readable specifications, but it is assumed that all computers are controlled or orchestrated by humans.

### 1.2 The five C-Words

#### 1.2.1 Canonical

For the purposes of this document, *canon* is defined as a single, recognised, orthodox source of truth.

A canonical specification should have exactly one self-contained representation. The representation is usually centralised, but some software approaches use multiple copies that automatically synchronise; these are still considered canonical as long as all team members can access up-to-date versions of the specification.

#### 1.2.2 Coherent

*Coherence* refers to a state of being ordered, logical and consistent. There is also a deliberate implication of a harmoniousness of parts; each component fits logically with those around it. 

A coherent specification should use the same structure throughout. Any natural patterns that form in the specification should be maintained as long as it is logical and useful to do so. There should be no inconsistencies in language or diagrammatic grammar, style, format or organisation. There should be no redundancy and no unnecessary components<sup id="a4">[4](#f4)</sup>. 

#### 1.2.3 Comprehensible

Wherever humans are involved, *comprehension* is a key requirement for their understanding. In this document, it refers to the capacity to be understood or grasped fully and thoroughly, and to being expressed in the most basic and straightforwardly applicable manner.

Given a comprehensible specification, all members of the team should be able to understand at least the parts that concern them. Written parts of the specification should be readable<sup id="a5">[5](#f5)</sup>, concise, specific and precise; diagrams should be clearly labelled with any additional explanations embedded in the specification.

#### 1.2.4 Comprehensive

*Comprehensiveness* is the state of exhaustively or completely covering everything in a given domain. 

A comprehensive specification should cover all the requirements of the product. It should not include requirements that will never be part of the product, and it should not omit requirements that are part of the product &mdash; even if those parts are due to be deprecated or removed.  

#### 1.2.5 Current

To be *current* is to exist or occur during the present moment. In versional or evolving systems this refers to the most recent, generally accepted iteration. An example of this is the phrase 'current fashion', wherein it's accepted that fashion will continuously evolve, but there is a present state of that evolution.

For a specification to be considered current, it must be possible to explicitly nominate a particular version or iteration as being the accepted or signed-off form of the specification. It is this form which will be used to make the product at any given time. It should be possible to continue developing the specification without disrupting the accepted form. This is typically accomplished with specialised software<sup id="a6">[6](#f6)</sup>.


## 2 Specification uses and applications

We have identified ten *uses* for a product specification, each of which has one or more *applications*. A use is a generally desirable and beneficial capability of a specification as required by a team creating a product, and an application is a specific circumstance or necessity of use that teams may encounter in the real world.  Together, the set of uses and applications constitute the full potential utility of a specification.

In order to demonstrate that the five C-Words are integral to specification design we must show that each use requires at least one C-Word to be applied. That is, if there is any specification use which does rely upon one or more of the C-Words for its application to be practicable, then the proposition that the C-Words are integral to maximally useful product specifications will be falsified. 

Similarly, if one or more C-Word concepts are not relied upon by any specification use or application, then the proposition that they are integral to maximally useful product specifications will be falsified. 

### 2.1 End user identification

It's usually necessary to identify the set or class of users of a product. User expectations typically determine much of the nature and properties of a product, and predicate its utility. The term *end user* is employed here to denote users of the finished product, including those that support, maintain or continue to develop the product after its completion. 

There are three broad applications for end user identification: 

1. identifying end users discreetly in order to derive requirements from them
2. deriving users from abstract requirements
3. identifying users separately from requirements. 

For the sake of brevity, in this document they are shortened to *user-first*, *requirement-first* and *user-unrelated* end user identification, respectively.

In user-first specifications, the end user is a primary component. Some or all of the requirements in the specification are deduced from general expectations of end users.

In requirement-first specifications, the end user is an emergent component of the requirements. Some or all of the end users are deduced from the requirements in the specification.

In user-unrelated specifications, there is no explicit relationship between the end users and the requirements; they are identified separately and remain wholly or largely distinct.

#### 2.1.1 Analysis

However they feature in the specification, end users must at least be identified comprehensibly. If all relevant team members can't infer the end users from the specification, then identifying them has little or no utility. 

In order to extract a full set of users from a set of requirements, it's necessary for the requirement set to be complete. Thus requirement-first specifications must also be comprehensive.

#### 2.1.2 Summary

C-Word | *User-first* | *Requirement-first* | *User-unrelated* 
--- | --- | --- | ---
Canonical       | `Not required` | `Not required` | `Not required`   
Coherent        | `Not required` | `Not required` | `Not required`
Comprehensible  | `Required`     | `Required`     | `Required`
Comprehensive   | `Not required` | `Required`     | `Not required`
Current         | `Not required` | `Not required` | `Not required`

### 2.2 Complex interaction with other systems 

Some products are explicitly designed to interface in a non-trivial<sup id="a7">[7](#f7)</sup> manner with entities outside of their anticipated user set. Specifications for these products typically identify the external entities by name, class or standard.  Examples of external entities include existing machinery, tooling, facilities, or, for software products, third-party APIs<sup id="a8">[8](#f8)</sup>. 

There are two broad categories of complex external interactions: *active* and *passive*.

Active interactions occur when the product interfaces with a known, existing entity that has defined the nature of the interaction. It is the product's responsibility to conform to a previously established interface.

Passive interactions occur when an external known or unknown entity interfaces with the product. The product defines the nature of the interface, and it's the external entity's responsibility to conform to it. 

#### 2.2.1 Analysis

For both applications, a canonical source of truth is required. It's not possible to make an interface with multiple, possibly conflicting requirements. The specification must also be kept up to date, because changes in the interface requirements may limit interactions, or even make them impossible.

In order to facilitate passive interactions, the nature of any interfaces must be published or made obvious to external entities.  This requires the specification to be translated or the information to be otherwise transferred to the makers of the external interface, and the specification must thus be readable.

#### 2.2.2 Summary

C-Word | *Active*  | *Passive* 
--- | --- | --- 
Canonical       | `Required`     | `Required`
Coherent        | `Not required` | `Not required`
Comprehensible  | `Not required` | `Required`
Comprehensive   | `Not required` | `Not required`
Current         | `Required`     | `Required`

### 2.3 Design verification and testing

Some products, in whole or in part, can be verified for suitability in a rigorous, often mathematical way. This verification is typically made against its specification. There are two very general categories of verification: *formal verification* and *functional verification*. 

Formal verification typically applies to hardware and software systems. Algorithms, common in such systems, can be tested for *correctness* using specialised tooling. Correctness, in this context, is asserted when an algorithm is correct to its specification. 

Functional verification is the process of making sure that the design and behaviour of the product conform to its specification. As a formal practise, functional verification can sometimes be extremely difficult because of the large number possible test cases that can exist in even a simple product. 

As the task becomes less formal it gets much more simple: a manual test of a hammer is far more straightforward than building complex apparatus to test a fission reactor. For this reason, within the application of functional verification there are two essential categories: *automated* and *manual*.

Automated functional verification is the process of building hardware or software devices to run specification-driven tests on the product in a complete or incomplete state. It’s used most commonly in software engineering and electronic design.

Manual functional verification is the process of humans using the product, formally or informally, and asserting its correctness or incorrectness according to its specification.

#### 2.3.1 Analysis

Formal verification is carried out by automated tools. The typical process is to have a computer run a formal proof of the specification on an abstract mathematical model of the product. This requires that the specification be coherent and machine readable. For the formal proof to be maximally meaningful, the specification must also be  comprehensive. 

Automated functional verification also requires a coherent, machine-readable specification.  There is sometimes utility in testing an incomplete product, so it’s not necessary for the specification to be comprehensive. 

Manual functional verification requires the specification to be read by humans, and this it must be comprehensible.   It would likely be of benefit for the specification to also be coherent, but it’s not a minimum requirement.

For any  testing feedback to use of use to the team, it is necessary to know which version of the specification was used for the tests, making currency a requirement for all applications.

#### 2.3.2 Summary


      C-Word     |    *Formal*    | *Functional (automated)* | *Functional (manual)* 
 --- | --- | --- | ---
  Canonical      | `Not required` | `Not required`           | `Not required`        
  Coherent       | `Required`     | `Required`               | `Not required`        
  Comprehensible | `Not required` | `Not required`           | `Required`            
  Comprehensive  | `Required`     | `Not required`           | `Not required`        
  Current        | `Required`     | `Required`               | `Required`            

### 2.4 Product design 

It’s possible, in many cases, to design the form, behaviour or internal structure of a product based on its specification<sup id="a9">[9](#f9)</sup>.  The applications for this fall into two non-exclusive categories: *explicit designs* and *derived designs*.

Explicit designs are stated clearly in the specification itself. They are not subjective, and they are not intended as problems to be solved by the team. An example of this approach is the blueprint for a bridge: the design has very specific structure, materials and construction which must be implemented exactly.

Derived designs are not stated explicitly in the specification, and are typically created by the team in response to the goals and constraints from the specification. This approach is common in user-centric specifications, and there will often be sub-specifications that detail the implementation of the product requirements<sup id="a10">[10](#f10)</sup>.

It should be noted here that this use of a specification assumes that the requirements are correct and realistic at any given time. See **2.5 Requirements identification** for methods of measuring and refining requirements using a specification.

#### 2.4.1 Analysis

Any specification that explicitly or implicitly outlines design features must be canonical, otherwise there could be conflicting design features.  It must also be comprehensible so that the team is able to implement it. Currency would be of significant benefit for practical reasons, but it’s possible to design a product based on a specification without it.

For specifications with explicit design requirements, coherency is highly beneficial but not strictly necessary<sup id="a11">[11](#f11)</sup>. 

#### 2.4.2 Summary


      C-Word     |  *Explicit*    | *Derived* 
 --- | --- | ---
  Canonical      | `Required`     | `Required`          
  Coherent       | `Not required` | `Not required`             
  Comprehensible | `Required`     | `Required`            
  Comprehensive  | `Not required` | `Not required`         
  Current        | `Not required` | `Not required`   

### 2.5 Requirements identification

Specifications can be used to identify two types of requirements for a product, *goals* and *constraints*. Depending on the type of specification and the nature of the product, it can be easier to capture one or the other.

Goals are results or properties that the team hopes the product will allow for or achieve integrally. They are generally the impetus for creating the product, and are often highly relevant to the end user. Typically the goals for a product will remain largely consistent throughout the creation process, and any changes will be minor. 

Most specifications start with at least one goal, so for the purposes of this document an identified goal is an additional goal that has been found by analysing the specification, or an additional goal that is an emergent property of the other goals and constraints in a specification.

Constraints are restrictions or unavoidable conditions that the product must adhere to. They can be properties of the natural world, limitations of scope or available resources,  external behavioural requirements or more complex tradeoffs of cost and benefit<sup id="a12">[12](#f12)</sup>. Constraints are much more likely that goals to change over time.

While it’s fairly easy to imagine the goals and other positive benefits of a product, it tends to be more difficult to accurately predict the constraints. Thus capturing constraints in specifications  is less common than capturing goals, but when both are present the specification has much more utility.

#### 2.5.1 Analysis

All requirements identification via specification must be carried out with a canonical source. Having multiple sources of truth would make identifying additional goals and constraints practically impossible.

Although it would be highly beneficial, coherence is not required in order to identify goals and constraints.

Comprehensibility is not strictly required for goals, though it would be of significant benefit. Constraints, however, can only be identified if the goals can be understood by the team, making comprehensibility a requirement.

#### 2.5.2 Summary


      C-Word     |  *Goals*      | *Constraints* 
 --- | --- | ---
  Canonical      | `Required`     | `Required`          
  Coherent       | `Not required` | `Not required`             
  Comprehensible | `Not required` | `Required`            
  Comprehensive  | `Not required` | `Not required`         
  Current        | `Not required` | `Not required` 

### 2.6 Project management 

In many cases it’s possible to use a specification as the basis for managing the product creation.  Though there are formal project management models<sup id="a13">[13](#f13)</sup>, we’ve identified three general areas of intersection with a useful specification: *planning*, *resourcing* and *monitoring*<sup id="a14">[14](#f14)</sup>.

Planning, for the purposes of this document, refers to explicitly scoping the project, creating a plan or work breakdown for its execution, budgeting, assembling team member requirements and creating schedules. The specification itself should inform any requirements gathering, and typically much of the scope.

Resourcing includes concerns about funding, acquiring team members and gathering other resources. This will often include investment or budget pitches, team member induction and the assembly of required tools. The assumption in this document is that the specification itself will be used as an asset during the resourcing process.

Monitoring is largely concerned with capturing and reporting progress, generally with a view to measuring them against the overall plan.


#### 2.6.1 Analysis

Any kind of whole-project planning requires a vision of the entire product from a single source of truth. A specification used for the purposes of planning must therefore be canonical and comprehensive. 

The utility of a specification in the resourcing process is about communicating the vision, viability and requirements of the product. A specification used for resourcing should therefore be comprensible at minimum, and would ideally also be comprehensive.

The measure the progress of production, it is necessary to have a good idea of what the finished product will look like at in its intended version. A monitoring specification must be canonical, comprehensive and current.

#### 2.6.2 Summary


      C-Word     |    *Planning*  | *Resourcing*   | *Monitoring* 
 --- | --- | --- 
  Canonical      | `Required`     | `Not required` | `Required`           
  Coherent       | `Not required` | `Not required` | `Not required`        
  Comprehensible | `Not required` | `Required`     | `Not required`       
  Comprehensive  | `Required`     | `Not required` | `Required`           
  Current        | `Not required` | `Not required` | `Required`    

### 2.7 Support for ongoing work
