import {
  BrowserWindow,
  ContextMenuParams,
  Menu,
  MenuItemConstructorOptions,
} from 'electron';

import { isRunFiddleEnabled, startFiddle } from './fiddle-core';
import { ipcMainManager } from './ipc';
import { isDevMode } from './utils/devmode';
import { IpcEvents } from '../ipc-events';

/**
 * Returns items related to running the current fiddle.
 */
export function getRunItems(): Array<MenuItemConstructorOptions> {
  return [
    {
      id: 'run',
      label: 'Run Fiddle',
      enabled: isRunFiddleEnabled(),
      click: (_, focusedWindow) => {
          throw new Error("STUB");
      },
    },
    {
      id: 'clear_console',
      label: 'Clear Console',
      click: () => { throw new Error("STUB"); },
    },
    {
      type: 'separator',
    },
  ];
}

/**
 * Possibly returns items interacting with the Monaco editor.
 * Our check for "are we in the Monaco editor" is pretty crude -
 * we just assume that we are if we can paste text.
 */
export function getMonacoItems({
  pageURL,
  editFlags,
}: ContextMenuParams): Array<MenuItemConstructorOptions> {
  if (!editFlags.canPaste || !/.*index\.html(#?)$/.test(pageURL || '')) {
    return [];
  }

  return [
    {
      id: 'go_to_definition',
      label: 'Go to Definition',
      click() {
          throw new Error("STUB");
      },
    },
    {
      id: 'peek_definition',
      label: 'Peek Definition',
      click() {
          throw new Error("STUB");
      },
    },
    {
      id: 'references',
      label: 'Find References',
      click() {
          throw new Error("STUB");
      },
    },
    { type: 'separator' },
    {
      id: 'format_document',
      label: 'Format Document',
      click() {
          throw new Error("STUB");
      },
    },
    {
      id: 'format_selection',
      label: 'Format Selection',
      click() {
          throw new Error("STUB");
      },
    },
    {
      id: 'format_all',
      label: 'Format All Documents',
      click() {
          throw new Error("STUB");
      },
    },
    { type: 'separator' },
  ];
}

/**
 * Possibly returns the `Inspect Element` item.
 */
export function getInspectItems(
  browserWindow: BrowserWindow,
  { x, y }: ContextMenuParams,
): Array<MenuItemConstructorOptions> {
  if (!isDevMode()) return [];

  return [
    {
      id: 'inspect',
      label: 'Inspect Element',
      click: () => {
          throw new Error("STUB");
      },
    },
  ];
}

/**
 * Creates a context menu for a given BrowserWindow
 */
export function createContextMenu(browserWindow: BrowserWindow) {
  browserWindow.webContents.on('context-menu', (_event, props) => {
      throw new Error("STUB");
  });
}
