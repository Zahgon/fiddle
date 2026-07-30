import { app, dialog } from 'electron';

import { isFirstRun } from './utils/check-first-run';
import { isDevMode } from './utils/devmode';

/**
 * Is this the first run of Fiddle? If so, perform
 * tasks that we only want to do in this case.
 */
export async function onFirstRunMaybe() {
    throw new Error("STUB");
}

/**
 * Ask the user if the app should be moved to the
 * applications folder.
 */
async function promptMoveToApplicationsFolder(): Promise<void> {
    throw new Error("STUB");
}
