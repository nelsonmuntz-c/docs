import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Tool definitions for Anthropic API
export const tools = [
  {
    name: 'read_file',
    description: 'Read the contents of a file at the specified path. Use this to examine existing code or configuration files.',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to the file to read (absolute or relative to current directory)',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'write_file',
    description: 'Write content to a file. Creates the file if it doesn\'t exist, or overwrites if it does. Creates parent directories as needed.',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path where the file should be written',
        },
        content: {
          type: 'string',
          description: 'The content to write to the file',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'edit_file',
    description: 'Edit a file by replacing a specific string with new content. Use for targeted edits to existing files.',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to the file to edit',
        },
        old_string: {
          type: 'string',
          description: 'The exact string to find and replace',
        },
        new_string: {
          type: 'string',
          description: 'The string to replace it with',
        },
      },
      required: ['path', 'old_string', 'new_string'],
    },
  },
  {
    name: 'list_directory',
    description: 'List the contents of a directory. Shows files and subdirectories.',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The directory path to list (defaults to current directory)',
        },
      },
      required: [],
    },
  },
  {
    name: 'bash',
    description: 'Execute a bash command and return the output. Use for running programs, git commands, npm/yarn, etc.',
    input_schema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The bash command to execute',
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds (default: 30000)',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'search_files',
    description: 'Search for files matching a glob pattern. Useful for finding files by name or extension.',
    input_schema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Glob pattern to match (e.g., "**/*.js", "src/**/*.ts")',
        },
        path: {
          type: 'string',
          description: 'Base directory to search in (defaults to current directory)',
        },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'grep',
    description: 'Search for a pattern in files. Returns matching lines with file paths and line numbers.',
    input_schema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'The regex pattern to search for',
        },
        path: {
          type: 'string',
          description: 'File or directory to search in',
        },
        file_pattern: {
          type: 'string',
          description: 'Optional glob pattern to filter files (e.g., "*.js")',
        },
      },
      required: ['pattern'],
    },
  },
];

// Tool execution handlers
export async function executeToolCall(toolName, input) {
  switch (toolName) {
    case 'read_file':
      return await readFile(input.path);

    case 'write_file':
      return await writeFile(input.path, input.content);

    case 'edit_file':
      return await editFile(input.path, input.old_string, input.new_string);

    case 'list_directory':
      return await listDirectory(input.path || '.');

    case 'bash':
      return await runBash(input.command, input.timeout);

    case 'search_files':
      return await searchFiles(input.pattern, input.path);

    case 'grep':
      return await grepFiles(input.pattern, input.path, input.file_pattern);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

// Tool implementations
async function readFile(filePath) {
  const resolvedPath = path.resolve(filePath);
  if (!existsSync(resolvedPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = await fs.readFile(resolvedPath, 'utf-8');
  return content;
}

async function writeFile(filePath, content) {
  const resolvedPath = path.resolve(filePath);
  const dir = path.dirname(resolvedPath);

  // Create directory if it doesn't exist
  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(resolvedPath, content, 'utf-8');
  return `Successfully wrote ${content.length} characters to ${filePath}`;
}

async function editFile(filePath, oldString, newString) {
  const resolvedPath = path.resolve(filePath);
  if (!existsSync(resolvedPath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = await fs.readFile(resolvedPath, 'utf-8');

  if (!content.includes(oldString)) {
    throw new Error(`String not found in file: "${oldString.substring(0, 50)}..."`);
  }

  const newContent = content.replace(oldString, newString);
  await fs.writeFile(resolvedPath, newContent, 'utf-8');

  return `Successfully edited ${filePath}`;
}

async function listDirectory(dirPath) {
  const resolvedPath = path.resolve(dirPath);
  const entries = await fs.readdir(resolvedPath, { withFileTypes: true });

  const result = entries.map(entry => {
    const type = entry.isDirectory() ? '[DIR]' : '[FILE]';
    return `${type} ${entry.name}`;
  });

  return result.join('\n');
}

async function runBash(command, timeout = 30000) {
  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout,
      maxBuffer: 10 * 1024 * 1024, // 10MB
      cwd: process.cwd(),
    });

    let result = '';
    if (stdout) result += stdout;
    if (stderr) result += (result ? '\n' : '') + `[stderr] ${stderr}`;

    return result || 'Command executed successfully (no output)';
  } catch (error) {
    if (error.killed) {
      throw new Error(`Command timed out after ${timeout}ms`);
    }
    throw new Error(`Command failed: ${error.message}\n${error.stderr || ''}`);
  }
}

async function searchFiles(pattern, basePath = '.') {
  // Use find command for glob matching
  const cmd = `find ${basePath} -type f -name "${pattern}" 2>/dev/null | head -100`;
  try {
    const { stdout } = await execAsync(cmd, { maxBuffer: 1024 * 1024 });
    return stdout || 'No files found';
  } catch (error) {
    return 'No files found';
  }
}

async function grepFiles(pattern, searchPath = '.', filePattern) {
  let cmd = `grep -rn "${pattern}" ${searchPath}`;
  if (filePattern) {
    cmd += ` --include="${filePattern}"`;
  }
  cmd += ' 2>/dev/null | head -50';

  try {
    const { stdout } = await execAsync(cmd, { maxBuffer: 1024 * 1024 });
    return stdout || 'No matches found';
  } catch (error) {
    return 'No matches found';
  }
}
