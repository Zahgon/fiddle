import * as crypto from 'node:crypto';
import * as path from 'node:path';

import { Installer } from '@electron/fiddle-core';
import { BrowserWindow, dialog } from 'electron';
import fs from 'fs-extra';

import { ipcMainManager } from './ipc';
import { getLocalVersionForPath, setPendingLocalPath } from './versions';
import { SelectedLocalVersion } from '../interfaces';
import { IpcEvents } from '../ipc-events';

/**
 * Build a default name for a local Electron version
 * from its dirname.
 * @returns human-readable local build name
 */
function makeLocalName(folderPath: string): string {
    throw new Error("STUB");
}

/**
 * Verifies if the local electron path is valid
 */
function isValidElectronPath(folderPath: string): boolean {
    throw new Error("STUB");
}

/**
 * Listens to IPC events related to dialogs and message boxes
 */
export function setupDialogs() {
    throw new Error("STUB");
}

/**
 * Shows a warning dialog
 */
function showWarningDialog(
  window: BrowserWindow,
  args: Electron.MessageBoxOptions,
) {
  dialog.showMessageBox(window, {
    type: 'warning',
    ...args,
  });
}

async function showOpenDialog(window: BrowserWindow) {
    throw new Error("STUB");
}
