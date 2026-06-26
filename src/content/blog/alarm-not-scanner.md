---
title: "Alarm, not scanner: why runtime assurance catches what scanners miss"
date: "2026-06-17"
excerpt: "Scanners answer 'could this app be broken?' on a timer, from outside. That is a useful question. It is not the one that wakes you up at 2am."
author: "The BoLD team"
tags: ["Runtime assurance", "Category", "Scanners"]
---

There is a reason your house has both a home inspector and a burglar alarm. They do different jobs. Application security has the same split, and most teams only own half of it.

## Two different questions

A scanner, a pentest, or a CI security check probes your app from the outside, on a schedule, and answers:

> Could this app be broken?

That is worth knowing. Run it before launch and it will catch a pile of issues. But it is a point-in-time snapshot of a system that changes every day, shipped by multiple engineers and, increasingly, AI agents.

Runtime assurance answers a different question, continuously, from inside the request path:

> Did a real user just get data that was not theirs?

One is about hypotheticals. The other is about what actually happened, thirty seconds ago, in production.

## Why the gap matters for access control

Access-control bugs are uniquely bad for scanners. To know whether a request was authorized, you have to know **who owns the object**. A scanner poking at your API from the outside usually does not, so the highest-impact category of bug is the one it is worst at judging.

Worse, the bug is invisible by nature. When BOLA fires, the response is a clean `200 OK`. There is no error to scan for, no stack trace, no anomaly in the logs. It only looks wrong if you already know that user A is not allowed to see object 105. That knowledge lives in the live request, with the real identity attached.

## This is not "replace your scanner"

We are not anti-scanner. The honest map looks like this:

- Run a scanner and a pentest **before launch** to catch what you can on a timer.
- Run BoLD **in production** for the violation that slips through anyway, the one a real user triggers when no one is testing.

They are complementary. A scanner is the inspection. BoLD is the alarm that stays on after everyone goes home.

## What an alarm owes you

An alarm that cries wolf is worthless, so runtime assurance has a higher bar than "something looks odd." When BoLD fires, it owes you proof: the exact request, the real owner, the mismatch, and the one-line fix, in plain English. It stays quiet on legitimately shared data and speaks only when ownership actually breaks.

That is the whole job. Not "this might be exploitable someday," but "a real request just succeeded that should not have."

See the [honest comparison](/compare) of BoLD versus scanners, pentests, and platform scans, or read [why your app passes every demo and still leaks](/blog/passes-every-demo).
