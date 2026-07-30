import {
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  app,
  shell,
} from 'electron';

import { isRunFiddleEnabled, startFiddle } from './fiddle-core';
import {
  saveFiddle,
  saveFiddleAs,
  saveFiddleAsForgeProject,
  showOpenDialog,
} from './files';
import { ipcMainManager } from './ipc';
import { getTemplateValues } from './templates';
import { createMainWindow } from './windows';
import {
  BlockableAccelerator,
  SetUpMenuOptions,
  Templates,
} from '../interfaces';
import { IpcEvents } from '../ipc-events';
import { SHOW_ME_TEMPLATES } from '../templates';

function getDefaultMenu(): Array<MenuItemConstructorOptions> {
    throw new Error("STUB");
}

/**
 * Is the passed object a constructor for an Electron Menu?
 */
function isSubmenu(
  submenu?: Array<MenuItemConstructorOptions> | Menu,
): submenu is Array<MenuItemConstructorOptions> {
    throw new Error("STUB");
}

/**
 * Returns additional items for the help menu
 */
function getHelpItems(): Array<MenuItemConstructorOptions> {
    throw new Error("STUB");
}

/**
 * Depending on the OS, the `Preferences` either go into the `Fiddle`
 * menu (macOS) or under `File` (Linux, Windows)
 */
function getPreferencesItems(): Array<MenuItemConstructorOptions> {
    throw new Error("STUB");
}

/**
 * Returns the Exit items
 */
function getQuitItems(): Array<MenuItemConstructorOptions> {
    throw new Error("STUB");
}

/**
 * Returns the top-level "File" menu
 */
function getTasksMenu(): MenuItemConstructorOptions {
    throw new Error("STUB");
}

function getShowMeMenuItem(
  key: string,
  activeKey: string | null,
  item: string | Templates,
): MenuItemConstructorOptions {
    throw new Error("STUB");
}

function getShowMeMenu(
  activeTemplate: string | null,
): MenuItemConstructorOptions {
    throw new Error("STUB");
}

/**
 * Returns the top-level "File" menu
 */
function getFileMenu(
  acceleratorsToBlock: BlockableAccelerator[] = [],
): MenuItemConstructorOptions {
    throw new Error("STUB");
}

/**
 * Creates the app's window menu.
 */
export function setupMenu(options?: SetUpMenuOptions) {
    throw new Error("STUB");
}
