---
description: Start Nelson Muntz loop in current session
argumentHint: PROMPT [--max-iterations N] [--completion-haha TEXT]
allowedTools:
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/setup-nelson-loop.sh:*)
hideFromSlashCommandTool: true
---

# Nelson Loop Command

Execute the setup script to initialize the Nelson loop:

```bash
"${CLAUDE_PLUGIN_ROOT}/scripts/setup-nelson-loop.sh" $ARGUMENTS
```

Please work on the task. When you try to exit, the Nelson loop will feed the SAME PROMPT back to you for the next iteration. You'll see your previous work in files and git history, allowing you to iterate and improve.

**CRITICAL RULE:** If a completion haha is set, you may ONLY output it when the statement is completely and unequivocally TRUE. Do not output false hahas to escape the loop, even if you think you're stuck or should exit for other reasons. The loop is designed to continue until genuine completion.
