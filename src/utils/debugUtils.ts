/**
 * Debug utilities for the Catppuccin theme
 * @module debugUtils
 */

import { RNPlugin } from "@remnote/plugin-sdk";
import { variants, labels } from "@catppuccin/palette";
import { ThemeDebugInfo } from "../types";
import { detectDarkMode } from "./themeUtils";
import { isDebugMode } from "./settingsManager";
import { setTheme, applyThemeByAppearance } from "../theme/themeManager";

// Store interval references for cleanup
let debugModeCheckInterval: number | null = null;

/**
 * Sets up debug mode functionality including debug commands
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<void>}
 */
export async function setupDebugMode(plugin: RNPlugin): Promise<void> {
	// Check the debug mode setting on initialization
	const debugModeEnabled = await isDebugMode(plugin);

	if (debugModeEnabled) {
		await registerDebugCommands(plugin);
	}

	// Monitor changes to debug mode setting by checking periodically
	// since settings.onChange is not available
	const initialDebugMode =
		(await plugin.settings.getSetting("debug-mode")) || false;
}

/**
 * Cleans up debug utilities when the plugin is deactivated
 */
export function cleanupDebugMode(): void {
	if (debugModeCheckInterval !== null) {
		clearInterval(debugModeCheckInterval);
		debugModeCheckInterval = null;
	}
}

/**
 * Registers all debug commands with RemNote
 * Only called when debug mode is enabled
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<void>}
 */
async function registerDebugCommands(plugin: RNPlugin): Promise<void> {
	// Commands for each accent color
	for (const catColor of Object.keys(labels)) {
		await plugin.app.registerCommand({
			id: `set-${catColor}`,
			name: `Set Catppuccin Accent Color to ${
				catColor.charAt(0).toUpperCase() + catColor.slice(1)
			}`,
			description: `Sets the Catppuccin Accent Color to ${
				catColor.charAt(0).toUpperCase() + catColor.slice(1)
			}`,
			action: async () => {
				// Get current theme and apply with new accent
				const isDarkMode = detectDarkMode();
				const theme =
					((await plugin.settings.getSetting(
						isDarkMode ? "dark-theme" : "light-theme",
					)) as string) || (isDarkMode ? "mocha" : "latte");
				await setTheme(plugin, theme, catColor);
			},
		});
	}

	// Commands for each theme variant
	for (const variant of Object.keys(variants)) {
		await plugin.app.registerCommand({
			id: `set-${variant}`,
			name: `Set Catppuccin Theme to ${
				variant.charAt(0).toUpperCase() + variant.slice(1)
			}`,
			description: `Sets the catppuccin theme to ${
				variant.charAt(0).toUpperCase() + variant.slice(1)
			}`,
			action: async () => {
				// Get current accent and apply with new theme
				const accent =
					((await plugin.settings.getSetting(
						"accent-color",
					)) as string) || "blue";
				await setTheme(plugin, variant, accent);
			},
		});
	}

	// Theme detection testing command
	await plugin.app.registerCommand({
		id: "debug-test-theme-detection",
		name: "Test Theme Detection",
		quickCode: "testtheme",
		description: "Tests the theme detection and logs results",
		action: async () => {
			const debugInfo = getThemeDebugInfo();
			console.log(debugInfo);
			plugin.app.toast(
				`Theme detection: ${debugInfo.detectedDarkMode ? "Dark" : "Light"} mode (see console for details)`,
			);
		},
	});

	// Disable theme command
	await plugin.app.registerCommand({
		id: "debug-disable-ctp",
		name: "Disable Catppuccin Theme",
		quickCode: "dctp",
		description: "Disables the Catppuccin Theme",
		action: async () => {
			await plugin.app.registerCSS("catppuccin-palette", "");
		},
	});

	// Dump CSS command
	await plugin.app.registerCommand({
		id: "dump-css-clipconsole",
		name: "Dump CSS to Clipboard and Console",
		quickCode: "dumpcss",
		description: "Dumps the CSS to the clipboard and console",
		action: async () => {
			const isDarkMode = detectDarkMode();
			const theme =
				((await plugin.settings.getSetting(
					isDarkMode ? "dark-theme" : "light-theme",
				)) as string) || (isDarkMode ? "mocha" : "latte");
			const accent =
				((await plugin.settings.getSetting(
					"accent-color",
				)) as string) || "blue";
			const css = await setTheme(plugin, theme, accent);

			plugin.app.toast("CSS dumped to clipboard and console");
			console.log(css);

			if (navigator.clipboard && navigator.clipboard.writeText) {
				try {
					await navigator.clipboard.writeText(css);
				} catch (error) {
					console.error("Clipboard write failed:", error);
				}
			} else {
				console.error(
					"Clipboard API is not supported in this browser.",
				);
			}
		},
	});
}

/**
 * Gets debug information about the current theme state
 *
 * @returns {ThemeDebugInfo} Object containing debug information
 */
export function getThemeDebugInfo(): ThemeDebugInfo {
	const isDarkMode = detectDarkMode();

	return {
		detectedDarkMode: isDarkMode,
		mediaQueryDarkMode:
			window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ||
			false,
	};
}
