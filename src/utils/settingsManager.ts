/**
 * Settings manager for Catppuccin theme
 * @module settingsManager
 */

import { ReactRNPlugin } from "@remnote/plugin-sdk";

/**
 * Registers all plugin settings with RemNote
 * Centralizes the definition of settings to make them easier to maintain
 *
 * @param {ReactRNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<void>}
 */
export async function registerPluginSettings(
	plugin: ReactRNPlugin,
): Promise<void> {
	// Theme variant settings
	await plugin.settings.registerDropdownSetting({
		id: "theme",
		title: "Catppuccin Flavor",
		description:
			"Choose a catppuccin flavor for RemNote to take on!\n\nNOTE: Latte is only available in light mode!",
		defaultValue: "mocha",
		options: [
			{ key: "0", label: "Mocha", value: "mocha" },
			{ key: "1", label: "Latte", value: "latte" },
			{ key: "2", label: "Frappé", value: "frappe" },
			{ key: "3", label: "Macchiato", value: "macchiato" },
			{ key: "4", label: "Americano", value: "americano" },
		],
	});

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
			"The Catppuccin flavor to use when RemNote is in dark mode",
		defaultValue: "mocha",
		options: [
			{ key: "0", label: "Mocha", value: "mocha" },
			{ key: "2", label: "Frappé", value: "frappe" },
			{ key: "3", label: "Macchiato", value: "macchiato" },
			{ key: "4", label: "Americano", value: "americano" },
		],
	});

	// Light theme variant setting
	await plugin.settings.registerDropdownSetting({
		id: "light-theme",
		title: "Light Theme Flavor",
		description:
			"The Catppuccin flavor to use when RemNote is in light mode",
		defaultValue: "latte",
		options: [{ key: "1", label: "Latte", value: "latte" }],
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

	// Custom color override settings
	await plugin.settings.registerStringSetting({
		id: "catppuccinBaseColor",
		title: "Catppuccin Base Color",
		description:
			"Use a hex code to override the color in the Catppuccin Palette.",
	});

	await plugin.settings.registerStringSetting({
		id: "catppuccinCrustColor",
		title: "Catppuccin Crust Color",
		description:
			"Use a hex code to override the color in the Catppuccin Palette.",
	});

	await plugin.settings.registerStringSetting({
		id: "catppuccinMantleColor",
		title: "Catppuccin Mantle Color",
		description:
			"Use a hex code to override the color in the Catppuccin Palette.",
	});

	// Debug mode setting
	await plugin.settings.registerBooleanSetting({
		id: "debug-mode",
		title: "Debug Mode",
		description: "Enables debug mode",
		defaultValue: false,
	});
}

/**
 * Checks if debug mode is currently enabled
 *
 * @param {ReactRNPlugin} plugin - The RemNote plugin instance
 * @returns {Promise<boolean>} Whether debug mode is enabled
 */
export async function isDebugMode(plugin: ReactRNPlugin): Promise<boolean> {
	return await plugin.settings.getSetting("debug-mode");
}
