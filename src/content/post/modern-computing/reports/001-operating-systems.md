---
title: Operating Systems - Modern Cheatsheet
description: Cheatsheet for some comparisons in advancements in OS
draft: true
tags:
  - modern-computing
  - cheatsheet
publishDate: Oct 14 2024
---
Memory access values every programmer should know 
1. in ms 
2. in days 


| Type                     | New                   | Implications                     | Similar tech?                                                                                                                      |
| ------------------------ | --------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Application Architecture | Thread-per-core model | 1. Reduce Tail Latency by 71%[1] | Erlang runs the scheduler one per core? and by nature processes don't share the data => thread-per-core wayyyy before anyone else. |
What is in? Long version
- A context switch (OS) between threads is more expensive than an I/O operation! [2]


Similar Tech 
1. thread-per-core framework for C++ called [Seastar](http://seastar.io/), the engine that is behind the [ScyllaDB](https://www.scylladb.com/) NoSQL database.
2. Erlang VM?
3. 

References: 

[1](https://helda.helsinki.fi/server/api/core/bitstreams/3142abaa-16e3-4ad0-beee-e62add589fc4/content)
[2](https://lore.kernel.org/io-uring/4af91b50-4a9c-8a16-9470-a51430bd7733@kernel.dk/T/#u)
[3](https://www.datadoghq.com/blog/engineering/introducing-glommio/)