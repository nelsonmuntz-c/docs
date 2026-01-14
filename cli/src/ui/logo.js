import chalk from 'chalk';
import gradient from 'gradient-string';

const nelsonArt = `
███╗   ██╗███████╗██╗     ███████╗ ██████╗ ███╗   ██╗
████╗  ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗  ██║
██╔██╗ ██║█████╗  ██║     ███████╗██║   ██║██╔██╗ ██║
██║╚██╗██║██╔══╝  ██║     ╚════██║██║   ██║██║╚██╗██║
██║ ╚████║███████╗███████╗███████║╚██████╔╝██║ ╚████║
╚═╝  ╚═══╝╚══════╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝
`;

const nelsonGradient = gradient(['#E17E5E', '#FFD700', '#E17E5E']);

// Get terminal width
function getTerminalWidth() {
  return process.stdout.columns || 80;
}

// Center text
function centerText(text, width) {
  const termWidth = width || getTerminalWidth();
  const lines = text.split('\n');
  return lines.map(line => {
    const padding = Math.max(0, Math.floor((termWidth - line.length) / 2));
    return ' '.repeat(padding) + line;
  }).join('\n');
}

// Strip ANSI codes to get visible length
function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

// Center a single line (handles ANSI codes)
function centerLine(text) {
  const termWidth = getTerminalWidth();
  const visibleLength = stripAnsi(text).length;
  const padding = Math.max(0, Math.floor((termWidth - visibleLength) / 2));
  return ' '.repeat(padding) + text;
}

export async function animateLogo() {
  const frames = 8;
  const delay = 80;

  // Clear screen
  process.stdout.write('\x1B[2J\x1B[0f');

  // Loading animation
  for (let i = 0; i < frames; i++) {
    process.stdout.write('\x1B[0f');
    const progress = '█'.repeat(i + 1) + '░'.repeat(frames - i - 1);
    console.log(centerLine(`\n${chalk.hex('#E17E5E')(`Loading Nelson... [${progress}]`)}`));
    await sleep(delay);
  }

  // Clear and show logo
  process.stdout.write('\x1B[2J\x1B[0f');

  // Show centered logo
  console.log(nelsonGradient(centerText(nelsonArt, getTerminalWidth())));

  // Intro lines with different colors
  const introLines = [
    { text: '★ HA-HA! Welcome to Nelson CLI! ★', color: '#E17E5E' },
    { text: 'AI-powered coding assistance in your terminal', color: '#FFD700' },
    { text: 'Read, write, execute — all through natural language', color: '#E9A088' },
    { text: 'Type /help for commands', color: '#888888' },
  ];

  console.log();
  for (const line of introLines) {
    console.log(centerLine(chalk.hex(line.color)(line.text)));
  }
  console.log();
}

export function showLogo() {
  console.log(nelsonGradient(centerText(nelsonArt, getTerminalWidth())));
  console.log();
}

export function showCompactLogo() {
  console.log(nelsonGradient(centerText(nelsonArt, getTerminalWidth())));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export { centerLine, centerText, getTerminalWidth };

export const colors = {
  nelson: nelsonGradient,
  primary: chalk.hex('#E17E5E'),
  gold: chalk.hex('#FFD700'),
  user: chalk.cyan,
  assistant: chalk.hex('#E17E5E'),
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.hex('#E9A088'),
  muted: chalk.gray,
  success: chalk.greenBright,
};
