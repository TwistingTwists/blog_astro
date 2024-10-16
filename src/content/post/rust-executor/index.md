---
title: Making a deterministic executor in Rust
description: This is an attempt to understand what does in making of a deterministic executor in rust.
draft: true
tags:
  - rust
publishDate: Oct 14 2024
---

## Need for ~~Speed~~ Resources

  

Broadly, computer systems do two things.

1. CPU heavy tasks (number crunching) : continuously doing a lot of work.

2. CPU light tasks (io) : which includes *mostly* waiting, then doing a little work.

so, `io = wait + do`. Remember this. It'll be useful soon.

  

// todo verify

If you are an OS, you have threads. which are a way to map the computation from your code to CPU.

  

What are a list of *io* style works? - _waiting_ for X. X could be network, file system, disk to respond, etc.

  

```quiz

If one shirt dries in 15 minutes of sun, how long for 10 shirts dried together?

Turns out, laundry is secretly teaching us all about parallel processing. Who knew?

```

  

For these io bound works, we need to optimize the waiting time.

Examples of IO bound tasks: API calls, disk reads

examples of compute heavy tasks: complex calculations - like image manipulations , prime_factor caclulation, etc.

  
  
  

## The building blocks of Async Rust

  

Say, you want to compute `5*5` 1 minute from now. What do you do?

You _wait_ for 1 min.

now, _do_ `5*5 = 25`.

  

Now, we can represent 25 in a data structure nicely. (i32, u32 , ...)

How to capture the _wait_ part of the io in a data strucutre?

Hmm.

  

#### Welcome to Future`s`

  

> Futures represent asynchronous computations that may not have completed yet but will at some point in the future.

  

Looks like, `Futures` is the *behaviour* of data structure we need. It represents a computation that *may* or *may not* finish in future.

  

So, how do we define behaviour of data in Rust? Traits. Let's see what Future trait might look like.

  

```rust

trait SimpleFuture {
	type Output;
	fn poll(&mut self, wake: fn()) -> Poll<Self::Output>;
}

  

enum Poll<T> {
	Ready(T),
	Pending,
}

```

  

Wait, what? `poll`, `wake` and `Poll`, so much at once!? Let's make sense of this bit-by-bit.

  

##### The Poll Enum

  

`Poll::Ready(T)` = represents the data after `do` part finishes successfully.

`Poll::Pending` = represents ongoing `wait`

  

Since our io is doing only of things at a time - wither _wait_ or _do_ => we can represent that part as enum. So far so good.

  

Remember, we are trying to model `io` here.

actually, `io = wait + do + wait + ... do` a more accurate representation.

  

##### Advancing Time

  

Now, how can we wait for timer to finish?

  

- by advancing time artifically

- by waiting for time to pass so that timer ends

  

While directly advancing system time is generally unwise in production software, strategically manipulating time in controlled settings is a valuable technique for testing, simulation, and training purposes.

  

<summary>

In deterministic simulation testing, you control time, faults, and several other things to 'create' conditions that would rarely occur in combination to find out new ways where the system can fail.

Read more on <a href="https://notes.eatonphil.com/2024-08-20-deterministic-simulation-testing.html">Eaton Phil's on What is DST?</a>, <a href="https://www.warpstream.com/blog/deterministic-simulation-testing-for-our-entire-saas">warpstream uses DST</a>, <a href="https://tigerbeetle.com/blog/2023-07-11-we-put-a-distributed-database-in-the-browser">tigerbeetle wrote their own DST - VAPOR</a>

</summary>

  
  

So, we go with other alternative -> wait for the timer to end. Or we can wait *simultaneously* for _many_ timers to progress partially. (remember the laundry example?)

  

<think-through>

Imagine managing a 3-second microwave popcorn timer, a 5-second water boiler, and a 10-minute cookie timer.

  

Sequential waiting takes the full 18 seconds (3 + 5 + 10) because you wait for each to finish before starting the next.

  

Concurrent waiting lets you multitask. While the popcorn cooks (3 seconds), you're also watching the water. You're essentially doing both at the same time. The TOTAL time is no longer just adding them up. Instead, the longest task (the 10-second cookies) now dictates the MINIMUM time. You'll likely finish EVERYTHING a bit after 10 seconds, saving you almost 8 seconds compared to the sequential way!

</think-through>

  

> With `wait` (io = wait + do), there's always a chance the future might be cancelled before `do` gets a chance to run. Futures can be cancelled, leaving you waiting for something that might never come.

  

## The pieces of Async Rust

  

### Task

Futures the foundation upon which tasks are built. When a future is spawned onto an executor, it becomes a task, gaining the additional state management capabilities needed for efficient scheduling and execution.

  

Runnable + Task

  
  

A task is essentially a stateful future that has been allocated on the heap. It encapsulates not just the future itself, but also additional state information that tracks whether the future is ready to be polled, waiting to be woken up, or has completed its execution.

  

### Executors

  

Executors are responsible for managing and running these tasks. At their core, executors maintain a queue of scheduled tasks. They decide when and how to poll futures, effectively driving the progress of asynchronous operations. Executors handle the complexity of task scheduling, ensuring efficient utilization of system resources.

  

### Runtime and OS Threads

  

The Runtime provides the environment in which these executors operate. It sets up the necessary infrastructure for asynchronous execution, including thread pools, I/O event loops, and timer facilities. The runtime is what brings together the various components of the asynchronous ecosystem.

  
  

Then the essential pieces of the Async Implementation.

  

`Wait, but why?`

  

Why would you need to do it yourself?

- Zed does it.

- Tokio does it.

- Why would I ever need it?

  
  

For the same reason you [read DDIA](https://dataintensive.net/) first, and then implement distributed systems. [Reading comes first, right?](https://www.warpstream.com/blog/dealing-with-rejection-in-distributed-systems#:~:text=This%20helps%20people%20build%20a%20great%20foundation%2C%20but%20there%20are%20some%20topics%20that%20simply%20aren%E2%80%99t%20well%20covered%20by%20the%20literature.%20These%20topics%20include%20things%20like%3A)

  
  

### Dealing with Futures

  

Blocking.

- What is blocking anyway? > 8ms on main thread => you skip a frame!

- for loop on main thread -> CPU intensive task => blocked main thread. So, yield at the end of the for loop. Yield machinery is a unit `()` yielding task that returns the control back to main thread after each iteration.

-

  

https://claude.ai/chat/abf68566-4a05-4cb2-96ad-9a1148f6c2ee

  

## Concurrency Primere

  

-

  

Flow control in TCP:

- normal data flow works until deadlock happens due to zero window buffer at receiver end.

  

<details>

  

=> Sender stops sending data.

</details>

  
  
  
  
  

### no-std executor in rust - example github

https://github.com/mgattozzi/whorl?tab=readme-ov-file

https://mgattozzi.substack.com/p/whorl

  
  

1. deterministic executor in rust - Zed

2.

  
  

### Hard parts of concurrency

  

Premise: Easy concurrency (fault tolerance?) involves quick restart of processes? and automatic restart in faults.

  

#### Exception Handling

  

1. Usual exceptions: Children and traps

  

[Exceptions may happen even if the child process 'dies' successfully.](https://learnyousomeerlang.com/errors-and-processes#:~:text=Exception%20source%3A,what%20processed%20failed.)

  

- Child may die after completing given task successfully. Or Not.

- Parent may want to pass the child's exit (sucess / failure) to it's parent. Or Not.

  

2. Created / User-induced exceptions: Killing Child processes, self and parent

  

Something went bad. Process exited with :normal, reason.

  

Now imagine, P0 -> P1(T) -> P2(T) -> C1

(T): trapping_exits

  

C1 dies => sends Trap Signal to P2

Now, P2 is *somehow* not responsive. P1 might want to kill P2. Ok. so it sends `kill` signal. But then, P2 dies => P1 receives a Trap Signal that it's child P2 died. And P1 is also stuck. oops.

  

So, at least one signal (`kill`) should not be `trappable` => kill propagated all the way to parent.

  

#### Shared State

  

####

  
  

### The Cost of Concurrency: Nothing's Free

  

While async programming offers significant benefits for I/O-bound tasks, it's important to understand that it's not a magical solution without costs. Let's briefly consider some of the overheads:

  

1. **Context Switching:** Even though async tasks are lighter than OS threads, there's still a cost to switching between them. The executor needs to save and restore task state, which takes CPU cycles.

  

2. **Memory Overhead:** Each task requires some memory to store its state. While this is generally less than a full thread, it's not zero.

  

3. **Increased Complexity:** Async code can be harder to reason about and debug. This cognitive overhead shouldn't be underestimated.

  

4. **Runtime Costs:** The async runtime itself consumes resources. It needs to manage task queues, handle wakeups, and coordinate with the underlying system.

  

5. **Fair Scheduling / execution time:** If not carefully managed, some tasks might experience higher latency due to unfair scheduling or blocking operations.

  

Let's visualize this with a simple example:

  

```rust

async fn do_work() {

// Simulate some async work

tokio::time::sleep(Duration::from_millis(10)).await;

}

  

#[tokio::main]

async fn main() {

let start = Instant::now();

  

let mut tasks = vec![];

for _ in 0..1_000_000 {

tasks.push(tokio::spawn(do_work()));

}

  

for task in tasks {

let _ = task.await;

}

  

println!("Time elapsed: {:?}", start.elapsed());

}

```

  
  

### read (toread)

  

details of building your own executor in rust. - https://www.youtube.com/watch?v=ms8zKpS_dZE&feature=youtu.be

  

questions to answer - https://www.perplexity.ai/search/write-a-list-of-questions-to-b-VWWTDc6TRDer0FaiJRXR0g

  

### Random, may include

  

Well, not all async are same.

  
  

--> discussion on stackful and stackless coroutine - [link1](https://x.com/HSVSphere/status/1829272869374964019)

First off, I need to clarify something. Not all async is the same, and I'm going to compare two types - stackful coroutines and stackless coroutines.

  

So? What are stackful coroutines?

  

They are, to put it simply, a userspace implementation of kernel threads: