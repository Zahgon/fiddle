import * as path from 'node:path';

import { BrowserWindow, IpcMainInvokeEvent, app, dialog } from 'electron';
import fs from 'fs-extra';

import { ipcMainManager } from './ipc';
import { getFiles } from './utils/get-files';
import { readFiddle } from './utils/read-fiddle';
import * as tmp from './utils/tmp';
import { Files } from '../interfaces';
import { IpcEvents } from '../ipc-events';
import { isSupportedFile } from '../utils/editor-utils';

/**
 * Returns true if `name` is a safe bare file/data name: non-empty, not
 * absolute, and equals its own
 * basename. Used to validate renderer-supplied names before joining onto
 * a trusted directory.
 */
function isSafeDataName(str: unknown): str is string {
  return (
    typeof str === 'string' &&
    str.length > 0 &&
    !path.isAbsolute(str) &&
    str === path.basename(str)
  );
}

/**
 * Ensures that we're listening to file events
 */
export function setupFileListeners() {
    throw new Error("STUB");
}

/**
 * Shows the "Open Fiddle" dialog and forwards
 * the path to the renderer
 */
export async function showOpenDialog(window: BrowserWindow) {
    throw new Error("STUB");
}

/**
 * Shows the "Save Fiddle" dialog and returns the path
 */
export async function showSaveDialog(
  window: BrowserWindow,
  as?: string,
): Promise<undefined | string> {
    throw new Error("STUB");
}

/**
 * Confirm it's OK to save files in `folder`
 */
async function isOkToSaveAt(filePath: string): Promise<boolean> {
    throw new Error("STUB");
}

/**
 * Pops open a confirmation dialog, asking the user if they really
 * want to overwrite an existing file
 */
async function confirmFileOverwrite(filePath: string): Promise<boolean> {
    throw new Error("STUB");
}

/**
 * Tries to open a fiddle.
 */
export async function openFiddle(
  filePath: string,
): Promise<Record<string, string>> {
  console.log(`openFiddle: Asked to open`, filePath);
  return readFiddle(filePath, true);
}

/**
 * Attempts to clean a given directory. Used to manually
 * clean temp directories.
 */
export async function cleanupDirectory(dir?: string): Promise<boolean> {
  if (dir) {
    if (fs.existsSync(dir)) {
      try {
        await fs.remove(dir);
        return true;
      } catch (error) {
        console.warn(`cleanupDirectory: Failed to clean directory`, error);
      }
    }
  }

  return false;
}

export async function deleteUserData(name: string) {
  if (!isSafeDataName(name)) {
    console.warn(`deleteUserData: rejected unsafe name: ${name}`);
    return;
  }
  const appData = path.join(app.getPath('appData'), name);
  console.log(`Cleanup: Deleting data dir ${appData}`);
  await cleanupDirectory(appData);
}

/**
 * Save the files to a temporary directory. Returns the
 * path to the temp directory.
 */
export async function saveFilesToTemp(files: Files): Promise<string> {
  const dir = tmp.dirSync({
    prefix: 'electron-fiddle',
  });

  tmp.setGracefulCleanup();

  for (const [name, content] of files) {
    if (!isSafeDataName(name)) {
      console.warn(`saveFilesToTemp: rejected unsafe filename: ${name}`);
      continue;
    }
    try {
      await fs.outputFile(path.join(dir, name), content);
    } catch (error) {
      throw error;
    }
  }

  return dir;
}

/**
 * Safely attempts to save a file, doesn't crash the app if
 * it fails.
 */
async function saveFile(filePath: string, content: string): Promise<void> {
    throw new Error("STUB");
}

/**
 * Safely attempts to remove a file, doesn't crash the app if
 * it fails.
 */
async function removeFile(filePath: string): Promise<void> {
    throw new Error("STUB");
}

export async function saveFiles(
  window: BrowserWindow,
  filePath: string,
  files: Files,
) {
    throw new Error("STUB");
}

/**
 * Saves the current Fiddle to disk. If we never saved before,
 * we'll first open the "Save" dialog.
 */
export async function saveFiddle() {
    throw new Error("STUB");
}

/**
 * Saves the current Fiddle to disk.
 */
export async function saveFiddleAs() {
    throw new Error("STUB");
}

/**
 * Saves the current Fiddle to disk as a Forge project.
 */
export async function saveFiddleAsForgeProject() {
    throw new Error("STUB");
}
