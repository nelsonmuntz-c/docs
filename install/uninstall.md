---
summary: "Uninstall Clawdia completely (CLI, service, state, workspace)"
read_when:
  - You want to remove Clawdia from a machine
  - The gateway service is still running after uninstall
---

# Uninstall

Two paths:
- **Easy path** if `clawdia` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
clawdia uninstall
```

Non-interactive (automation / npx):

```bash
clawdia uninstall --all --yes --non-interactive
npx -y clawdia uninstall --all --yes --non-interactive
```

Manual steps (same result):

1) Stop the gateway service:

```bash
clawdia gateway stop
```

2) Uninstall the gateway service (launchd/systemd/schtasks):

```bash
clawdia gateway uninstall
```

3) Delete state + config:

```bash
rm -rf "${CLAWDIA_STATE_DIR:-$HOME/.clawdia}"
```

If you set `CLAWDIA_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4) Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/clawd
```

5) Remove the CLI install (pick the one you used):

```bash
npm rm -g clawdia
pnpm remove -g clawdia
bun remove -g clawdia
```

6) If you installed the macOS app:

```bash
rm -rf /Applications/Clawdia.app
```

Notes:
- If you used profiles (`--profile` / `CLAWDIA_PROFILE`), repeat step 3 for each state dir (defaults are `~/.clawdia-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `clawdia` is missing.

### macOS (launchd)

Default label is `com.clawdia.gateway` (or `com.clawdia.<profile>`):

```bash
launchctl bootout gui/$UID/com.clawdia.gateway
rm -f ~/Library/LaunchAgents/com.clawdia.gateway.plist
```

If you used a profile, replace the label and plist name with `com.clawdia.<profile>`.

### Linux (systemd user unit)

Default unit name is `clawdia-gateway.service` (or `clawdia-gateway-<profile>.service`):

```bash
systemctl --user disable --now clawdia-gateway.service
rm -f ~/.config/systemd/user/clawdia-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `Clawdia Gateway` (or `Clawdia Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "Clawdia Gateway"
Remove-Item -Force "$env:USERPROFILE\.clawdia\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.clawdia-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://clawdia.cc/install.sh` or `install.ps1`, the CLI was installed with `npm install -g clawdia@latest`.
Remove it with `npm rm -g clawdia` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `clawdia ...` / `bun run clawdia ...`):

1) Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2) Delete the repo directory.
3) Remove state + workspace as shown above.
