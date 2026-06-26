---
title: "An alarm you can trust: telling a real violation from data you meant to share"
date: "2026-06-24"
excerpt: "A smoke alarm that goes off when you make toast gets its battery pulled. The hard part of a security alarm is not noticing access. It is knowing which access was wrong."
author: "The BoLD team"
tags: ["Trust", "False positives", "Product"]
---

There is a reason most security alarms end up muted. They cry wolf. A tool that flags everything teaches you to ignore it, and an ignored alarm is worse than no alarm, because it cost you money and handed you a false sense of cover.

So the real test of runtime assurance is not "can it notice that user A touched user B's record." That part is easy and nearly useless on its own, because a huge amount of perfectly legitimate access looks exactly like that.

## Sharing is normal, and it is everywhere

Apps are built on people reaching data that is not strictly "theirs," on purpose:

- A doctor opens a patient's chart. Different person, fully authorized.
- A support agent reads your ticket to help you. Not their account, completely fine.
- A teammate views a document you shared into the project.
- An admin runs an action across many accounts, by design.

A naive rule that screams "different user touched another user's object" fires on every one of these, all day. You would mute it inside a week. That is the trap, and it is why a noisy access tool is worthless no matter how sensitive it is.

## The line BoLD actually draws

BoLD does not ask "did one user reach another user's data." It asks a sharper question:

> Did a request succeed that your own rules say should have been refused?

The doctor, the support agent, the teammate, and the admin each have a path that grants the access. That grant is real, and BoLD treats it as the legitimate sharing it is. It stays quiet. It speaks only when access lands with no grant behind it at all, the case where the ownership check was simply missing and a stranger walked off with a record. That is the difference between a feature and a breach, and it is the only thing worth waking you for.

## The bar before it makes a sound

Because trust is the entire product, the bar to fire is high. When BoLD does speak, it owes you a case you can verify in seconds, not a vague "something looks odd":

- the request that succeeded,
- the real owner of the object,
- the mismatch, with no grant to explain it,
- the one-line fix, in plain English.

An alarm that clears that bar is one you leave armed. That is the point. Detection is cheap. An alarm you trust enough to keep switched on is the hard and valuable thing, and it is the thing BoLD is built to be.

See the [honest comparison](/compare) of BoLD against scanners and pentests, or read [how the alarm is wired into the request path](/blog/how-bold-works).
