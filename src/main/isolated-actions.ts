import * as path from 'node:path';

import { WebContents, WebFrameMain, net, protocol } from 'electron';

export const ISOLATED_ACTIONS_SCHEME = 'isolated-actions';
export const ISOLATED_ACTIONS_RUN_BUTTON_HOST = 'run-button';
export const ISOLATED_ACTIONS_RUN_BUTTON_URL = `${ISOLATED_ACTIONS_SCHEME}://${ISOLATED_ACTIONS_RUN_BUTTON_HOST}/`;

const RUN_BUTTON_ENTRY_NAME = 'isolated_run_button';

declare const ISOLATED_RUN_BUTTON_WEBPACK_ENTRY: string;

/**
 * Check if a URL is the isolated run button document URL.
 */
function isIsolatedRunButtonDocumentUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    return (
      url.protocol === `${ISOLATED_ACTIONS_SCHEME}:` &&
      url.host === ISOLATED_ACTIONS_RUN_BUTTON_HOST &&
      url.pathname === '/'
    );
  } catch {
    return false;
  }
}

/**
 * Register `isolated-actions://` as a scheme. This call
 * MUST happen before `app.whenReady()` resolves.
 */
export function registerIsolatedActionsScheme() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: ISOLATED_ACTIONS_SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: false,
        codeCache: true,
      },
    },
  ]);
}

export function setupIsolatedActionsProtocol() {
    throw new Error("STUB");
}

/**
 * Find the isolated run button frame inside `webContents`.
 */
export function getIsolatedRunButtonFrame(
  webContents: WebContents,
): WebFrameMain | null {
  const frames = webContents.mainFrame?.framesInSubtree;
  if (!frames) return null;
  return (
    frames.find((frame) => { throw new Error("STUB"); }) ?? null
  );
}
