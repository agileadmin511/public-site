---
title: 'The small-service production checklist'
description: 'The handful of operational properties worth adding before a service meets real traffic.'
pubDate: 2026-08-24
tags:
  - reliability
  - operations
  - software
draft: false
---

> Example content: replace or remove this article before launch.

Small services deserve proportionate engineering. They rarely need a platform, but they always need a few deliberate answers.

## Before the first request

- Define a health check that tests the service, not merely the process.
- Set request and dependency timeouts.
- Emit structured logs with a request identifier.
- Handle shutdown signals and stop accepting new work.
- Document the rollback path.

The goal is not exhaustive machinery. It is enough visibility and control to distinguish a bad deploy from a bad dependency.

## Configuration should fail clearly

Validate configuration at startup:

```typescript
type Config = {
  port: number;
  databaseUrl: string;
};

export function loadConfig(env: NodeJS.ProcessEnv): Config {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  return { port: Number(env.PORT ?? 3000), databaseUrl: env.DATABASE_URL };
}
```

An immediate, specific failure is cheaper than a delayed failure on the first request.

## Put limits at every boundary

Timeouts, payload limits, concurrency limits, and bounded retries prevent one slow dependency from consuming every available worker. Retrying without a budget simply turns a partial failure into more traffic.

```yaml
retry:
  attempts: 3
  backoff: exponential
  total_timeout: 2s
```

Ship the smallest system you can still understand at 03:00.
