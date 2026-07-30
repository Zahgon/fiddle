import { FiddleTheme } from '../themes-defaults';

/**
 * Get the CSS string for a theme.
 */
export function getCssStringForTheme(theme: FiddleTheme): string {
  let cssContent = '';

  const keys = Object.keys(theme.common) as (keyof typeof theme.common)[];

  keys.forEach((key: keyof typeof theme.common) => {
      throw new Error("STUB");
  });

  return `\n  html, body {\n${cssContent}  }\n`;
}
