import { animateLogo, showLogo, colors } from './ui/logo.js';
import { ui } from './ui/terminal.js';
import { NelsonAI } from './api/anthropic.js';
import { nelsonLoop } from './loop/nelson-loop.js';
import chalk from 'chalk';

// Configuration - set ANTHROPIC_API_KEY environment variable
const API_KEY = process.env.ANTHROPIC_API_KEY;

class NelsonCLI {
  constructor() {
    this.ai = null;
    this.running = false;
  }

  async initialize() {
    // Show animated logo
    await animateLogo();

    // Initialize AI client
    this.ai = new NelsonAI(API_KEY);

    // Show status
    ui.statusBar(this.ai.getModelName(), await nelsonLoop.isActive());
  }

  async handleCommand(input) {
    const args = input.slice(1).split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help':
        ui.showHelp();
        return true;

      case 'clear':
        ui.clear();
        showLogo();
        ui.statusBar(this.ai.getModelName(), await nelsonLoop.isActive());
        return true;

      case 'exit':
      case 'quit':
      case 'q':
        this.running = false;
        return true;

      case 'model':
        ui.info(`Model: sonnet (Claude Sonnet 4)`);
        return true;

      case 'nelson-loop':
        await this.startNelsonLoop(args.slice(1).join(' '));
        return true;

      case 'cancel-nelson':
        await nelsonLoop.cancel();
        ui.statusBar(this.ai.getModelName(), await nelsonLoop.isActive());
        return true;

      case 'status':
        const loopState = await nelsonLoop.getState();
        if (loopState) {
          ui.info(`Loop active: iteration ${loopState.iteration}`);
          ui.info(`Max iterations: ${loopState.maxIterations || 'unlimited'}`);
          ui.info(`Completion haha: ${loopState.completionHaha || 'none'}`);
        } else {
          ui.info('No active Nelson loop');
        }
        ui.statusBar(this.ai.getModelName(), !!loopState);
        return true;

      default:
        ui.warning(`Unknown command: /${command}`);
        ui.info('Type /help for available commands');
        return true;
    }
  }

  async startNelsonLoop(argsString) {
    // Parse arguments
    const args = argsString.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    let prompt = '';
    let maxIterations = 0;
    let completionHaha = null;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === '--max-iterations' && args[i + 1]) {
        maxIterations = parseInt(args[++i], 10);
      } else if (arg === '--completion-haha' && args[i + 1]) {
        completionHaha = args[++i].replace(/^"|"$/g, '');
      } else {
        prompt += (prompt ? ' ' : '') + arg.replace(/^"|"$/g, '');
      }
    }

    if (!prompt) {
      ui.error('No prompt provided');
      ui.info('Usage: /nelson-loop "Your prompt" --max-iterations 10 --completion-haha "DONE"');
      return;
    }

    const loopPrompt = await nelsonLoop.start(prompt, { maxIterations, completionHaha });
    ui.statusBar(this.ai.getModelName(), true);

    // Send initial prompt to AI
    await this.sendMessage(loopPrompt);
  }

  async sendMessage(message) {
    ui.userMessage(message);

    try {
      const response = await this.ai.chat(message);
      ui.assistantMessage(response);

      // Check if in loop mode
      if (await nelsonLoop.isActive()) {
        const result = await nelsonLoop.checkCompletion(response);
        if (result.shouldContinue) {
          ui.info(`${nelsonLoop.getStatusMessage(result.iteration)}`);
          ui.statusBar(this.ai.getModelName(), true);
          // Continue loop with same prompt
          await this.sendMessage(result.prompt);
        } else {
          ui.statusBar(this.ai.getModelName(), false);
        }
      }

      return response;
    } catch (error) {
      ui.error(error.message);
      return null;
    }
  }

  async run() {
    await this.initialize();
    this.running = true;

    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
      console.log();
      ui.goodbye();
      process.exit(0);
    });

    // Main loop
    while (this.running) {
      try {
        const input = await ui.getInput('You');

        if (!input) continue;

        // Check for commands
        if (input.startsWith('/')) {
          await this.handleCommand(input);
          continue;
        }

        // Send message to AI
        await this.sendMessage(input);
        ui.statusBar(this.ai.getModelName(), await nelsonLoop.isActive());

      } catch (error) {
        if (error.code === 'ERR_USE_AFTER_CLOSE') {
          // Readline closed, exit gracefully
          break;
        }
        ui.error(error.message);
      }
    }

    ui.goodbye();
    ui.close();
    process.exit(0);
  }
}

// Run the CLI
const cli = new NelsonCLI();
cli.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
