---
summary: "CLI reference for `clawdia plugins` (list, install, enable/disable, doctor)"
read_when:
  - You want to install or manage in-process Gateway plugins
  - You want to debug plugin load failures
---

# `clawdia plugins`

Manage Gateway plugins/extensions (loaded in-process).

Related:
- Plugin system: [Plugins](/plugin)
- Plugin manifest + schema: [Plugin manifest](/plugins/manifest)
- Security hardening: [Security](/gateway/security)

## Commands

```bash
clawdia plugins list
clawdia plugins info <id>
clawdia plugins enable <id>
clawdia plugins disable <id>
clawdia plugins doctor
clawdia plugins update <id>
clawdia plugins update --all
```

Bundled plugins ship with Clawdia but start disabled. Use `plugins enable` to
activate them.

All plugins must ship a `clawdia.plugin.json` file with an inline JSON Schema
(`configSchema`, even if empty). Missing/invalid manifests or schemas prevent
the plugin from loading and fail config validation.

### Install

```bash
clawdia plugins install <path-or-spec>
```

Security note: treat plugin installs like running code. Prefer pinned versions.

Supported archives: `.zip`, `.tgz`, `.tar.gz`, `.tar`.

Use `--link` to avoid copying a local directory (adds to `plugins.load.paths`):

```bash
clawdia plugins install -l ./my-plugin
```

### Update

```bash
clawdia plugins update <id>
clawdia plugins update --all
clawdia plugins update <id> --dry-run
```

Updates only apply to plugins installed from npm (tracked in `plugins.installs`).
