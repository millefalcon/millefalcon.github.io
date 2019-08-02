---
layout: page
title: strace journey
description: The time i had to strace a process that spawned child processes
---

I was getting empty results from a process that forked a child process. I tried to use `strace -p <pid> -s9999` to get the trace for the running process. But i didn't get any read,write,open system calls.

The i came to know about the strace `-f` option.

	$  strace -h | grep -- -f
  	-f             follow forks
  	-ff            follow forks with output into separate files

Since the main process used to fork child processes, i needed to use that option.

	strace -p <pid> -s9999 -f -o process.trace

One can also filter only the required system calls from strace using;

	strace -p <pid> -f -e trace=read,write,open -o process.trace

  Now, i could the see traces from the child processes, and found that the problem was with the child unable to read/write some file because of permission issues.

