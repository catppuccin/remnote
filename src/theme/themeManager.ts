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
 * @param {string} [theme] - Optional theme variant to use (fallbacks to settings)
 * @param {string} [accent] - Optional accent color to use (fallbacks to settings)
 * @returns {Promise<string>} - The compiled CSS or empty string if theme application failed
 */
export async function setTheme(
	plugin: RNPlugin,
	theme?: string,
	accent?: string,
): Promise<string> {
	try {
		// Fallback to settings if theme or accent not provided
		if (theme === undefined || theme === null) {
			theme = await plugin.settings.getSetting("theme");
		}
		if (accent === undefined || accent === null) {
			accent = await plugin.settings.getSetting("accent-color");
		}

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
		// Get appropriate theme based on dark/light mode with fallbacks
		const theme = isDarkMode
			? await plugin.settings.getSetting("dark-theme")
			: await plugin.settings.getSetting("light-theme");

		// Fallback to default themes if settings aren't found
		const effectiveTheme = theme || (isDarkMode ? "mocha" : "latte");

		// Get accent color from settings with fallback
		const accent =
			(await plugin.settings.getSetting("accent-color")) || "blue";

		// Apply the theme with type assertions for safety
		await setTheme(plugin, effectiveTheme as string, accent as string);

		console.log(
			`Applied theme: ${effectiveTheme} (${isDarkMode ? "dark" : "light"} mode detected)`,
		);
	} catch (error) {
		console.error("Error applying theme by appearance:", error);
		// Fallback to default theme if there's an error
		await setTheme(plugin);
	}
}

/**
 * Checks current theme state and applies appropriate theme
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<void>}
 */
export async function checkAndApplyTheme(plugin: RNPlugin): Promise<void> {
	// Detect current appearance mode
	const isDarkMode = detectDarkMode();
	console.log(`Theme detection: using ${isDarkMode ? "dark" : "light"} mode`);

	// Check if auto-switching is enabled
	const autoSwitch = await plugin.settings.getSetting("auto-switch-theme");

	if (autoSwitch) {
		await applyThemeByAppearance(plugin, isDarkMode);
	} else {
		// Apply manually selected theme from settings
		await setTheme(plugin);
	}
}
