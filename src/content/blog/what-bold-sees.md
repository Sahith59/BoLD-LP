---
title: "What BoLD sees, and what it never stores"
date: "2026-06-22"
excerpt: "A tool that watches your traffic is a fair thing to be suspicious of. Here is the honest answer to the obvious fear: are we just a fresh copy of your users' data, waiting to leak?"
author: "The BoLD team"
tags: ["Privacy", "Trust", "Product"]
---

If a security tool asks to sit in your request path, you should be suspicious. The fear is reasonable. You are letting something watch live traffic, so are you just creating a second pile of your users' data, a fresh breach target wearing a security badge?

That fear is exactly why BoLD is built the way it is. The short version: BoLD judges access by its shape, not by its contents.

## Shape, not contents

To tell a violation from legitimate access, BoLD needs three plain things about a request:

- who made it,
- which object it reached,
- and whether your rules allowed that.

That is the shape of an access. None of it requires the contents. To decide that user A should not have reached invoice 105, BoLD does not need the dollar amount on the invoice, the line items, or the customer's name. It needs the identity, the object reference, and the verdict. The sensitive interior of your users' lives is not part of the judgment, so it is not part of what BoLD keeps.

## Metadata, held briefly, then gone

This is a deliberate posture, not a default we drifted into.

- **Metadata, not payloads.** The who, the what, and the allowed-or-not. Not the message body, not the medical record, not the bank balance.
- **Held only as long as the judgment needs it.** Enough to evaluate the request and, if it was a violation, to hand you the proof. Not a warehouse of your traffic.
- **You stay in control.** BoLD watches because you pointed it at your app, on your terms, and you can see exactly what it would act on.

## A smaller target, not a bigger one

The point is simple. A tool that hoarded your payloads would make you less safe, because it would become the richest single target you own. BoLD is designed to be the opposite. It holds the least it can while still catching the one thing it exists to catch. The alarm carries enough to act on, and nothing more.

Security tools should shrink your risk surface, not quietly double it. That is the bar we hold ourselves to.

Read [what BoLD watches for in live traffic](/#promise), or [leave your email](/#early-access) and we will run a free check on your app using test accounts only.
