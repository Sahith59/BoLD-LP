---
title: "How BoLD actually works: an alarm wired into the request path"
date: "2026-06-25"
excerpt: "If a scanner cannot see a broken-access bug, how can anything? The answer is not cleverness. It is location. BoLD watches from the one place the truth exists."
author: "The BoLD team"
tags: ["How it works", "Runtime assurance", "Product"]
---

Every engineer asks the same fair question when they first hear what BoLD does. If this bug is invisible to scanners, silent in the logs, and absent from every demo, how can a tool catch it at all?

The answer is not cleverness. It is location.

## The one place the truth exists

A broken-access bug is only knowable at a single moment: the live request, the instant a real user reaches a real object. That is the only point in your whole system where three facts are true at the same time.

- **Who is asking.** The real, authenticated identity behind the request, not a guess.
- **What they touched.** The actual object the request reached, by its real ID.
- **Who owns it.** The real owner of that object, according to your own data.

A scanner poking at your API from the outside has the first fact at best. It does not know who owns object 105, so it cannot tell you that user A was never allowed to see it. Your logs hold a `200 OK` and nothing else. The knowledge needed to call a violation a violation does not survive outside the request. BoLD lives inside it.

## The check is simple once you stand in the right place

People expect the detection to be exotic. It is not. Standing in the request path, the question is almost embarrassingly plain:

```
Request:  user A  ->  GET /invoice/105
Owner of invoice 105:  user B
A is not B, and A has no grant to share it.
->  a real request just succeeded that should not have.
```

That is the whole idea. The hard part was never the comparison. The hard part is being in the one place where you can make it, with the real identity and the real owner both in hand. This is [API1:2023, broken object-level authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/), the top API risk, and it is exactly the comparison the outside world cannot run for you.

## Watching, not guessing

There is a deeper reason this beats a scan. A scanner answers a hypothetical: could this be broken? It probes, infers, and reports a maybe. BoLD does not infer. It watches the real thing happen and reports a fact: this did happen, thirty seconds ago, to a real record. No theory, no maybe, no test account standing in for a customer who is actually there.

That difference, a hypothetical versus a fact, is the whole reason runtime assurance exists. We pulled the [category split between an alarm and a scanner](/blog/alarm-not-scanner) apart on its own.

## When it fires, it owes you proof

A signal you cannot act on is just noise. So when BoLD fires, it hands you the case already made, in plain English:

- the exact request that succeeded,
- the real owner it should have belonged to,
- the mismatch that makes it a violation,
- and the one-line fix.

Not "this might be exploitable someday." A specific request, a specific record, and a specific person who should never have reached it.

See the [request-by-request walkthrough](/#flaw) of how the leak happens, or read [how BoLD stays quiet on data you meant to share](/blog/an-alarm-you-can-trust).
