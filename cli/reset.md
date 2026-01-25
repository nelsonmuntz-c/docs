---
summary: "CLI reference for `clawdia reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
---

# `clawdia reset`

Reset local config/state (keeps the CLI installed).

```bash
clawdia reset
clawdia reset --dry-run
clawdia reset --scope config+creds+sessions --yes --non-interactive
```

