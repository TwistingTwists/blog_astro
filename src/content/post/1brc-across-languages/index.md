---
title: 1brc - Same Tricks Across Languages
description: This is a cheatsheet to refer when remembering to optimise software systems.
draft: true
tags:
  - 1brc
publishDate: Oct 14 2024
---

This is a cheatsheet  of optimisations done for 1brc challenges. It tries to summarise and put the optimisations in perspective. 

We hope that you know what 1brc is. If not, read [1](https://github.com/gunnarmorling/1brc), [2](https://www.morling.dev/blog/1brc-results-are-in/). 

### Data encoding - To and Fro from String  

| Trick                                                                                  | Outcome                                                                                     | Note                                                                                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| just process raw bytes from the file. Don't convert to `String`                        | [~10% perf](https://github.com/gunnarmorling/1brc/discussions/57#discussioncomment-8153186) |                                                                                                          |
| parsing cities and float values<br>                                                    |                                                                                             | parsing after assuming only one place after decimal.                                                     |
| <br>[Branchless Programming via Bit Manipulation](https://youtu.be/EFXxXFHpS0M?t=1255) |                                                                                             |                                                                                                          |
| SWAR = SIMD as a register                                                              |                                                                                             | If the data looks like `Tokio;13.4` and we want to find `;`<br><br>using 8 operations, you can find `;`. |


### Reading files from disk


| Trick                                                                                                                                         | Outcome                                                                                     | Note                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reading files in chunks [golang](https://www.bytesizego.com/blog/one-billion-row-challenge-go#:~:text=Reading%20file%3A%20Read%20in%20chunks) | [~10% perf](https://github.com/gunnarmorling/1brc/discussions/57#discussioncomment-8153186) |                                                                                                                                                                                                                       |
| mmap                                                                                                                                          |                                                                                             | [mmap the input file. Split input based on core count and run it with a thread per core.](https://github.com/gunnarmorling/1brc/discussions/57#discussioncomment-8041416)<br><br>mmap is an unsafe operation in Rust. |
| <br>[Branchless Programming via Bit Manipulation](https://youtu.be/EFXxXFHpS0M?t=1255)                                                        |                                                                                             |                                                                                                                                                                                                                       |

  

### With OS threads and parallelism - go brr!


- address the go routine + rust tokio task + erlang processes?

[~ 4-6x gains](https://benhoyt.com/writings/go-1brc/#:~:text=Processing%20the%20input%20file%20in%20parallel%20provides%20a%20huge%20win%20over%20r1%2C%20taking%20the%20time%20from%201%20minute%2045%20seconds%20to%2022.6%20seconds.)

4. Float handling

Don't do floating point operations. Use int.

[20% speed gains](https://github.com/gunnarmorling/1brc/discussions/57#discussioncomment-8024568)

Use fixed size integers

[~10% gain in golang](https://benhoyt.com/writings/go-1brc/#:~:text=Solution%204%3A%20fixed%20point%20integers)

### The Hashmap - simpler hash function

| Trick                                                                                                                                                                                                                        | Outcome                                                                                                                                                                                                                        | Note                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Fixed Size hash table 10k](https://github.com/gunnarmorling/1brc/discussions/57#:~:text=Treat%20the%20first%20eight%20bytes%20of%20the%20name%20as%20a%20hash%20key%20into%20a%20fixed%20size%2010k%20item%20hash%20table.) | [~40% gain - the custom hash table cuts down the time from 41.3 seconds to 22.1s.](https://benhoyt.com/writings/go-1brc/#:~:text=the%20custom%20hash%20table%20cuts%20down%20the%20time%20from%2041.3%20seconds%20to%2022.1s.) | How to resolve collisions?<br><br>-  Find first unoccupied slot<br>- <br>[if hash collide, goto next empty slot algorithm](https://benhoyt.com/writings/go-1brc/#:~:text=It%E2%80%99s%20a%20simple%20implementation%20that%20uses%20the%20FNV%2D1a%20hash%20algorithm%20with%20linear%20probing%3A%20if%20there%E2%80%99s%20a%20collision%2C%20use%20the%20next%20empty%20slot.) |
| Hash key - Integer, not String                                                                                                                                                                                               | [4x gain in a different context](https://youtu.be/SVw9nKfVPx4?t=501)                                                                                                                                                           | Profiler showed that most of the time is spent in `Hashmap.get`.                                                                                                                                                                                                                                                                                                                 |
|                                                                                                                                                                                                                              |                                                                                                                                                                                                                                |                                                                                                                                                                                                                                                                                                                                                                                  |


  
 

### Concurrency


1. while reading the file -> creating the data structure (HashMap)

> [Golang - producer consumer channels](https://www.bytesizego.com/blog/one-billion-row-challenge-go#:~:text=Sending%20a%20slice%20of%20lines%20on%20the%20channel)

2. while calculating the final results from HashMap (^1.)

> [Too Many GoRoutines](https://www.bytesizego.com/blog/one-billion-row-challenge-go#:~:text=Concurrency%3A%20process%20each%20station%E2%80%99s%20min%2C%20max%20and%20average%20temperature%20in%20a%20separate%20goroutine)

3. Collecting the file chunks in hashmaps -> consuming them (producer consumer)

> This can be done only after (^2.) chunked file read

  

Building the hashmap after reading