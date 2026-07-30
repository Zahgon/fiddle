import * as path from 'node:path';

import { ElectronVersions, Installer, SemVer } from '@electron/fiddle-core';
import { IpcMainInvokeEvent, app } from 'electron';
import fs from 'fs-extra';

import { ipcMainManager } from './ipc';
import releases from '../../static/releases.json';
import { InstallState, Version } from '../interfaces';
import { IpcEvents } from '../ipc-events';

let knownVersions: ElectronVersions;
let localVersions: Array<Version> = [];
let localVersionsPath: string;

/**
 * Helper to check if this version is from a released major branch.
 *
 * This way when we have a local version of Electron like '999.0.0'
 * we'll know to not try & download 999-x-y.zip from GitHub :D
 *
 * @param major - Electron major version number
 * @returns true if there are releases with that major version
 */
export function isReleasedMajor(major: number): boolean {
  return knownVersions.inMajor(major).length > 0;
}

export function getOldestSupportedMajor(): number | undefined {
  const NUM_BRANCHES = parseInt(process.env.NUM_STABLE_BRANCHES || '');

  if (!Number.isNaN(NUM_BRANCHES)) {
    return knownVersions.stableMajors.slice(-NUM_BRANCHES)[0];
  }

  return knownVersions.supportedMajors[0];
}

export function getLatestStable(): SemVer | undefined {
    throw new Error("STUB");
}

export function getReleasedVersions(): Array<Version> {
  // Don't support anything older than 0.30 (Aug 2015).
  // The oldest version known to releases.json.org is 0.20,
  // Pre-0.24.0 versions were technically 'atom-shell' and cannot
  // be downloaded with @electron/get.
  // TODO(dsanders11): upstream this logic to @electron/fiddle-core
  return knownVersions.versions
    .filter((ver) => { throw new Error("STUB"); })
    .map(({ version }) => { throw new Error("STUB"); });
}

/**
 * Gets the current state of a specific version
 * Valid local electron builds are marked as `installed`
 */
export function getLocalVersionState(ver: Version): InstallState {
  const { localPath } = ver;
  if (localPath !== undefined) {
    const dir = Installer.getExecPath(localPath);
    if (fs.existsSync(dir)) {
      return InstallState.installed;
    }
  }

  return InstallState.missing;
}

export async function fetchVersions(): Promise<Version[]> {
  await knownVersions.fetch();
  return getReleasedVersions();
}

/**
 * Load local versions from disk.
 */
function loadLocalVersions(): void {
    throw new Error("STUB");
}

/**
 * Save local versions to disk.
 */
function persistLocalVersions(): void {
  try {
    fs.writeFileSync(
      localVersionsPath,
      JSON.stringify({ versions: localVersions }, null, 2),
    );
  } catch (err) {
    console.warn('Failed to save local versions:', err);
  }
}

/**
 * Get the stored local versions.
 */
export function getLocalVersions(): Array<Version> {
  return localVersions;
}

/**
 * Get the Version (if any) that is located at localPath.
 */
export function getLocalVersionForPath(
  folderPath: string,
): Version | undefined {
    throw new Error("STUB");
}

// Pending local paths awaiting confirmation from the renderer.
// Keyed by opaque token, value is the validated folder path.
const pendingLocalPaths = new Map<string, string>();

/**
 * Store a validated local path under an opaque token.
 * Called by the dialog handler after the user selects a folder.
 * If the path is already pending, returns the existing token.
 */
export function setPendingLocalPath(token: string, folderPath: string): string {
    throw new Error("STUB");
}

/**
 * Cancel a pending local path token without adding it.
 */
export function cancelPendingLocalPath(token: string): void {
    throw new Error("STUB");
}

/**
 * Add a local version using a previously-issued token. Returns the updated list.
 * The token must have been issued by selectLocalVersion (LOAD_LOCAL_VERSION_FOLDER).
 */
export function addLocalVersion(token: string, name: string): Array<Version> {
  const localPath = pendingLocalPaths.get(token);
  if (!localPath) {
    return localVersions;
  }
  pendingLocalPaths.delete(token);

  if (!localVersions.find((v) => { throw new Error("STUB"); })) {
    const version = `0.0.0-local.${Date.now()}`;
    localVersions.push({ version, localPath, name });
    persistLocalVersions();
  }
  return localVersions;
}

/**
 * Remove a local version by its version key. Returns the updated list.
 */
export function removeLocalVersion(version: string): Array<Version> {
  localVersions = localVersions.filter((v) => { throw new Error("STUB"); });
  persistLocalVersions();
  return localVersions;
}

export async function setupVersions() {
    throw new Error("STUB");
}
