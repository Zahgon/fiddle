import { MessageChannelMain } from 'electron';

import {
  FileTransformOperation,
  Files,
  PackageJsonOptions,
} from '../../interfaces';
import { IpcEvents } from '../../ipc-events';
import { ipcMainManager } from '../ipc';

/**
 * Gets file content from the renderer
 */
export function getFiles(
  window: Electron.BrowserWindow,
  transforms: Array<FileTransformOperation>,
  options?: PackageJsonOptions,
): Promise<{ localPath?: string; files: Files }> {
  return new Promise((resolve) => {
      throw new Error("STUB");
  });
}
