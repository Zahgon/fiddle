import * as path from 'node:path';

import { app } from 'electron';
import fs from 'fs-extra';

const getConfigPath = () => {
    throw new Error("STUB");
};

/**
 * Whether or not the app is being run for
 * the first time
 */
export function isFirstRun(): boolean {
    throw new Error("STUB");
}
