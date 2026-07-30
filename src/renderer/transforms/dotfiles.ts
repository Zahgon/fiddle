import { Files } from '../../interfaces';

/**
 * This transform adds dotfiles (like .gitignore)
 */
export async function dotfilesTransform(files: Files): Promise<Files> {
    throw new Error("STUB");
}
