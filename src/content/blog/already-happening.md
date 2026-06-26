---
title: "It's already happening: real breaches, one pattern"
date: "2026-06-20"
excerpt: "From an 885-million-document leak to a hiring chatbot for the world's largest restaurant chain, the same missing check keeps showing up. Here is the through-line."
author: "The BoLD team"
tags: ["Incidents", "BOLA", "Receipts"]
---

It is tempting to treat access-control bugs as theoretical. They are not. Below are five real, publicly reported incidents. They span fourteen years, a postal service, a chip maker, a fitness brand, and a vibe-coded startup. Every one leaked the same way: the app never checked who owned the data it handed back.

## First American Financial, 2019

A document-retrieval link used a sequential ID and required **no login at all**. Change the number in the URL and you got anyone's records: bank account numbers, Social Security numbers, mortgage and wire-transfer paperwork, going back to 2003. Roughly **885 million documents** were exposed. A textbook insecure direct object reference, at almost incomprehensible scale.

## USPS "Informed Visibility", 2018

This one is the textbook BoLD case. The API confirmed you were logged in, then never checked the data was yours. Any usps.com account could query other users' details, and in some cases modify them. About **60 million users**. Authenticated, and still wide open, because authentication is not authorization.

## Peloton, 2021

Peloton's API answered requests for account data without checking the caller was allowed to see it. It returned age, gender, city, weight, and workout stats, **even for profiles the user had set to private**. The data was not stolen by criminals first. A researcher found it, and it sat open until a reporter asked about it.

## McDonald's hiring AI, 2025

The McHire chatbot, built on Paradox.ai, had a test admin account using the password `123456` with no MFA. Behind it, an IDOR on sequential applicant IDs: decrement the number and you read other applicants' chat transcripts and contact details. Up to **64 million records** exposed. Patched the same day it was reported.

## GitHub and Ruby on Rails, 2012

The oldest, and still the cleanest lesson. A researcher added one hidden field to the SSH-key form, a mass-assignment flaw, bound his key to another account, and committed straight to the Ruby on Rails repository. **Write access to one of the most important repos in the world**, from a single parameter the server should never have trusted.

## The through-line

Notice what none of these required. No zero-day. No malware. No genius. Just a request that succeeded when it should have been refused.

> The wrong user, or the wrong role, did the wrong thing to the wrong object, or saw the wrong data.

That sentence describes every case above. It is also the exact condition BoLD watches for in live traffic.

Every figure here is sourced. Read the [full incident write-ups with primary links](/incidents), or see [how the leak actually happens, request by request](/#flaw).
