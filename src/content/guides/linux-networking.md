---
title: 'A field guide to Linux networking'
description: 'A repeatable path for debugging connectivity from the process outward.'
pubDate: 2026-07-18
updatedDate: 2026-08-01
tags:
  - linux
  - networking
  - infrastructure
draft: false
---

> Example content: replace or remove this guide before launch.

When a connection fails, work outward from the process. Each step should prove or eliminate one layer rather than produce a pile of unrelated output.

## 1. Confirm the listener

```shell
sudo ss -lntp
```

Check the address as well as the port. A process listening on `127.0.0.1:8080` cannot accept a connection addressed to the host's external interface.

## 2. Resolve the name

```shell
getent ahosts api.example.test
```

This uses the system resolver path and therefore reflects `/etc/hosts`, NSS configuration, and DNS.

## 3. Inspect interfaces and routes

```shell
ip -brief address
ip route get 203.0.113.10
```

The route lookup answers which interface, next hop, and source address the kernel intends to use.

## 4. Test transport directly

```shell
curl --verbose --connect-timeout 3 https://api.example.test/health
```

Read the sequence: resolution, connection, TLS negotiation, request, response. The last completed stage narrows the failure domain.

## 5. Capture only what you need

```shell
sudo tcpdump -ni any 'host 203.0.113.10 and tcp port 443'
```

A narrow filter reduces noise and the chance of collecting unrelated data. Avoid capturing payloads in environments that carry sensitive information.

## Diagnostic order

| Question                    | Tool           |
| --------------------------- | -------------- |
| Is anything listening?      | `ss`           |
| Does the name resolve?      | `getent`       |
| Which route will be used?   | `ip route get` |
| Does the protocol complete? | `curl`         |
| What crossed the interface? | `tcpdump`      |
