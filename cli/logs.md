---
summary: "CLI reference for `clawdia logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
---

# `clawdia logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:
- Logging overview: [Logging](/logging)

## Examples

```bash
clawdia logs
clawdia logs --follow
clawdia logs --json
clawdia logs --limit 500
```

