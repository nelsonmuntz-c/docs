---
description: Explain Nelson Loop plugin and available commands
allowedTools: []
hideFromSlashCommandTool: false
---

# Nelson Loop Plugin Help

Please explain the following to the user:

## What is Nelson Loop?

Nelson Loop implements the Nelson Muntz technique - an iterative development methodology based on continuous AI loops.

**Core concept:**
```bash
while :; do
  cat PROMPT.md | claude-code --continue
done
```

The same prompt is fed to Claude repeatedly. The "self-referential" aspect comes from Claude seeing its own previous work in the files and git history, not from feeding output back as input.

**Each iteration:**
1. Claude receives the SAME prompt
2. Works on the task, modifying files
3. Tries to exit
4. Stop hook intercepts and feeds the same prompt again
5. Claude sees its previous work in the files
6. Iteratively improves until completion

The technique is described as "deterministically bad in an undeterministic world" - failures are predictable, enabling systematic improvement through prompt tuning.

## Available Commands

### /nelson-loop <PROMPT> [OPTIONS]

Start a Nelson loop in your current session.

**Usage:**
```
/nelson-loop "Refactor the cache layer" --max-iterations 20
/nelson-loop "Add tests" --completion-haha "TESTS COMPLETE"
```

**Options:**
- `--max-iterations <n>` - Max iterations before auto-stop
- `--completion-haha <text>` - Haha phrase to signal completion

**How it works:**
1. Creates `.claude/.nelson-loop.local.md` state file
2. You work on the task
3. When you try to exit, stop hook intercepts
4. Same prompt fed back
5. You see your previous work
6. Continues until haha detected or max iterations

---

### /cancel-nelson

Cancel an active Nelson loop (removes the loop state file).

**Usage:**
```
/cancel-nelson
```

**How it works:**
- Checks for active loop state file
- Removes `.claude/.nelson-loop.local.md`
- Reports cancellation with iteration count

---

## Key Concepts

### Completion Hahas

To signal completion, Claude must output a `<haha>` tag:

```
<haha>TASK COMPLETE</haha>
```

The stop hook looks for this specific tag. Without it (or `--max-iterations`), Nelson runs infinitely.

### Self-Reference Mechanism

The "loop" doesn't mean Claude talks to itself. It means:
- Same prompt repeated
- Claude's work persists in files
- Each iteration sees previous attempts
- Builds incrementally toward goal

## Example

### Interactive Bug Fix

```
/nelson-loop "Fix the token refresh logic in auth.ts. Output <haha>FIXED</haha> when all tests pass." --completion-haha "FIXED" --max-iterations 10
```

You'll see Nelson:
- Attempt fixes
- Run tests
- See failures
- Iterate on solution
- In your current session

## When to Use Nelson

**Good for:**
- Well-defined tasks with clear success criteria
- Tasks requiring iteration and refinement
- Iterative development with self-correction
- Greenfield projects

**Not good for:**
- Tasks requiring human judgment or design decisions
- One-shot operations
- Tasks with unclear success criteria
- Debugging production issues (use targeted debugging instead)

## Learn More

- Nelson's official website: https://nelsonmuntz.xyz/
