import * as semver from 'semver';

import { RunnableVersion } from '../../interfaces';

const preTags = ['nightly', 'alpha', 'beta'];

/**
 * Sorts prerelease tags such that nightly -\> alpha -\> beta.
 *
 * @param a - Prerelease tag data for the old version.
 * @param b - Prerelease tag data for the new version.
 * @returns 0 | 1 | -1
 */
const preCompare = (a: string[], b: string[]) => {
    throw new Error("STUB");
};

/**
 * Custom semver comparator which takes into account Electron's prerelease
 * tag hierarchy.
 *
 * Sorts in ascending order when passed to Array.sort().
 *
 * @param a - The old Electron version.
 * @param b - The new Electron version.
 * @returns 0 | 1 | -1
 */
export function semverCompare(
  a: string | semver.SemVer,
  b: string | semver.SemVer,
) {
    throw new Error("STUB");
}

/**
 * Inplace sorting of Versions.
 * Handles non-semver version strings (e.g. local builds) gracefully
 * by sorting them to the end.
 */
export function sortVersions(versions: RunnableVersion[]): RunnableVersion[] {
    throw new Error("STUB");
}
