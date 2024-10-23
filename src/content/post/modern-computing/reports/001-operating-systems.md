---
title: Operating Systems - Modern Cheatsheet
description: Cheatsheet for some comparisons in advancements in OS
draft: true
tags:
  - modern-computing
  - cheatsheet
publishDate: Oct 16 2024
---
Memory access values every programmer should know 
1. in ms 
2. in days ****


| Type                     | New                   | Implications                     | Similar tech?                                                                                                                      |
| ------------------------ | --------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Application Architecture | Thread-per-core model | 1. Reduce Tail Latency by 71%[1] | Erlang runs the scheduler one per core? and by nature processes don't share the data => thread-per-core wayyyy before anyone else. |
|                          |                       |                                  |                                                                                                                                    |
Recent improvements: 
- [A context switch (OS) between threads might be more expensive than an I/O operation! ](https://lore.kernel.org/io-uring/4af91b50-4a9c-8a16-9470-a51430bd7733@kernel.dk/T/#u), ie. modern NVMe devices having response times in the ballpark of an operating system context switch.
- Key Insight: application-level data partitioning can eliminate thread synchronization and applications can restrict themselves to using asynchronous OS interfaces
- Result: [Reduce Tail Latency by 71%](https://helda.helsinki.fi/server/api/core/bitstreams/3142abaa-16e3-4ad0-beee-e62add589fc4/content)

> Case In point: Redis is single threaded.  [Why?](https://www.youtube.com/watch?v=h30k7YixrMo) 

Thread-per-core
- the thread-per-core application architecture, each thread is pinned to a CPU core which is dedicated for that thread.

## Managing Resources

| Type              | +                                                                    | -                                                                                                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SHARED NOTHING    | improves CPU cache efficiency and eliminates thread synchronization. | limit system throughput for **skewed workloads** because only one CPU core can operate on a specific part of the application data                                                                                                       |
| SHARED EVERYTHING |                                                                      | - need to leverage **lockless** data structures and use **asynchronous wait-free** data structures to eliminate blocking behavior<br><br>- data bounces between CPU caches and that thread synchronization limits multicore scalability |
| SHARED SOMETHING  | It Depends.                                                          |                                                                                                                                                                                                                                         |

Similar Tech 
1. thread-per-core framework for C++ called [Seastar](http://seastar.io/), the engine that is behind the [ScyllaDB](https://www.scylladb.com/) NoSQL database.
2. Erlang VM?


Implementation 
- [glommio](https://www.datadoghq.com/blog/engineering/introducing-glommio) 
- [dbeel](https://github.com/tontinton/dbeel) : Thread-per-core document DB