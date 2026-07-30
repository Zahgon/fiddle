import * as path from 'node:path';

import { IpcMainInvokeEvent } from 'electron';

import { STATIC_DIR } from './constants';
import { ipcMainManager } from './ipc';
import { readFiddle } from './utils/read-fiddle';
import { EditorValues } from '../interfaces';
import { IpcEvents } from '../ipc-events';

/**
 * Returns expected content for a given name.
 */
export function getTemplateValues(name: string): Promise<EditorValues> {
    throw new Error("STUB");
}

export function setupTemplates() {
    throw new Error("STUB");
}
