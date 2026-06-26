---
title: "Your AI app passes every demo and still leaks"
date: "2026-06-25"
excerpt: "The reason is almost funny: a demo only ever opens your own data. The bug needs a second user to exist before it can break. So it waits."
author: "The BoLD team"
tags: ["AI-coded apps", "Founders", "BOLA"]
---

You built the thing in a weekend. It works. You clicked through every screen, the data loaded, the demo to investors went clean. Then a second real user signed up, and one of them could read the other's records.

This is not bad luck. It is the single most predictable failure in an AI-coded app, and the reason it slips past you is structural.

## Why the demo lies

When you test your own app, you are logged in as you, opening your own data. Every request you make is legitimately yours. The ownership check, the one thing that is missing, never gets exercised, because you never try to open someone else's record.

The flaw only appears when **two different users and their data exist at the same time**. That almost never happens in development. It always happens in production. So the bug passes every test you run and activates the moment you have customers.

## Why AI makes it more likely, not less

An assistant writes the code that makes the feature work: fetch the record, render the page. It is genuinely good at that. The part it skips is the boring guard clause that says "but only if this record belongs to the person asking."

The numbers are not subtle. The Veracode 2025 GenAI Code Security Report found that roughly **45% of AI-generated code introduced an OWASP Top 10 vulnerability**, and broken access control sits at the top of that list. Generated code ships faster, which means the gap between "it works" and "real users have data in it" is shorter than it has ever been.

## What to actually do about it

You do not need to slow down. You need two things working together:

1. **Before launch:** run a scanner or a pentest. It catches a lot of the obvious holes on a timer.
2. **In production:** watch the live request path for the violation that slips through anyway, the one a real second user triggers when no one is testing.

The first is the inspection. The second is the alarm. Most teams shipping AI-coded apps have neither for access control specifically, which is exactly the category that hurts the most.

## The honest version

Here is the thing nobody selling you a scanner will say plainly: the most dangerous access bug is invisible to scanners, silent in your logs, and absent from every demo. It looks like a normal `200 OK`. The only place it is detectable is the live request, with a real identity reaching a real object it does not own.

That is the one moment BoLD is built to catch.

Read [what BOLA actually is](/blog/what-is-bola), or [leave your email](/#early-access) and we will run a free check on your live app, test accounts only, and show you exactly what we would catch.
