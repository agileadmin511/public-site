---
title: 'Understanding Linux namespaces'
description: 'A practical mental model for the isolation primitive beneath containers.'
pubDate: 2026-09-10
updatedDate: 2026-09-12
tags:
  - linux
  - containers
  - infrastructure
draft: false
---

> Example content: replace or remove this article before launch.

Namespaces answer a narrow question: **which view of a global resource should this process see?** A process in a PID namespace sees a different process tree; a process in a mount namespace sees a different filesystem topology.

## The useful mental model

A namespace does not emulate a machine. It changes the process's view of one category of kernel resources. Containers emerge when several namespaces are combined with cgroups, filesystem layers, and security controls.

| Namespace | Isolates                   | Common use               |
| --------- | -------------------------- | ------------------------ |
| `pid`     | Process IDs                | Separate process trees   |
| `net`     | Network devices and stacks | Per-container networking |
| `mnt`     | Mount points               | Isolated filesystems     |
| `uts`     | Hostname and domain name   | Container identity       |

## Inspect a running process

Linux exposes namespace membership through `/proc`:

```bash
$ ls -l /proc/$$/ns
lrwxrwxrwx net -> 'net:[4026531840]'
lrwxrwxrwx pid -> 'pid:[4026531836]'
lrwxrwxrwx uts -> 'uts:[4026531838]'
```

Two processes whose namespace links have the same inode are members of the same namespace for that resource.

## Create a small experiment

Run a shell in a new UTS namespace and change its hostname:

```bash
sudo unshare --uts --fork /bin/bash
hostname field-notes
hostname
```

Open another terminal and check the host's name. It remains unchanged because the new shell sees its own UTS namespace.

## Where isolation ends

Namespaces are not a complete security boundary. A production container also needs least-privilege capabilities, syscall filtering, sensible mounts, resource controls, and an appropriately configured runtime. Isolation is a composition, not a switch.

For a broader operational view, continue with the [Linux networking guide](/guides/linux-networking/).
