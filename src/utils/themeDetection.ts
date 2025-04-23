/**
 * Theme detection module with event listeners
 * @module themeDetection
 */

import { AppEvents, RNPlugin } from "@remnote/plugin-sdk";
import { detectDarkMode } from "./themeUtils";
import { applyThemeByAppearance } from "../theme/themeManager";

/**
 * Sets up theme detection and automatic theme switching
 * Uses event listeners for theme change detection
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 */
export function setupThemeDetection(plugin: RNPlugin): void {
	// Set up event listener for dark mode changes
	// Note: addListener might or might not return a function depending on SDK version
	plugin.event.addListener(
		AppEvents.setDarkMode,
		undefined,
		handleAppearanceChange(plugin),
	);

	// No more body observer - we're only using the event listener approach
}

/**
 * Returns a handler for appearance change events
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 * @returns {function} The event handler function
 */
function handleAppearanceChange(plugin: RNPlugin) {
	return async (newValue: any) => {
		const isDarkMode: boolean = newValue.darkMode;
		console.log(
			`Dark mode changed via AppEvents: ${isDarkMode ? "dark" : "light"}`,
		);

		const autoSwitch =
			await plugin.settings.getSetting("auto-switch-theme");
		if (autoSwitch) {
			await applyThemeByAppearance(plugin, isDarkMode);
		}
	};
}
