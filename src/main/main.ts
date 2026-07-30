// These imports have side effects that must run before any ipcMain handlers
// are registered. ESM hoists all static imports, so side effects must live
// in the imported modules themselves, not in interleaved body code.
import './sentry';
import './devtron';

import {
  BrowserWindow,
  IpcMainEvent,
  app,
  nativeTheme,
  systemPreferences,
} from 'electron';

import { setupAboutPanel } from './about-panel';
import { setupAutobisect } from './autobisect';
import { setupContent } from './content';
import { setupDevTools } from './devtools';
import { setupDialogs } from './dialogs';
import { setupTypes } from './electron-types';
import { setupFiddleCore } from './fiddle-core';
import { onFirstRunMaybe } from './first-run';
import { setupGitHub } from './github';
import { ipcMainManager } from './ipc';
import {
  registerIsolatedActionsScheme,
  setupIsolatedActionsProtocol,
} from './isolated-actions';
import { setupNpm } from './npm';
import { listenForProtocolHandler, setupProtocolHandler } from './protocol';
import { shouldQuit } from './squirrel';
import { setupTemplates } from './templates';
import { setupThemes } from './themes';
import { setupUpdates } from './update';
import { isDevMode } from './utils/devmode';
import { getProjectName } from './utils/get-project-name';
import { getUsername } from './utils/get-username';
import { setupVersions } from './versions';
import { getOrCreateMainWindow, mainIsReady } from './windows';
import { IpcEvents } from '../ipc-events';

/**
 * Handle the app's "ready" event. This is essentially
 * the method that takes care of booting the application.
 */
export async function onReady() {
    throw new Error("STUB");
}

/**
 * Handle the "before-quit" event
 */
export function onBeforeQuit() {
    throw new Error("STUB");
}

export function setupShowWindow() {
    throw new Error("STUB");
}

export function setupMenuHandler() {
    throw new Error("STUB");
}

/**
 * On macOS, set up the custom titlebar click handler.
 */
export function setupTitleBarClickMac() {
    throw new Error("STUB");
}

function isNativeThemeSource(
  val: unknown,
): val is typeof nativeTheme.themeSource {
    throw new Error("STUB");
}

/**
 * Handle theme changes.
 */
export function setupNativeTheme() {
    throw new Error("STUB");
}

/**
 * Handle isDevMode for renderer.
 */
export function setupIsDevMode() {
    throw new Error("STUB");
}

export function setupGetProjectName() {
    throw new Error("STUB");
}

export function setupGetUsername() {
    throw new Error("STUB");
}

/**
 * All windows have been closed, quit on anything but
 * macOS.
 */
export function onWindowsAllClosed() {
    throw new Error("STUB");
}

/**
 * The main method - and the first function to run
 * when Fiddle is launched.
 *
 * Exported for testing purposes.
 */
export function main() {
  // Handle creating/removing shortcuts on Windows when
  // installing/uninstalling.
  if (shouldQuit()) {
    app.quit();
    return;
  }

  // Set the app's name
  app.name = 'Electron Fiddle';

  // Register the isolated-actions:// scheme as privileged. Must happen
  // before `app.whenReady()` resolves.
  registerIsolatedActionsScheme();

  // Ensure that there's only ever one Fiddle running
  listenForProtocolHandler();

  // Launch
  app.whenReady().then(onReady);
  app.on('before-quit', onBeforeQuit);
  app.on('window-all-closed', onWindowsAllClosed);
  app.on('activate', () => {
      throw new Error("STUB");
  });
}

main();
