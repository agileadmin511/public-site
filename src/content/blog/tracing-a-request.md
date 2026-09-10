---
title: 'Trace one request before adding observability'
description: 'A low-tech way to find the visibility gaps that matter in a web system.'
pubDate: 2026-08-02
tags:
  - observability
  - networking
  - reliability
draft: false
---

> Example content: replace or remove this article before launch.

Before choosing an observability platform, follow one request by hand. The exercise reveals which boundaries already produce useful evidence and which are silent.

<img src="/images/request-path.svg" width="960" height="420" alt="A request moving from a browser through a load balancer and application to a database" />

## Start with a request identifier

Accept a trusted request ID or create one at the edge. Carry it through logs and downstream calls.

```go
requestID := r.Header.Get("X-Request-ID")
if requestID == "" {
    requestID = uuid.NewString()
}
ctx := context.WithValue(r.Context(), requestIDKey, requestID)
```

## Ask the same questions at each hop

1. When did the component receive the request?
2. How long did it hold the request?
3. What result did it produce?
4. Where did it send the request next?

If a hop cannot answer those questions, that gap is a concrete instrumentation requirement. Instrument the path you have, not the architecture diagram you wish you had.

## Keep cardinality bounded

Metrics labels should describe groups, not individual events. A route template is useful; a raw URL containing user IDs is not. Put high-cardinality details in logs or traces where they can be searched intentionally.
