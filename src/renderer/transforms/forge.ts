import { Files, PACKAGE_NAME, RunnableVersion } from '../../interfaces';
import { getForgeVersion } from '../utils/get-package';

/**
 * This transform turns the files into an electron-forge
 * project.
 */
export async function forgeTransform(
  files: Files,
  version?: RunnableVersion,
): Promise<Files> {
    throw new Error("STUB");
}
