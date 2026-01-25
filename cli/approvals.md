---
summary: "CLI reference for `clawdia approvals` (exec approvals for gateway or node hosts)"
read_when:
  - You want to edit exec approvals from the CLI
  - You need to manage allowlists on gateway or node hosts
---

# `clawdia approvals`

Manage exec approvals for the **local host**, **gateway host**, or a **node host**.
By default, commands target the local approvals file on disk. Use `--gateway` to target the gateway, or `--node` to target a specific node.

Related:
- Exec approvals: [Exec approvals](/tools/exec-approvals)
- Nodes: [Nodes](/nodes)

## Common commands

```bash
clawdia approvals get
clawdia approvals get --node <id|name|ip>
clawdia approvals get --gateway
```

## Replace approvals from a file

```bash
clawdia approvals set --file ./exec-approvals.json
clawdia approvals set --node <id|name|ip> --file ./exec-approvals.json
clawdia approvals set --gateway --file ./exec-approvals.json
```

## Allowlist helpers

```bash
clawdia approvals allowlist add "~/Projects/**/bin/rg"
clawdia approvals allowlist add --agent main --node <id|name|ip> "/usr/bin/uptime"
clawdia approvals allowlist add --agent "*" "/usr/bin/uname"

clawdia approvals allowlist remove "~/Projects/**/bin/rg"
```

## Notes

- `--node` uses the same resolver as `clawdia nodes` (id, name, ip, or id prefix).
- `--agent` defaults to `"*"`, which applies to all agents.
- The node host must advertise `system.execApprovals.get/set` (macOS app or headless node host).
- Approvals files are stored per host at `~/.clawdia/exec-approvals.json`.
