import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import readline from 'readline';
import { colors, centerLine, centerText, getTerminalWidth } from './logo.js';

export class TerminalUI {
  constructor() {
    this.spinner = null;
    this.rl = null;
  }

  // Create a styled box for messages
  box(content, options = {}) {
    const defaultOptions = {
      padding: 1,
      margin: { top: 0, bottom: 0, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: '#E17E5E',
    };
    return boxen(content, { ...defaultOptions, ...options });
  }

  // Create centered box
  centeredBox(content, options = {}) {
    const boxContent = this.box(content, options);
    return centerText(boxContent);
  }

  // Display user message
  userMessage(text) {
    console.log();
    console.log(this.box(
      colors.user('You: ') + text,
      { borderColor: 'cyan', title: '👤 You', titleAlignment: 'left' }
    ));
  }

  // Display assistant message
  assistantMessage(text) {
    console.log();
    console.log(this.box(
      colors.assistant(text),
      { borderColor: '#E17E5E', title: '🎯 Nelson', titleAlignment: 'left' }
    ));
  }

  // Display Nelson's signature catchphrase
  haha(message = '') {
    const hahaText = message ? `HA-HA! ${message}` : 'HA-HA!';
    console.log(colors.primary(`\n  ${hahaText}\n`));
  }

  // Display error
  error(text) {
    console.log();
    console.log(this.box(
      colors.error('Error: ') + text,
      { borderColor: 'red', title: '❌ Error', titleAlignment: 'left' }
    ));
  }

  // Display warning
  warning(text) {
    console.log(colors.warning(`  ⚠️  ${text}`));
  }

  // Display info
  info(text) {
    console.log(colors.info(`  ℹ️  ${text}`));
  }

  // Display success
  success(text) {
    console.log(colors.success(`  ✅ ${text}`));
  }

  // Display tool execution
  toolExecution(toolName, status = 'running') {
    const icons = {
      running: '🔧',
      success: '✅',
      error: '❌',
    };
    const statusColors = {
      running: colors.warning,
      success: colors.success,
      error: colors.error,
    };
    console.log(statusColors[status](`  ${icons[status]} Tool: ${toolName}`));
  }

  // Start loading spinner
  startSpinner(text = 'Nelson is thinking...') {
    this.spinner = ora({
      text: colors.warning(text),
      spinner: 'dots12',
      color: 'yellow',
    }).start();
  }

  // Update spinner text
  updateSpinner(text) {
    if (this.spinner) {
      this.spinner.text = colors.warning(text);
    }
  }

  // Stop spinner with success
  stopSpinnerSuccess(text = 'Done!') {
    if (this.spinner) {
      this.spinner.succeed(colors.success(text));
      this.spinner = null;
    }
  }

  // Stop spinner with error
  stopSpinnerError(text = 'Failed') {
    if (this.spinner) {
      this.spinner.fail(colors.error(text));
      this.spinner = null;
    }
  }

  // Stop spinner
  stopSpinner() {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  // Display help
  showHelp() {
    const helpText = `
${chalk.bold.hex('#E17E5E')('Nelson CLI Commands:')}

${chalk.cyan('/help')}          - Show this help message
${chalk.cyan('/clear')}         - Clear the screen
${chalk.cyan('/model')}         - Show current model
${chalk.cyan('/nelson-loop')}   - Start a Nelson loop
${chalk.cyan('/cancel-nelson')} - Cancel active Nelson loop
${chalk.cyan('/exit')}          - Exit Nelson CLI

${chalk.bold.hex('#FFD700')('Tips:')}
• Nelson can read/write files, run bash commands, and more
• Use natural language to ask Nelson to help with coding tasks
• Nelson has... attitude. Deal with it. HA-HA!
`;
    console.log(this.box(helpText, {
      borderColor: '#E17E5E',
      title: '📚 Help',
      titleAlignment: 'center',
      padding: 1
    }));
  }

  // Display status bar
  statusBar(model, loopActive = false) {
    const modelStr = chalk.cyan(`Model: ${model}`);
    const loopStr = loopActive
      ? chalk.yellow('🔄 Loop Active')
      : chalk.gray('Loop: Inactive');
    const separator = chalk.gray(' │ ');

    console.log(chalk.gray('─'.repeat(60)));
    console.log(`  ${modelStr}${separator}${loopStr}`);
    console.log(chalk.gray('─'.repeat(60)));
  }

  // Get input with a styled box
  async getInput(prompt = 'You') {
    return new Promise((resolve) => {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const boxWidth = 60;
      const borderColor = chalk.hex('#E17E5E');

      console.log();
      console.log(borderColor('  ╭' + '─'.repeat(boxWidth) + '╮'));
      console.log(borderColor('  │') + chalk.cyan(` ${prompt} `) + borderColor(' '.repeat(boxWidth - prompt.length - 2) + '│'));
      console.log(borderColor('  ├' + '─'.repeat(boxWidth) + '┤'));

      this.rl.question(borderColor('  │ ') + chalk.hex('#FFD700')('› '), (answer) => {
        console.log(borderColor('  ╰' + '─'.repeat(boxWidth) + '╯'));
        this.rl.close();
        this.rl = null;
        resolve(answer.trim());
      });
    });
  }

  // Ask for API key with styled prompt
  async askForApiKey() {
    return new Promise((resolve) => {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const content = `${chalk.hex('#FFD700')('🔑 API Key Required')}

${chalk.gray('Enter your Anthropic API key to continue')}
${chalk.gray('Get one at: console.anthropic.com')}`;

      console.log();
      console.log(this.box(content, {
        borderColor: '#E17E5E',
        padding: 1,
        margin: { left: 4 }
      }));
      console.log();

      this.rl.question(chalk.hex('#E17E5E')('  › '), (answer) => {
        this.rl.close();
        this.rl = null;
        resolve(answer.trim());
      });
    });
  }

  // Clear screen
  clear() {
    process.stdout.write('\x1B[2J\x1B[0f');
  }

  // Display welcome message
  welcome() {
    // Welcome is now shown in the animated logo intro
  }

  // Display goodbye
  goodbye() {
    console.log();
    this.haha('See ya, wouldn\'t wanna be ya!');
    console.log(chalk.gray('  Thanks for using Nelson CLI.\n'));
  }

  // Close readline if open
  close() {
    if (this.rl) {
      this.rl.close();
    }
    this.stopSpinner();
  }
}

export const ui = new TerminalUI();
