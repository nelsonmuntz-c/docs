import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { ui } from '../ui/terminal.js';

const STATE_FILE = '.claude/nelson-loop.local.md';

export class NelsonLoop {
  constructor() {
    this.active = false;
    this.iteration = 0;
    this.maxIterations = 0;
    this.completionHaha = null;
    this.prompt = '';
  }

  async isActive() {
    return existsSync(STATE_FILE);
  }

  async getState() {
    if (!existsSync(STATE_FILE)) {
      return null;
    }

    try {
      const content = await fs.readFile(STATE_FILE, 'utf-8');
      return this.parseState(content);
    } catch (error) {
      return null;
    }
  }

  parseState(content) {
    // Parse YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) return null;

    const frontmatter = frontmatterMatch[1];
    const prompt = frontmatterMatch[2].trim();

    const state = {
      active: true,
      iteration: 1,
      maxIterations: 0,
      completionHaha: null,
      prompt,
    };

    // Parse frontmatter fields
    const lines = frontmatter.split('\n');
    for (const line of lines) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();

      if (key === 'iteration') {
        state.iteration = parseInt(value, 10);
      } else if (key === 'max_iterations') {
        state.maxIterations = parseInt(value, 10);
      } else if (key === 'completion_haha') {
        state.completionHaha = value.replace(/^"|"$/g, '');
        if (state.completionHaha === 'null') state.completionHaha = null;
      }
    }

    return state;
  }

  async start(prompt, options = {}) {
    const { maxIterations = 0, completionHaha = null } = options;

    // Create .claude directory if needed
    await fs.mkdir('.claude', { recursive: true });

    const completionHahaYaml = completionHaha ? `"${completionHaha}"` : 'null';

    const content = `---
active: true
iteration: 1
max_iterations: ${maxIterations}
completion_haha: ${completionHahaYaml}
started_at: "${new Date().toISOString()}"
---

${prompt}`;

    await fs.writeFile(STATE_FILE, content, 'utf-8');

    this.active = true;
    this.iteration = 1;
    this.maxIterations = maxIterations;
    this.completionHaha = completionHaha;
    this.prompt = prompt;

    ui.haha('Nelson loop activated!');
    ui.info(`Iteration: 1`);
    ui.info(`Max iterations: ${maxIterations > 0 ? maxIterations : 'unlimited'}`);
    ui.info(`Completion haha: ${completionHaha || 'none (runs forever)'}`);

    if (completionHaha) {
      ui.warning(`To complete: output <haha>${completionHaha}</haha>`);
    }

    return this.prompt;
  }

  async cancel() {
    if (!existsSync(STATE_FILE)) {
      ui.warning('No active Nelson loop found.');
      return false;
    }

    const state = await this.getState();
    await fs.unlink(STATE_FILE);

    this.active = false;
    ui.haha(`Cancelled Nelson loop (was at iteration ${state?.iteration || '?'})`);

    return true;
  }

  async checkCompletion(response) {
    const state = await this.getState();
    if (!state) return { shouldContinue: false };

    // Check for <haha> tags in response
    if (state.completionHaha) {
      const hahaMatch = response.match(/<haha>(.*?)<\/haha>/s);
      if (hahaMatch) {
        const hahaText = hahaMatch[1].trim();
        if (hahaText === state.completionHaha) {
          await this.cancel();
          ui.haha(`Detected <haha>${state.completionHaha}</haha> - Loop complete!`);
          return { shouldContinue: false, completed: true };
        }
      }
    }

    // Check max iterations
    if (state.maxIterations > 0 && state.iteration >= state.maxIterations) {
      await this.cancel();
      ui.haha(`Max iterations (${state.maxIterations}) reached!`);
      return { shouldContinue: false, maxReached: true };
    }

    // Continue loop - increment iteration
    await this.incrementIteration();

    return {
      shouldContinue: true,
      prompt: state.prompt,
      iteration: state.iteration + 1,
    };
  }

  async incrementIteration() {
    const state = await this.getState();
    if (!state) return;

    const content = await fs.readFile(STATE_FILE, 'utf-8');
    const newContent = content.replace(
      /^iteration: \d+/m,
      `iteration: ${state.iteration + 1}`
    );
    await fs.writeFile(STATE_FILE, newContent, 'utf-8');
  }

  getStatusMessage(iteration) {
    return `Ha-ha! Nelson iteration ${iteration}`;
  }
}

export const nelsonLoop = new NelsonLoop();
