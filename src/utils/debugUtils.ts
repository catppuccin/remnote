/**
 * Debug utilities for the Catppuccin theme
 * @module debugUtils
 */

import { ReactRNPlugin } from "@remnote/plugin-sdk";
import { variants, labels } from "@catppuccin/palette";
import { ThemeDebugInfo } from "../types";
import { detectDarkMode } from "./themeUtils";
import { isDebugMode } from "./settingsManager";
import { setTheme } from "../theme/themeManager";

// Store interval references for cleanup
let debugModeCheckInterval: number | null = null;

/**
 * Sets up debug mode functionality including debug commands
 *
 * @param {ReactRNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<void>}
 */
export async function setupDebugMode(plugin: ReactRNPlugin): Promise<void> {
	// Check the debug mode setting on initialization
	const debugModeEnabled = await isDebugMode(plugin);

	if (debugModeEnabled) {
		await registerDebugCommands(plugin);
	}

	// Clear any existing interval
	if (debugModeCheckInterval !== null) {
		clearInterval(debugModeCheckInterval);
	}

	// Monitor changes to debug mode setting by checking periodically
	// since settings.onChange is not available
	const initialDebugMode =
		(await plugin.settings.getSetting("debug-mode")) || false;
	let currentDebugModeState = initialDebugMode;

	// Set up an interval to check for changes in debug mode
	debugModeCheckInterval = window.setInterval(async () => {
		try {
			const currentDebugMode =
				(await plugin.settings.getSetting("debug-mode")) || false;

			// If debug mode state changed
			if (currentDebugMode !== currentDebugModeState) {
				// Update our tracked state
				currentDebugModeState = currentDebugMode;

				// If debug mode changed from off to on
				if (currentDebugMode) {
					await registerDebugCommands(plugin);
					plugin.app.toast(
						"Debug Mode Enabled; Registering Debug Tools",
					);
					console.log("Debug mode enabled");
				} else {
					console.log("Debug mode disabled");
					// Note: We can't unregister commands, but we could potentially
					// implement a no-op for debug commands when debug mode is disabled
				}
			}
		} catch (error) {
			console.error("Error checking debug mode state:", error);
		}
	}, 5000); // Check every 5 seconds
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
 * @param {ReactRNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<void>}
 */
async function registerDebugCommands(plugin: ReactRNPlugin): Promise<void> {
	// Enable Catppuccin command
	await plugin.app.registerCommand({
		id: "debug-enable-ctp",
		name: "Enable Catppuccin Theme",
		quickCode: "ectp",
		description: "Enables the Catppuccin Theme",
		action: async () => {
			await setTheme(plugin);
		},
	});

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
				await setTheme(plugin, undefined, catColor);
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
				await setTheme(plugin, variant);
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
			const css = await setTheme(plugin);
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
