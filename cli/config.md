---
summary: "CLI reference for `clawdia config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
---

# `clawdia config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `clawdia configure`).

## Examples

```bash
clawdia config get browser.executablePath
clawdia config set browser.executablePath "/usr/bin/google-chrome"
clawdia config set agents.defaults.heartbeat.every "2h"
clawdia config set agents.list[0].tools.exec.node "node-id-or-name"
clawdia config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
clawdia config get agents.defaults.workspace
clawdia config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
clawdia config get agents.list
clawdia config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--json` to require JSON5 parsing.

```bash
clawdia config set agents.defaults.heartbeat.every "0m"
clawdia config set gateway.port 19001 --json
clawdia config set channels.whatsapp.groups '["*"]' --json
```

Restart the gateway after edits.
