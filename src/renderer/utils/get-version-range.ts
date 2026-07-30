import { semverCompare } from './sort-versions';
import { RunnableVersion } from '../../interfaces';

/**
 * An subset of `versions` sorted from oldest to newest and bounded in the range of [oldVersion..newVersion]
 *
 * @param oldVersion - first version to keep
 * @param newVersion - last version to keep
 * @param versions - the versions to make a subset of
 */
export function getVersionRange(
  oldVersion: string,
  newVersion: string,
  versions: RunnableVersion[],
): RunnableVersion[] {
    throw new Error("STUB");
}
