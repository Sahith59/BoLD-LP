---
title: "Found in seconds, or found in months: why time-to-detect is the whole game"
date: "2026-06-19"
excerpt: "The average breach in 2024 took 258 days to find and shut. For access and identity bugs it is worse. Every one of those days is records walking out the door."
author: "The BoLD team"
tags: ["Detection", "Breach economics", "Runtime assurance"]
---

The damage from a breach is not set the moment it starts. It is set by how long it runs before anyone notices. And the honest numbers on "how long" are grim.

## 258 days

According to IBM's 2024 Cost of a Data Breach Report, the average breach took **258 days to identify and contain**. That was a seven-year low, the good-news version of the number. Two hundred and fifty-eight days is more than eight months of an open door before anyone shut it.

It gets worse for the category BoLD watches. The same report found that breaches beginning with stolen or compromised credentials, the identity and access failures, took the **longest of any type to spot and stop, close to ten months**. The bugs that hurt the most are also the ones that hide the longest. ([IBM Cost of a Data Breach 2024](https://newsroom.ibm.com/2024-07-30-ibm-report-escalating-data-breach-disruption-pushes-costs-to-new-highs).)

## Why so long

A broken-access leak is built to hide. When it fires, the response is a clean `200 OK`. There is no crash, no error in the logs, no anomaly to trip over. Nothing announces that a stranger just read a record. So it sits, quietly, for months, until a researcher, a reporter, or a customer stumbles onto it. Every incident in [our receipts](/incidents) was found that way, by accident, long after it began.

## Time is the cost

This is why the clock matters so much. The bill from a breach scales with how long it ran: more records out, more customers affected, more regulators asking questions, more trust gone. A leak caught on day one and a leak caught on day 250 are not the same event. They are the same bug with wildly different price tags.

The same IBM report points straight at the lever: organizations using security automation to detect and respond caught and contained incidents, on average, **98 days faster**. Speed of detection is not a nice-to-have. It is most of the cost.

## Where a scanner cannot help

A scanner runs before launch and answers "could this be broken." Useful, on a timer. But the breach does not politely start during the scan. It starts on day 40, in production, when a real second user trips a bug no test exercised. From that moment until someone notices, you are running blind, and the average length of "blind" is eight months.

Runtime assurance exists to collapse that number. An alarm in the request path does not wait for the quarterly scan or the unlucky researcher. It fires when the violation happens, turning eight months of silent exposure into a single alert you can act on the same afternoon.

Months, or minutes. That gap is the entire reason BoLD is an alarm and not another scanner. Read [why that distinction matters](/blog/alarm-not-scanner), or see [how the alarm is wired in](/blog/how-bold-works).
