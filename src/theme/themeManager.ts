/**
 * Theme management module for handling theme operations
 * @module themeManager
 */

import { RNPlugin } from "@remnote/plugin-sdk";
import { formTheme } from "./themeBuilder";
import { CustomColors, ThemeContext } from "../types";
import { detectDarkMode, normalizeHexCode } from "../utils/themeUtils";

/**
 * Sets the active theme in RemNote
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 * @param {string} theme - Theme variant to use
 * @param {string} accent - Accent color to use
 * @returns {Promise<string>} - The compiled CSS or empty string if theme application failed
 */
export async function setTheme(
	plugin: RNPlugin,
	theme: string,
	accent: string,
): Promise<string> {
	try {
		// Apply provided theme and accent directly

		// Get custom color overrides from settings
		const customColors = await getCustomColors(plugin);

		// Fetch the master theme template
		const masterTheme: string = await fetch(
			`${plugin.rootURL}theme.less`,
		).then((response) => response.text());

		// Validate required parameters
		if (!theme || !accent || !masterTheme) {
			console.error("Missing required theme parameters", {
				theme,
				accent,
			});
			return "";
		}

		// Generate and apply CSS
		const compiledCSS = await formTheme(
			theme,
			masterTheme,
			accent,
			customColors,
		);
		await plugin.app.registerCSS("catppuccin-palette", compiledCSS);

		return compiledCSS;
	} catch (error) {
		console.error("Failed to set theme:", error);
		return "";
	}
}

/**
 * Retrieves custom color overrides from plugin settings
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<CustomColors>} Object containing custom color overrides
 */
async function getCustomColors(plugin: RNPlugin): Promise<CustomColors> {
	const baseColor: string | undefined = await plugin.settings.getSetting(
		"catppuccinBaseColor",
	);
	const crustColor: string | undefined = await plugin.settings.getSetting(
		"catppuccinCrustColor",
	);
	const mantleColor: string | undefined = await plugin.settings.getSetting(
		"catppuccinMantleColor",
	);

	// Normalize and package the custom colors
	return {
		base: normalizeHexCode(baseColor || ""),
		mantle: normalizeHexCode(mantleColor || ""),
		crust: normalizeHexCode(crustColor || ""),
	};
}

/**
 * Applies the appropriate theme based on the current appearance (light/dark)
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 * @param {boolean} isDarkMode - Whether dark mode is currently active
 * @returns {Promise<void>}
 */
export async function applyThemeByAppearance(
	plugin: RNPlugin,
	isDarkMode: boolean,
): Promise<void> {
	try {
		// Fetch theme and accent from settings
		const [theme, accent] = await Promise.all([
			plugin.settings.getSetting(
				isDarkMode ? "dark-theme" : "light-theme",
			),
			plugin.settings.getSetting("accent-color"),
		]);
		const effectiveTheme =
			(theme as string) || (isDarkMode ? "mocha" : "latte");
		const effectiveAccent = (accent as string) || "blue";

		// Apply the theme
		await setTheme(plugin, effectiveTheme, effectiveAccent);
		console.log(
			`Applied theme: ${effectiveTheme} (${isDarkMode ? "dark" : "light"} mode detected)`,
		);
	} catch (error) {
		console.error("Error applying theme by appearance:", error);
		// Fallback to default theme
		await setTheme(plugin, "mocha", "blue");
	}
}

/**
 * Checks current theme state and applies appropriate theme
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<void>}
 */
export async function checkAndApplyTheme(plugin: RNPlugin): Promise<void> {
	const isDarkMode = detectDarkMode();
	console.log(`Theme detection: using ${isDarkMode ? "dark" : "light"} mode`);
	const autoSwitch = await plugin.settings.getSetting("auto-switch-theme");
	if (autoSwitch) {
		await applyThemeByAppearance(plugin, isDarkMode);
	} else {
		// Manual path: apply based on current appearance
		await applyThemeByAppearance(plugin, isDarkMode);
	}
}
