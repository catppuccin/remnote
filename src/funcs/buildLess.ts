/**
 * Legacy module for building themes (redirects to the new themeBuilder module)
 * Kept for backwards compatibility
 * @module buildLess
 * @deprecated Use themeBuilder module instead
 */

import { formTheme as formThemeBuilder } from "../theme/themeBuilder";
import { CustomColors } from "../types";

/**
 * Builds a theme CSS string based on the specified variant, master theme file, and customizations
 * This is a wrapper function that redirects to the new themeBuilder module
 *
 * @param {string} theme - The theme variant name ('mocha', 'latte', etc.)
 * @param {string} masterTheme - The master LESS theme template
 * @param {string} accent - The accent color name ('blue', 'pink', etc.)
 * @param {CustomColors} customColors - Custom color overrides
 * @returns {Promise<string>} A promise resolving to the compiled CSS
 */
function formTheme(
	theme: string,
	masterTheme: string,
	accent: string,
	customColors: CustomColors,
): Promise<string> {
	// Just redirect to the new implementation
	return formThemeBuilder(theme, masterTheme, accent, customColors);
}

export { formTheme };
export type { CustomColors };
