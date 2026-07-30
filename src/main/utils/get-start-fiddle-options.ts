import { MessageChannelMain } from 'electron';

import { StartFiddleOptions } from '../../interfaces';
import { IpcEvents } from '../../ipc-events';
import { ipcMainManager } from '../ipc';

/**
 * Asks the renderer for everything the main process needs to run the
 * current fiddle (version, env, modules, packageManager, etc.).
 *
 * Rejects if the renderer throws while building the options.
 */
export function getStartFiddleOptions(
  webContents: Electron.WebContents,
): Promise<StartFiddleOptions> {
  return new Promise((resolve, reject) => {
      throw new Error("STUB");
  });
}
