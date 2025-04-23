/**
 * Settings manager for Catppuccin theme
 * @module settingsManager
 */

import { RNPlugin } from "@remnote/plugin-sdk";

/**
 * Registers all plugin settings with RemNote
 * Centralizes the definition of settings to make them easier to maintain
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<void>}
 */
export async function registerPluginSettings(plugin: RNPlugin): Promise<void> {
	// Auto-switching theme setting
	await plugin.settings.registerBooleanSetting({
		id: "auto-switch-theme",
		title: "Automatic Dark/Light Theme Switching",
		description:
			"Automatically switch between dark and light themes based on RemNote's appearance setting",
		defaultValue: true,
	});

	// Dark theme variant setting
	await plugin.settings.registerDropdownSetting({
		id: "dark-theme",
		title: "Dark Theme Flavor",
		description:
			"The Catppuccin flavor to use when RemNote is in dark mode.",
		defaultValue: "mocha",
		options: [
			{ key: "1", label: "Mocha", value: "mocha" },
			{ key: "2", label: "Frappé", value: "frappe" },
			{ key: "3", label: "Macchiato", value: "macchiato" },
			{ key: "4", label: "Latte", value: "latte" },
		],
	});

	// Light theme variant setting
	await plugin.settings.registerDropdownSetting({
		id: "light-theme",
		title: "Light Theme Flavor",
		description:
			"The Catppuccin flavor to use when RemNote is in light mode. At the moment, this is only latte. If you want the other flavors, forcefully set your app to dark mode and then the dark theme setting.",
		defaultValue: "latte",
		options: [
			// TODO: Theoretically, if the user is in light mode environmentally in the app but switches to a frappe macchiato or mocha color, it looks bad because the CSS fights, but the plugin cannot assert to the app to switch the system appearance itself. So we actually shouldn't offer all flavors, even though in the broad organization, other ports do offer all flavors.
			{ key: "1", label: "Latte", value: "latte" },
			// { key: "2", label: "Frappé", value: "frappe" },
			// { key: "3", label: "Macchiato", value: "macchiato" },
			// { key: "4", label: "Mocha", value: "mocha" },
		],
	});

	// Accent color setting
	await plugin.settings.registerDropdownSetting({
		id: "accent-color",
		title: "Catppuccin Accent Color",
		description: "Choose an accent color for your catppuccin theme",
		defaultValue: "blue",
		options: [
			{ key: "0", label: "Rosewater", value: "rosewater" },
			{ key: "1", label: "Blue", value: "blue" },
			{ key: "2", label: "Lavender", value: "lavender" },
			{ key: "3", label: "Flamingo", value: "flamingo" },
			{ key: "4", label: "Pink", value: "pink" },
			{ key: "5", label: "Red", value: "red" },
			{ key: "6", label: "Maroon", value: "maroon" },
			{ key: "7", label: "Peach", value: "peach" },
			{ key: "8", label: "Yellow", value: "yellow" },
			{ key: "9", label: "Green", value: "green" },
			{ key: "10", label: "Teal", value: "teal" },
			{ key: "11", label: "Sky", value: "sky" },
			{ key: "12", label: "Sapphire", value: "sapphire" },
			{ key: "13", label: "Mauve", value: "mauve" },
		],
	});

	// Debug mode setting
	await plugin.settings.registerBooleanSetting({
		id: "debug-mode",
		title: "Debug Mode",
		description: "Enables debug mode",
		defaultValue: false,
	});

	// Custom color override settings
	await plugin.settings.registerStringSetting({
		id: "catppuccinBaseColor",
		title: "Override: Base Color",
		description:
			"Use a hex code to override the base color in the Catppuccin Palette.",
	});

	await plugin.settings.registerStringSetting({
		id: "catppuccinCrustColor",
		title: "Override: Crust Color",
		description:
			"Use a hex code to override the crust color in the Catppuccin Palette.",
	});

	await plugin.settings.registerStringSetting({
		id: "catppuccinMantleColor",
		title: "Override: Mantle Color",
		description:
			"Use a hex code to override the mantle color in the Catppuccin Palette.",
	});
}

/**
 * Checks if debug mode is currently enabled
 *
 * @param {RNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<boolean>} Whether debug mode is enabled
 */
export async function isDebugMode(plugin: RNPlugin): Promise<boolean> {
	return await plugin.settings.getSetting("debug-mode");
}
