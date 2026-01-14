---
description: Cancel active Nelson Muntz loop
allowedTools:
  - Bash(test:*)
  - Bash(rm:*)
  - Read
hideFromSlashCommandTool: true
---

# Cancel Nelson

To cancel the Nelson loop:

1. **Check if `.claude/nelson-loop.local.md` exists** using Bash:
   ```bash
   test -f .claude/nelson-loop.local.md && echo "EXISTS" || echo "NOT_FOUND"
   ```

2. **If NOT_FOUND**: Say "No active Nelson loop found."

3. **If EXISTS**:
   - Read `.claude/nelson-loop.local.md` to get the current iteration number from the `iteration:` field
   - Remove the file using Bash:
     ```bash
     rm .claude/nelson-loop.local.md
     ```
   - Report: "Ha-ha! Cancelled Nelson loop (was at iteration N)" where N is the iteration value
