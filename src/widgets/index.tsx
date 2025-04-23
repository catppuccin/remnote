/**
 * Catppuccin Theme for RemNote
 * Main plugin entry point
 *
 * @module index
 */

import { declareIndexPlugin, RNPlugin } from "@remnote/plugin-sdk";
import { registerPluginSettings } from "../utils/settingsManager";
import { checkAndApplyTheme, setTheme, applyThemeByAppearance } from "../theme/themeManager";
import { setupDebugMode, cleanupDebugMode } from "../utils/debugUtils";
import { setupThemeDetection } from "../utils/themeDetection";
import { detectDarkMode } from "../utils/themeUtils";

/**
 * Main plugin activation handler
 * Sets up settings, theme detection, and applies the initial theme
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 */
async function onActivate(plugin: RNPlugin) {
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

		// Each time the setting changes, reapply the theme, also watch for debug mode
		plugin.track(async (newPlugin) => {
			// force‑subscribe to all settings
			await newPlugin.settings.getSetting("light-theme");
			await newPlugin.settings.getSetting("dark-theme");
			await newPlugin.settings.getSetting("accent-color");
			console.log("Settings changed, reapplying theme...");
			await checkAndApplyTheme(newPlugin);
			await setupDebugMode(newPlugin as RNPlugin);
		});
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
 * @param {RNPlugin} plugin - The RemNote plugin instance
 */
async function onDeactivate(plugin: RNPlugin) {
	console.log("Catppuccin Theme Plugin deactivated");

	// Clean up CSS by removing it from the document
	await plugin.app.registerCSS("catppuccin-palette", "");

	// Clean up debug mode resources
	cleanupDebugMode();
}

// Register the plugin with RemNote
declareIndexPlugin(onActivate, onDeactivate);
