---
title: "What is BOLA, and why AI-coded apps ship it by default"
date: "2026-06-23"
excerpt: "Broken object-level authorization is the number one API vulnerability. It is also the easiest one to ship without noticing, especially when an AI wrote your code."
author: "The BoLD team"
tags: ["BOLA", "Fundamentals", "API security"]
---

Most security bugs are exotic. This one is not. It is a single missing check, it has a name, and it is the most common serious flaw in modern apps.

## The bug in one sentence

Your app checks that a user is **logged in**. It never checks that the data they asked for is **theirs**.

That gap is broken object-level authorization, usually shortened to BOLA (you may also know it as IDOR, an insecure direct object reference). Picture a page that loads a record by its ID:

```
GET /invoice/104   ->   200 OK   (your invoice, looks perfect)
GET /invoice/105   ->   200 OK   (someone else's invoice)
```

The app confirmed you were signed in, then handed back invoice 105 without ever asking whether 105 belongs to you. No error. No alert. Nothing in a log to tell you a stranger's record just walked out the door.

## Why it is the number one API risk

This is not our framing. The OWASP API Security Top 10 lists it first, as [API1:2023 Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/), and notes that BOLA shows up in a large share of real API attacks. The reason it ranks so high is brutal simplicity:

- Every endpoint that takes an ID and returns an object is a candidate.
- Exploiting it requires no special tools. You change a number.
- It is **invisible** to the owner. The request succeeds, so nothing looks wrong.

## Why AI-coded apps ship it by default

An AI coding assistant is very good at the happy path: load the record, render the page, make the demo work. The ownership check is the part a human security reviewer adds, and it is exactly the part that gets skipped when no human is reviewing.

The data backs this up. The Veracode 2025 GenAI Code Security Report found that roughly **45% of AI-generated code introduced an OWASP Top 10 vulnerability**. Access control is right at the top of that list. When you ship fast with generated code and real users, you are statistically likely to ship a BOLA somewhere.

It is worse in a demo, because a demo only ever opens *your own* data. The flaw needs a second user to exist before it can break. So it passes every test you run, and waits.

## What a real check looks like

The fix is not clever. On every object access, confirm the caller owns it:

```
record = db.get(invoice_id)
if record.owner_id != current_user.id:
    return 403   // not yours
```

Simple to write, easy to forget, and impossible to verify from the outside without knowing who owns what.

## Where BoLD fits

You can write the check. You can scan for missing checks before launch. But the one that slips through any of that only reveals itself in production, when a real user reaches a real record that is not theirs.

That is the moment BoLD is built for. It sits in the request path, watches live traffic, and fires the instant an access succeeds that should not have, with the request, the owner, the mismatch, and the one-line fix.

See the [request-by-request walkthrough](/#flaw), or read the [real incidents](/incidents) where this exact bug leaked data at companies you have heard of.
