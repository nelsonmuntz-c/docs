# Nelson Muntz CLI

A terminal-based AI chat interface powered by Claude, with Nelson Muntz's attitude.

## Features

- Chat with Claude (Opus or Sonnet) directly in your terminal
- Beautiful ASCII art logo with animations
- Box-style UI similar to Claude Code
- Full tool support (read/write files, bash commands, search, etc.)
- Built-in Nelson Loop for iterative AI development
- Nelson's signature personality - helpful but with attitude

## Installation

```bash
cd cli
npm install
npm link  # Makes 'nelson' available globally
```

## Usage

### Start Nelson CLI

```bash
# Set your API key first
export ANTHROPIC_API_KEY="your-key-here"

# Run Nelson
nelson
```

### Commands

| Command | Description |
|---------|-------------|
| `/help` | Show help message |
| `/clear` | Clear the screen |
| `/model <opus\|sonnet>` | Switch AI model |
| `/nelson-loop "prompt" [options]` | Start a Nelson loop |
| `/cancel-nelson` | Cancel active loop |
| `/status` | Show current status |
| `/exit` | Exit Nelson CLI |

### Nelson Loop Options

```bash
/nelson-loop "Build a REST API" --max-iterations 20 --completion-haha "DONE"
```

- `--max-iterations <n>` - Stop after N iterations
- `--completion-haha <text>` - Phrase to signal completion

## Configuration

### API Key

Set your Anthropic API key as an environment variable:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Or add it to your shell profile (~/.bashrc, ~/.zshrc):

```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.zshrc
```

### Hardcoded API Key (Not Recommended)

You can also edit `src/index.js` and set the API_KEY constant directly.

## What Nelson Can Do

- Read and write files
- Execute bash commands
- Search through your codebase
- Help with any programming task
- Run iterative development loops
- Mock your code (lovingly) while fixing it

## Example Session

```
  ███╗  ██╗███████╗██╗     ███████╗ ██████╗ ███╗  ██╗
  ████╗ ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ██║
  ██╔██╗██║█████╗  ██║     ███████╗██║   ██║██╔██╗██║
  ██║╚████║██╔══╝  ██║     ╚════██║██║   ██║██║╚████║
  ██║ ╚███║███████╗███████╗███████║╚██████╔╝██║ ╚███║
  ╚═╝  ╚══╝╚══════╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚══╝

              ★ HA-HA! Welcome to Nelson CLI! ★

You: Help me write a function to validate emails

Nelson: HA-HA! Email validation? Let me show you how it's done...
*writes actually good code*
There you go. Don't mess it up.
```

## License

MIT
