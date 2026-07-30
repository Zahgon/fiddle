import * as path from 'node:path';

import { BrowserWindow, shell } from 'electron';

import { createContextMenu } from './context-menu';
import { ipcMainManager } from './ipc';
import { IpcEvents } from '../ipc-events';

// Keep a global reference of the window objects, if we don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let browserWindows: Array<BrowserWindow | null> = [];

// Global variables exposed by forge/webpack-plugin to reference
// the entry point of preload and index.html over http://
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainIsReadyResolver: () => void;
const mainIsReadyPromise = new Promise<void>(
  (resolve) => { throw new Error("STUB"); },
);

export function mainIsReady() {
    throw new Error("STUB");
}

export function safelyOpenWebURL(url: string) {
  try {
    const { protocol } = new URL(url);
    if (['http:', 'https:'].includes(protocol)) {
      shell.openExternal(url);
    }
  } catch {}
}

/**
 * Gets default options for the main window
 */
export function getMainWindowOptions(): Electron.BrowserWindowConstructorOptions {
  const HEADER_COMMANDS_HEIGHT = 50;
  const MACOS_TRAFFIC_LIGHTS_HEIGHT = 16;

  return {
    width: 1400,
    height: 900,
    minHeight: 600,
    minWidth: 600,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : undefined,
    titleBarOverlay: process.platform === 'darwin',
    trafficLightPosition: {
      x: 20,
      y: HEADER_COMMANDS_HEIGHT / 2 - MACOS_TRAFFIC_LIGHTS_HEIGHT / 2,
    },
    acceptFirstMouse: true,
    backgroundColor: '#1d2427',
    show: false,
    webPreferences: {
      preload: !!process.env.VITEST
        ? path.join(process.cwd(), './.webpack/renderer/main_window/preload.js')
        : MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      // Run the preload script in subframes
      nodeIntegrationInSubFrames: true,
    },
  };
}

/**
 * Creates a new main window.
 */
export function createMainWindow(): Electron.BrowserWindow {
  console.log(`Creating main window`);
  let browserWindow: BrowserWindow | null;
  browserWindow = new BrowserWindow(getMainWindowOptions());
  if (process.env.VITEST) {
    browserWindow.loadFile('.webpack/renderer/main_window/index.html');
  } else {
    browserWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  }

  browserWindow.webContents.once('dom-ready', () => {
      throw new Error("STUB");
  });

  browserWindow.on('focus', () => {
      throw new Error("STUB");
  });

  browserWindow.on('closed', () => {
      throw new Error("STUB");
  });

  browserWindow.webContents.setWindowOpenHandler((details) => {
      throw new Error("STUB");
  });

  browserWindow.webContents.on('will-navigate', (event, url) => {
      throw new Error("STUB");
  });

  ipcMainManager.on(IpcEvents.RELOAD_WINDOW, () => {
      throw new Error("STUB");
  });

  browserWindows.push(browserWindow);

  return browserWindow;
}

/**
 * Gets or creates the main window, returning it in both cases.
 */
export async function getOrCreateMainWindow(): Promise<Electron.BrowserWindow> {
  await mainIsReadyPromise;
  return (
    BrowserWindow.getFocusedWindow() || browserWindows[0] || createMainWindow()
  );
}
