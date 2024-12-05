---
title: Async Rust
description: Reading About Async Rust from All sources
publishDate: Dec 01, 2024
tags: []
draft: true
---

- 


Problems with async rust - 
- Stream / chain / composing / PRIMITIVES 
- Send Bound problem 
- async Drop 
- IO uring --- cancellation safety and .... tonbo blog 




Polonius - What specific does it solve?

[Structured concurrency](https://blog.yoshuawuyts.com/tree-structured-concurrency/) 


Cancellation Safety
- Lack of async drop trait in Rust 
- Smol - cancel function - uses a separate thread 


What can we learn from smol runtime?

What can we learn from Nio / monoio ?


