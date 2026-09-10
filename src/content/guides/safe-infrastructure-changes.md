---
title: 'Make infrastructure changes safely'
description: 'A compact workflow for reviewable, reversible changes to shared systems.'
pubDate: 2026-06-30
tags:
  - infrastructure
  - operations
  - terraform
draft: false
---

> Example content: replace or remove this guide before launch.

Safety comes from controlling the size of a change and preserving a way back. Tooling helps, but the shape of the work matters more.

## Make the change observable

Write the expected outcome before editing configuration. Identify one signal that confirms success and one that reveals harm.

```terraform
resource "example_service" "api" {
  name        = "field-notes-api"
  replicas    = 2
  health_path = "/health"
}
```

## Review the concrete plan

```bash
terraform fmt -check
terraform validate
terraform plan -out=change.plan
```

Treat replacement, deletion, and permission expansion as high-signal events. Do not let a large plan make those lines invisible.

## Use a bounded sequence

1. Apply to the smallest representative scope.
2. Observe the predefined signals.
3. Pause if the result differs from the prediction.
4. Expand only after the first scope is healthy.

## Record the recovery path

A rollback is an executable procedure, not the sentence “revert if needed.” Note the exact prior version, the command or workflow that restores it, and any data compatibility constraint.

```sql
-- Prefer additive schema changes before destructive cleanup.
ALTER TABLE jobs ADD COLUMN priority INTEGER DEFAULT 0;
```

Separate deployment from irreversible cleanup. Time between those actions is useful safety margin.
