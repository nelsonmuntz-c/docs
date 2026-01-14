#!/bin/bash

# Nelson Loop Setup Script
# Creates state file for in-session Nelson loop

set -euo pipefail

# Parse arguments
PROMPT_PARTS=()
MAX_ITERATIONS=0
COMPLETION_HAHA="null"

# Parse options and positional arguments
while [[ $# -gt 0 ]]; do
  case $1 in
  -h|--help)
    cat <<'HELP_EOF'
Nelson Loop - Interactive self-referential development loop

USAGE:
  /nelson-loop [PROMPT...] [OPTIONS]

ARGUMENTS:
  PROMPT...                     Initial prompt to start the loop (can be multiple words without quotes)

OPTIONS:
  --max-iterations <n>          Maximum iterations before auto-stop (default: unlimited)
  --completion-haha '<text>'    Haha phrase (USE QUOTES for multi-word)
  -h, --help                    Show this help message

DESCRIPTION:
  Starts a Nelson Muntz loop in your CURRENT session. The stop hook prevents
  exit and feeds your output back as input until completion or iteration limit.

  To signal completion, you must output: <haha>YOUR_PHRASE</haha>

  Use this for:
  - Interactive iteration where you want to see progress
  - Tasks requiring self-correction and refinement
  - Learning how Nelson works

EXAMPLES:
  /nelson-loop Build a todo API --completion-haha 'DONE' --max-iterations 20
  /nelson-loop --max-iterations 10 Fix the auth bug
  /nelson-loop Refactor cache layer (runs forever)
  /nelson-loop --completion-haha 'TASK COMPLETE' Create a REST API

STOPPING:
  Only by reaching --max-iterations or detecting --completion-haha
  No manual stop - Nelson runs infinitely by default!

MONITORING:
  # View current iteration:
  grep '^iteration:' .claude/nelson-loop.local.md

  # View full state:
  head -10 .claude/nelson-loop.local.md
HELP_EOF
    exit 0
    ;;
  --max-iterations)
    if [[ -z "${2:-}" ]]; then
      echo "Ha-ha! Error: --max-iterations requires a number argument" >&2
      echo "" >&2
      echo "  Valid examples:" >&2
      echo "    --max-iterations 10" >&2
      echo "    --max-iterations 50" >&2
      echo "    --max-iterations 0 (unlimited)" >&2
      echo "" >&2
      echo "  You provided: --max-iterations (with no number)" >&2
      exit 1
    fi
    if ! [[ "$2" =~ ^[0-9]+$ ]]; then
      echo "Ha-ha! Error: --max-iterations must be a positive integer or 0, got: $2" >&2
      echo "" >&2
      echo "  Valid examples:" >&2
      echo "    --max-iterations 10" >&2
      echo "    --max-iterations 50" >&2
      echo "    --max-iterations 0 (unlimited)" >&2
      echo "" >&2
      echo "  Invalid: decimals (10.5), negative numbers (-5), text" >&2
      exit 1
    fi
    MAX_ITERATIONS="$2"
    shift 2
    ;;
  --completion-haha)
    if [[ -z "${2:-}" ]]; then
      echo "Ha-ha! Error: --completion-haha requires a text argument" >&2
      echo "" >&2
      echo "  Valid examples:" >&2
      echo "    --completion-haha 'DONE'" >&2
      echo "    --completion-haha 'TASK COMPLETE'" >&2
      echo "    --completion-haha 'All tests passing'" >&2
      echo "" >&2
      echo "  You provided: --completion-haha (with no text)" >&2
      echo "" >&2
      echo "  Note: Multi-word hahas must be quoted!" >&2
      exit 1
    fi
    COMPLETION_HAHA="$2"
    shift 2
    ;;
  *)
    # Non-option argument - collect all as prompt parts
    PROMPT_PARTS+=("$1")
    shift
    ;;
  esac
done

# Join all prompt parts with spaces
PROMPT="${PROMPT_PARTS[*]}"

# Validate prompt is non-empty
if [[ -z "$PROMPT" ]]; then
  echo "Ha-ha! Error: No prompt provided" >&2
  echo "" >&2
  echo "  Nelson needs a task description to work on." >&2
  echo "" >&2
  echo "  Examples:" >&2
  echo "    /nelson-loop Build a REST API for todos" >&2
  echo "    /nelson-loop Fix the auth bug --max-iterations 20" >&2
  echo "    /nelson-loop --completion-haha 'DONE' Refactor code" >&2
  echo "" >&2
  echo "  For all options: /nelson-loop --help" >&2
  exit 1
fi

# Create state file for stop hook (markdown with YAML frontmatter)
mkdir -p .claude

# Quote completion haha for YAML if it contains special chars or is not null
if [[ -n "$COMPLETION_HAHA" ]] && [[ "$COMPLETION_HAHA" != "null" ]]; then
  COMPLETION_HAHA_YAML="\"$COMPLETION_HAHA\""
else
  COMPLETION_HAHA_YAML="null"
fi

cat > .claude/nelson-loop.local.md <<EOF
---
active: true
iteration: 1
max_iterations: $MAX_ITERATIONS
completion_haha: $COMPLETION_HAHA_YAML
started_at: "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
---

$PROMPT
EOF

# Output setup message
cat <<EOF
Ha-ha! Nelson loop activated in this session!

Iteration: 1
Max iterations: $(if [[ $MAX_ITERATIONS -gt 0 ]]; then echo $MAX_ITERATIONS; else echo "unlimited"; fi)
Completion haha: $(if [[ "$COMPLETION_HAHA" != "null" ]]; then echo "${COMPLETION_HAHA//\"/} (ONLY output when TRUE - do not lie!)"; else echo "none (runs forever)"; fi)

The stop hook is now active. When you try to exit, the SAME PROMPT will be
fed back to you. You'll see your previous work in files, creating a
self-referential loop where you iteratively improve on the same task.

To monitor: head -10 .claude/nelson-loop.local.md

Ha-ha! WARNING: This loop cannot be stopped manually! It will run infinitely
  unless you set --max-iterations or --completion-haha.

Ha-ha!
EOF

# Output the initial prompt if provided
if [[ -n "$PROMPT" ]]; then
  echo ""
  echo "$PROMPT"
fi

# Display completion haha requirements if set
if [[ "$COMPLETION_HAHA" != "null" ]]; then
  echo ""
  echo "==============================================================="
  echo "CRITICAL - Nelson Loop Completion Haha"
  echo "==============================================================="
  echo ""
  echo "To complete this loop, output this EXACT text:"
  echo "  <haha>$COMPLETION_HAHA</haha>"
  echo ""
  echo "STRICT REQUIREMENTS (DO NOT VIOLATE):"
  echo "  - Use <haha> XML tags EXACTLY as shown above"
  echo "  - The statement MUST be completely and unequivocally TRUE"
  echo "  - Do NOT output false statements to exit the loop"
  echo "  - Do NOT lie even if you think you should exit"
  echo ""
  echo "IMPORTANT - Do not circumvent the loop:"
  echo "  Even if you believe you're stuck, the task is impossible,"
  echo "  or you've been running too long - you MUST NOT output a"
  echo "  false haha statement. The loop is designed to continue"
  echo "  until the haha is GENUINELY TRUE. Trust the process."
  echo ""
  echo "  If the loop should stop, the haha statement will become"
  echo "  true naturally. Do not force it by lying."
  echo "==============================================================="
fi
