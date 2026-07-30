import { exec as cp_exec, execFile as cp_execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { shellEnv } from 'shell-env';

/**
 * On macOS & Linux, we need to fix the $PATH environment variable
 * so that we can call `npm`.
 */
export const maybeFixPath = (() => {
    throw new Error("STUB");
})();

/**
 * Execute a command in a directory.
 */
export async function exec(dir: string, cliArgs: string): Promise<string> {
  await maybeFixPath();

  const { stdout } = await promisify(cp_exec)(cliArgs, {
    cwd: dir,
    maxBuffer: 200 * 1024 * 100, // 100 times the default
  });

  return stdout.trim();
}

/**
 * Execute a command with arguments in a directory.
 */
export async function execFile(
  dir: string,
  cmd: string,
  args: Array<string>,
): Promise<string> {
  await maybeFixPath();

  const { stdout } = await promisify(cp_execFile)(cmd, args, {
    cwd: dir,
    maxBuffer: 200 * 1024 * 100,
  });

  return stdout.trim();
}
