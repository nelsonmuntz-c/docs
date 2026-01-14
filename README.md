# Nelson Muntz

An AI-powered development toolkit with attitude.

## Components

### 1. Nelson CLI (`/cli`)
A standalone terminal chat interface for talking to Claude with Nelson's personality.

```bash
cd cli && npm install && npm link
export ANTHROPIC_API_KEY="your-key"
nelson
```

### 2. Nelson Plugin (`/commands`, `/hooks`, `/scripts`)
A Claude Code plugin for iterative AI loops with `<haha>` completion signals.

## Overview

The Nelson Muntz Plugin implements an iterative, self-referential AI development loop for Claude Code. Named after the Simpsons character, it embodies persistent iteration with a signature "Ha-ha!" attitude.

## Core Concept

Nelson is a **continuous AI agent loop** that:
- Repeatedly feeds the same prompt to Claude
- Allows Claude to see its previous work in files
- Iteratively improves based on past modifications and git history
- Runs entirely within your current session via a Stop hook

**Key mechanism**: The Stop hook (`hooks/stop-hook.sh`) intercepts Claude's exit attempts and re-feeds the same prompt, creating a self-referential feedback loop.

```bash
# You run ONCE:
/nelson-loop "Your task description" --completion-haha "DONE"

# Then Claude Code automatically:
# 1. Works on the task
# 2. Tries to exit
# 3. Stop hook blocks exit
# 4. Stop hook feeds the SAME prompt back
# 5. Repeat until completion
```

## Quick Start

```bash
/nelson-loop "Build a REST API for todos. Requirements: CRUD operations, input validation, tests. Output <haha>COMPLETE</haha> when done." --completion-haha "COMPLETE" --max-iterations 50
```

Claude will:
- Implement the API iteratively
- Run tests and see failures
- Fix bugs based on test output
- Iterate until all requirements are met
- Output the completion haha when done

## Commands

### `/nelson-loop`

Start a Nelson loop in your current session.

**Usage:**
```bash
/nelson-loop "<prompt>" --max-iterations <n> --completion-haha "<text>"
```

**Options:**
- `--max-iterations <n>` - Stop after N iterations (default: unlimited)
- `--completion-haha <text>` - Phrase that signals completion

### `/cancel-nelson`

Cancel the active Nelson loop.

**Usage:**
```bash
/cancel-nelson
```

## Prompt Writing Best Practices

### 1. Clear Completion Criteria

❌ Bad: "Build a todo API and make it good."

✅ Good:
```
Build a REST API for todos.

When complete:
- All CRUD endpoints working
- Input validation in place
- Tests passing (coverage > 80%)
- README with API docs
- Output: <haha>COMPLETE</haha>
```

### 2. Incremental Goals

❌ Bad: "Create a complete e-commerce platform."

✅ Good:
```
Phase 1: User authentication (JWT, tests)
Phase 2: Product catalog (list/search, tests)
Phase 3: Shopping cart (add/remove, tests)

Output <haha>COMPLETE</haha> when all phases done.
```

### 3. Self-Correction

❌ Bad: "Write code for feature X."

✅ Good:
```
Implement feature X following TDD:
1. Write failing tests
2. Implement feature
3. Run tests
4. If any fail, debug and fix
5. Refactor if needed
6. Repeat until all green
7. Output: <haha>COMPLETE</haha>
```

### 4. Escape Hatches

Always use `--max-iterations` as a safety net:

```bash
# Recommended: Always set a reasonable iteration limit
/nelson-loop "Try to implement feature X" --max-iterations 20

# In your prompt, include what to do if stuck:
# "After 15 iterations, if not complete:
# - Document what's blocking progress
# - List what was attempted
# - Suggest alternative approaches"
```

## Installation

Install from GitHub:

```bash
claude plugins add github:YOUR_USERNAME/nelson-muntz
```

Or install from local directory:

```bash
claude plugins add /path/to/nelson-muntz
```

## Philosophy

Nelson embodies four key principles:

### 1. Iteration > Perfection
Don't aim for perfect on first try. Let the loop refine the work.

### 2. Failures Are Data
"Deterministically bad" means failures are predictable and informative. Use them to tune prompts.

### 3. Operator Skill Matters
Success depends on writing good prompts, not just having a good model.

### 4. Persistence Wins
Keep trying until success. The loop handles retry logic automatically.

## When to Use Nelson

**Good for:**
- Well-defined tasks with clear success criteria
- Tasks requiring iteration and refinement (e.g., getting tests to pass)
- Greenfield projects where you can walk away
- Tasks with automatic verification (tests, linters)

**Not good for:**
- Tasks requiring human judgment or design decisions
- One-shot operations
- Tasks with unclear success criteria
- Production debugging (use targeted debugging instead)

## Learn More

- Nelson's official website: https://nelsonmuntz.xyz/

## License

MIT
