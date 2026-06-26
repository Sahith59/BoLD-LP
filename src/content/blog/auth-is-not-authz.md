---
title: "Logged in is not the same as allowed in"
date: "2026-06-21"
excerpt: "Two words get blurred in almost every app: authentication and authorization. The most common serious bug in software lives in the gap between them."
author: "The BoLD team"
tags: ["Fundamentals", "Authorization", "Explainer"]
---

Here are two words that sound interchangeable and are not. Most apps get the first one right and quietly skip the second, and the most common serious bug in modern software lives in the gap between them.

- **Authentication** is "who are you." Proving you are who you claim to be. Logging in.
- **Authorization** is "what are you allowed to do." Whether this specific person can do this specific thing to this specific record.

Logging in proves the first. It says nothing about the second.

## The hotel, not the front door

Think of a hotel keycard. Authentication is the front desk confirming you are a real guest with a booking. Good. But the card is supposed to do one more thing: open your room, and only your room.

Now imagine a hotel where every keycard opens every room. The front desk still checks people in correctly, every guest is genuinely a guest, and the building is wide open anyway, because being a guest was never meant to mean access to all the rooms. That is the bug. Authentication worked perfectly. Authorization was never wired up.

## Where software drops it

In an app, each "room" is an object loaded by its ID: an invoice, a message, a profile, a file. The code happily confirms you are logged in, then fetches the record by the number in the URL and hands it back, without ever asking whether that record is yours.

```
GET /invoice/104   ->   200 OK   (yours)
GET /invoice/105   ->   200 OK   (a stranger's, and nothing noticed)
```

This is broken object-level authorization, the [number one risk on the OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/). The entire bug is the distance between "you are logged in" and "this is yours."

## It is not a small-app problem

The United States Postal Service shipped this exact mistake. Its "Informed Visibility" API confirmed you were logged in, then let any usps.com account pull other users' account details, around 60 million of them. Authenticated the whole time, and still wide open, because authentication is not authorization. You can read [that case and others, fully sourced](/incidents).

## Why it has to be caught live

Here is the catch that sends people to BoLD. The gap is invisible from outside. The response is a clean `200 OK`, identical to a legitimate one. The only way to tell them apart is to know, at the moment of the request, that the person asking is not the person who owns the thing. That knowledge exists in exactly one place: the live request, with the real identity attached.

That is where BoLD stands, and the only place this is catchable. Read [how that detection actually works](/blog/how-bold-works).
