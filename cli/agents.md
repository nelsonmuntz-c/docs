---
summary: "CLI reference for `clawdia agents` (list/add/delete/set identity)"
read_when:
  - You want multiple isolated agents (workspaces + routing + auth)
---

# `clawdia agents`

Manage isolated agents (workspaces + auth + routing).

Related:
- Multi-agent routing: [Multi-Agent Routing](/concepts/multi-agent)
- Agent workspace: [Agent workspace](/concepts/agent-workspace)

## Examples

```bash
clawdia agents list
clawdia agents add work --workspace ~/clawdia-work
clawdia agents set-identity --workspace ~/clawdia --from-identity
clawdia agents set-identity --agent main --avatar avatars/clawdia.png
clawdia agents delete work
```

## Identity files

Each agent workspace can include an `IDENTITY.md` at the workspace root:
- Example path: `~/clawdia/IDENTITY.md`
- `set-identity --from-identity` reads from the workspace root (or an explicit `--identity-file`)

Avatar paths resolve relative to the workspace root.

## Set identity

`set-identity` writes fields into `agents.list[].identity`:
- `name`
- `theme`
- `emoji`
- `avatar` (workspace-relative path, http(s) URL, or data URI)

Load from `IDENTITY.md`:

```bash
clawdia agents set-identity --workspace ~/clawdia --from-identity
```

Override fields explicitly:

```bash
clawdia agents set-identity --agent main --name "Clawdia" --emoji "🐱" --avatar avatars/clawdia.png
```

Config sample:

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "Clawdia",
          theme: "space cat",
          emoji: "🐱",
          avatar: "avatars/clawdia.png"
        }
      }
    ]
  }
}
```
