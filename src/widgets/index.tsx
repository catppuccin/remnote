/**
 * Catppuccin Theme for RemNote
 * Main plugin entry point
 *
 * @module index
 */

import { declareIndexPlugin, ReactRNPlugin } from "@remnote/plugin-sdk";
import { registerPluginSettings } from "../utils/settingsManager";
import { checkAndApplyTheme } from "../theme/themeManager";
import { setupDebugMode, cleanupDebugMode } from "../utils/debugUtils";
import { setupThemeDetection } from "../utils/themeDetection";
import { detectDarkMode } from "../utils/themeUtils";

/**
 * Main plugin activation handler
 * Sets up settings, theme detection, and applies the initial theme
 *
 * @param {ReactRNPlugin} plugin - The RemNote plugin instance
 */
async function onActivate(plugin: ReactRNPlugin) {
	console.log("Catppuccin Theme Plugin activated");

	try {
		// Register all settings first
		await registerPluginSettings(plugin);

		// Apply initial theme based on current appearance
		const isDarkMode = detectDarkMode();
		console.log(
			`Initial theme detection: ${isDarkMode ? "dark" : "light"} mode`,
		);
		await checkAndApplyTheme(plugin);

		// Set up theme detection for automatic switching (no longer using hooks)
		setupThemeDetection(plugin);

		// Set up debug mode functionality
		await setupDebugMode(plugin);

		// Store current settings values to detect changes
		const settingsMonitor = {
			lastTheme: await plugin.settings.getSetting("theme"),
			lastAccentColor: await plugin.settings.getSetting("accent-color"),
			lastDarkTheme: await plugin.settings.getSetting("dark-theme"),
			lastLightTheme: await plugin.settings.getSetting("light-theme"),
		};
	} catch (error) {
		console.error("Error during plugin activation:", error);
		plugin.app.toast(
			"Error initializing Catppuccin theme. Check console for details.",
		);
	}
}

/**
 * Plugin deactivation handler
 * Performs cleanup when the plugin is deactivated
 *
 * @param {ReactRNPlugin} plugin - The RemNote plugin instance
 */
async function onDeactivate(plugin: ReactRNPlugin) {
	console.log("Catppuccin Theme Plugin deactivated");

	// Clean up CSS by removing it from the document
	await plugin.app.registerCSS("catppuccin-palette", "");

	// Clean up debug mode resources
	cleanupDebugMode();
}

// Register the plugin with RemNote
declareIndexPlugin(onActivate, onDeactivate);
