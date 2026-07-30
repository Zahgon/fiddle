import type { IpcMainEvent, WebContents } from 'electron';

import { startFiddle } from './fiddle-core';
import { ipcMainManager } from './ipc';
import { pushOutputLine } from './utils/push-output';
import { setVersion } from './utils/set-version';
import { RunResult, RunnableVersion } from '../interfaces';
import { IpcEvents } from '../ipc-events';
import { Bisector } from '../utils/bisect';

const resultString: Record<RunResult, string> = Object.freeze({
  [RunResult.FAILURE]: '❌ failed',
  [RunResult.INVALID]: '❓ invalid',
  [RunResult.SUCCESS]: '✅ passed',
});

/**
 * Bisect the current fiddle across the specified versions.
 *
 * @param versions - versions to bisect
 */
async function autobisect(
  webContents: WebContents,
  versions: Array<RunnableVersion>,
) {
    throw new Error("STUB");
}

async function autobisectImpl(
  webContents: WebContents,
  versions: Array<RunnableVersion>,
) {
    throw new Error("STUB");
}

/**
 * Wire up the IPC handler so the renderer can trigger an autobisect.
 */
export function setupAutobisect(): void {
    throw new Error("STUB");
}
