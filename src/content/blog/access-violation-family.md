---
title: "Beyond BOLA: the access-violation family BoLD watches for"
date: "2026-06-13"
excerpt: "BOLA is the headline, but it has relatives. They share one root cause and one fix, and BoLD treats them as a single family."
author: "The BoLD team"
tags: ["Taxonomy", "Authorization", "API security"]
---

It is easy to fixate on BOLA, because it is the most common and the most famous. But narrowing the product to a single bug would be dishonest, and it would miss how these failures actually show up. They are a family. Every one is a variation on the same theme:

> The wrong user, or the wrong role, succeeded in doing the wrong thing to the wrong object, or saw the wrong data.

Here is the family, each with the shape it takes in the wild.

## Reading what isn't yours (BOLA / IDOR)

The headline case. An endpoint takes an object ID and returns the object without checking ownership. Change the ID, read a stranger's invoice, file, message, or profile. This is [API1:2023](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/), the top API risk.

## Writing or deleting what isn't yours

The same missing check, but on a `POST`, `PUT`, or `DELETE`. Now the attacker is not just reading another user's data, they are editing or destroying it. Same root cause, higher blast radius.

## Reaching an admin action as a normal user

Broken function-level authorization. The app guards the admin **screen** in the UI but not the admin **endpoint** behind it. A normal user calls the privileged route directly and it answers. The lock was on the door, not the safe.

## Promoting yourself with one field

Mass assignment, leading to privilege escalation. The server trusts request parameters it should never have accepted, so sending an extra `role: admin` quietly changes protected state. This is exactly how a researcher gained write access to the Ruby on Rails repository in 2012, with a single hidden form field.

## Pulling back more than you should

Excessive data exposure. The request is technically allowed, but the response leaks fields the caller should never see: other users' data, internal flags, full records where a summary was intended. The authorization on the object was fine. The authorization on the **fields** was not.

## Seeing another tenant's data

Cross-tenant access. In a multi-tenant app, one customer's account reaches another customer's data, usually because a tenant ID was trusted from the client or a row-level filter was missing. One leak, every customer affected.

## One family, one watch

The reason to treat these as one family is that they have one root cause: no ownership check at the moment of access. And they have one detection point: the live request, where the real identity, the real object, and the real outcome all exist at the same time.

That is the only place you can tell the difference between a legitimate shared-data request and a violation. It is where BoLD lives.

See [the family laid out on the site](/#catches), or read [why even a perfect demo still leaks](/blog/passes-every-demo).
