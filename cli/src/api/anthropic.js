import Anthropic from '@anthropic-ai/sdk';
import { ui } from '../ui/terminal.js';
import { tools, executeToolCall } from '../tools/index.js';
import { NELSON_SYSTEM_PROMPT } from './system-prompt.js';

export class NelsonAI {
  constructor(apiKey) {
    this.client = new Anthropic({ apiKey });
    this.model = 'claude-sonnet-4-20250514';
    this.messages = [];
    this.maxTokens = 8192;
  }

  getModelName() {
    return 'sonnet';
  }

  clearHistory() {
    this.messages = [];
  }

  async chat(userMessage) {
    // Add user message to history
    this.messages.push({
      role: 'user',
      content: userMessage,
    });

    try {
      ui.startSpinner('Nelson is thinking...');

      let response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        system: NELSON_SYSTEM_PROMPT,
        tools: tools,
        messages: this.messages,
      });

      // Handle tool use in a loop
      while (response.stop_reason === 'tool_use') {
        ui.updateSpinner('Nelson is using tools...');

        const assistantMessage = {
          role: 'assistant',
          content: response.content,
        };
        this.messages.push(assistantMessage);

        // Process tool calls
        const toolResults = [];
        for (const block of response.content) {
          if (block.type === 'tool_use') {
            ui.stopSpinner();
            ui.toolExecution(block.name, 'running');

            try {
              const result = await executeToolCall(block.name, block.input);
              ui.toolExecution(block.name, 'success');

              toolResults.push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: typeof result === 'string' ? result : JSON.stringify(result),
              });
            } catch (error) {
              ui.toolExecution(block.name, 'error');
              toolResults.push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: `Error: ${error.message}`,
                is_error: true,
              });
            }

            ui.startSpinner('Nelson is processing results...');
          }
        }

        // Add tool results to messages
        this.messages.push({
          role: 'user',
          content: toolResults,
        });

        // Get next response
        response = await this.client.messages.create({
          model: this.model,
          max_tokens: this.maxTokens,
          system: NELSON_SYSTEM_PROMPT,
          tools: tools,
          messages: this.messages,
        });
      }

      ui.stopSpinner();

      // Extract text response
      const textContent = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');

      // Add assistant message to history
      this.messages.push({
        role: 'assistant',
        content: response.content,
      });

      return textContent;

    } catch (error) {
      ui.stopSpinnerError('Request failed');
      throw error;
    }
  }

  // Stream response (for future use)
  async chatStream(userMessage, onChunk) {
    this.messages.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const stream = await this.client.messages.stream({
        model: this.model,
        max_tokens: this.maxTokens,
        system: NELSON_SYSTEM_PROMPT,
        messages: this.messages,
      });

      let fullResponse = '';

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          fullResponse += event.delta.text;
          if (onChunk) {
            onChunk(event.delta.text);
          }
        }
      }

      this.messages.push({
        role: 'assistant',
        content: fullResponse,
      });

      return fullResponse;

    } catch (error) {
      throw error;
    }
  }
}
