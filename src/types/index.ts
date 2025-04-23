/**
 * Type definitions for the Catppuccin RemNote theme
 * @module types
 */

import { RNPlugin } from "@remnote/plugin-sdk";

/**
 * Defines custom color overrides for specific elements in the theme
 * Each property is optional and accepts a hex color string
 */
export interface CustomColors {
	/** Custom base color (main background) */
	base?: string;
	/** Custom mantle color (secondary background) */
	mantle?: string;
	/** Custom crust color (tertiary background) */
	crust?: string;
	/** Additional custom colors can be added as needed */
	[key: string]: string | undefined;
}

/**
 * Represents a color definition with various formats
 */
export interface ColorDefinition {
	/** Hex color code (e.g., "#000000") */
	hex: string;
	/** RGB color string (e.g., "rgb(0, 0, 0)") */
	rgb: string;
	/** HSL color string (e.g., "hsl(0, 0%, 0%)") */
	hsl: string;
	/** Raw RGB values as comma-separated string (e.g., "0, 0, 0") */
	raw: string;
}

/**
 * Catppuccin theme variants
 */
export type ThemeVariant = "latte" | "frappe" | "macchiato" | "mocha";

/**
 * Theme context required for applying a theme
 */
export interface ThemeContext {
	/** The plugin instance */
	plugin: RNPlugin;
	/** The theme variant to apply */
	theme?: string;
	/** The accent color to use */
	accent?: string;
	/** Custom color overrides */
	customColors?: CustomColors;
}

/**
 * Debug information about the current theme state
 */
export interface ThemeDebugInfo {
	/** Whether dark mode is detected */
	detectedDarkMode: boolean;
	/** Whether the system prefers dark mode */
	mediaQueryDarkMode: boolean;
}
