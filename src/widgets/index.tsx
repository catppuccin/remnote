import {
	declareIndexPlugin,
	ReactRNPlugin,
	RNPlugin,
} from "@remnote/plugin-sdk";
import { formTheme } from "../funcs/buildLess";

// TODO: HANDLE DARK/MODE GETTING AND SETTING WHEN USING LATTE OR NOT USING LATTE

async function onActivate(plugin: ReactRNPlugin) {
	// Register a setting to change the catppuccin theme
	await plugin.settings.registerDropdownSetting({
		id: "theme",
		title: "Catppuccin Flavor",
		description:
			"Choose a catppuccin flavor for RemNote to take on!\n\nNOTE: Latte is only available in light mode!",
		defaultValue: "mocha",
		options: [
			{
				key: "0",
				label: "Mocha",
				value: "mocha",
			},
			{
				key: "1",
				label: "Latte",
				value: "latte",
			},
			{
				key: "2",
				label: "Frappé",
				value: "frappe",
			},
			{
				key: "3",
				label: "Macchiato",
				value: "macchiato",
			},
		],
	});

	await plugin.settings.registerDropdownSetting({
		id: "accent-color",
		title: "Catppuccin Accent Color",
		description: "Choose an accent color for your catppuccin theme",
		defaultValue: "blue",
		options: [
			{
				key: "0",
				label: "Rosewater",
				value: "rosewater",
			},
			{
				key: "1",
				label: "Blue",
				value: "blue",
			},
			{
				key: "2",
				label: "Lavender",
				value: "lavender",
			},
			{
				key: "3",
				label: "Flamingo",
				value: "flamingo",
			},
			{
				key: "4",
				label: "Pink",
				value: "pink",
			},
			{
				key: "5",
				label: "Red",
				value: "red",
			},
			{
				key: "6",
				label: "Maroon",
				value: "maroon",
			},
			{
				key: "7",
				label: "Peach",
				value: "peach",
			},
			{
				key: "8",
				label: "Yellow",
				value: "yellow",
			},
			{
				key: "9",
				label: "Green",
				value: "green",
			},
			{
				key: "10",
				label: "Teal",
				value: "teal",
			},
			{
				key: "11",
				label: "Sky",
				value: "sky",
			},
			{
				key: "12",
				label: "Sapphire",
				value: "sapphire",
			},
			{
				key: "13",
				label: "Mauve",
				value: "mauve",
			},
		],
	});

	// Each time the setting changes, re-register the text color css.
	plugin.track(async (reactivePlugin) => {
		await setTheme(reactivePlugin);
	});

	// command to reload the theme
	await plugin.app.registerCommand({
		id: "reload-theme",
		name: "Reload Catppuccin Theme",
		description: "Reloads the catppuccin theme",
		action: async () => {
			await plugin.app.toast("Reloaded theme!");
			await setTheme(plugin);
		},
	});

	// commands to set the theme

	await plugin.app.registerCommand({
		id: "set-mocha",
		name: "Set Catppuccin Theme to Mocha",
		description: "Sets the catppuccin theme to mocha",
		action: async () => {
			await setTheme(plugin, "mocha");
		},
	});

	await plugin.app.registerCommand({
		id: "set-latte",
		name: "Set Catppuccin Theme to Latte",
		description: "Sets the catppuccin theme to latte",
		action: async () => {
			await setTheme(plugin, "latte");
		},
	});

	await plugin.app.registerCommand({
		id: "set-frappe",
		name: "Set Catppuccin Theme to Frappé",
		description: "Sets the catppuccin theme to frappé",
		action: async () => {
			await setTheme(plugin, "frappe");
		},
	});

	await plugin.app.registerCommand({
		id: "set-macchiato",
		name: "Set Catppuccin Theme to Macchiato",
		description: "Sets the catppuccin theme to macchiato",
		action: async () => {
			await setTheme(plugin, "macchiato");
		},
	});

	// commands to set the accent color (rosewater, blue, lavender, flamingo, pink, red, maroon, peach, yellow, green, teal, sky, sapphire, mauve)

	await plugin.app.registerCommand({
		id: "set-rosewater",
		name: "Set Catppuccin Accent Color to Rosewater",
		description: "Sets the catppuccin accent color to rosewater",
		action: async () => {
			await setTheme(plugin, undefined, "rosewater");
		},
	});

	await plugin.app.registerCommand({
		id: "set-blue",
		name: "Set Catppuccin Accent Color to Blue",
		description: "Sets the catppuccin accent color to blue",
		action: async () => {
			await setTheme(plugin, undefined, "blue");
		},
	});

	await plugin.app.registerCommand({
		id: "set-lavender",
		name: "Set Catppuccin Accent Color to Lavender",
		description: "Sets the catppuccin accent color to lavender",
		action: async () => {
			await setTheme(plugin, undefined, "lavender");
		},
	});

	await plugin.app.registerCommand({
		id: "set-flamingo",
		name: "Set Catppuccin Accent Color to Flamingo",
		description: "Sets the catppuccin accent color to flamingo",
		action: async () => {
			await setTheme(plugin, undefined, "flamingo");
		},
	});

	await plugin.app.registerCommand({
		id: "set-pink",
		name: "Set Catppuccin Accent Color to Pink",
		description: "Sets the catppuccin accent color to pink",
		action: async () => {
			await setTheme(plugin, undefined, "pink");
		},
	});

	await plugin.app.registerCommand({
		id: "set-red",
		name: "Set Catppuccin Accent Color to Red",
		description: "Sets the catppuccin accent color to red",
		action: async () => {
			await setTheme(plugin, undefined, "red");
		},
	});

	await plugin.app.registerCommand({
		id: "set-maroon",
		name: "Set Catppuccin Accent Color to Maroon",
		description: "Sets the catppuccin accent color to maroon",
		action: async () => {
			await setTheme(plugin, undefined, "maroon");
		},
	});

	await plugin.app.registerCommand({
		id: "set-peach",
		name: "Set Catppuccin Accent Color to Peach",
		description: "Sets the catppuccin accent color to peach",
		action: async () => {
			await setTheme(plugin, undefined, "peach");
		},
	});

	await plugin.app.registerCommand({
		id: "set-yellow",
		name: "Set Catppuccin Accent Color to Yellow",
		description: "Sets the catppuccin accent color to yellow",
		action: async () => {
			await setTheme(plugin, undefined, "yellow");
		},
	});

	await plugin.app.registerCommand({
		id: "set-green",
		name: "Set Catppuccin Accent Color to Green",
		description: "Sets the catppuccin accent color to green",
		action: async () => {
			await setTheme(plugin, undefined, "green");
		},
	});

	await plugin.app.registerCommand({
		id: "set-teal",
		name: "Set Catppuccin Accent Color to Teal",
		description: "Sets the catppuccin accent color to teal",
		action: async () => {
			await setTheme(plugin, undefined, "teal");
		},
	});

	await plugin.app.registerCommand({
		id: "set-sky",
		name: "Set Catppuccin Accent Color to Sky",
		description: "Sets the catppuccin accent color to sky",
		action: async () => {
			await setTheme(plugin, undefined, "sky");
		},
	});

	await plugin.app.registerCommand({
		id: "set-sapphire",
		name: "Set Catppuccin Accent Color to Sapphire",
		description: "Sets the catppuccin accent color to sapphire",
		action: async () => {
			await setTheme(plugin, undefined, "sapphire");
		},
	});

	await plugin.app.registerCommand({
		id: "set-mauve",
		name: "Set Catppuccin Accent Color to Mauve",
		description: "Sets the catppuccin accent color to mauve",
		action: async () => {
			await setTheme(plugin, undefined, "mauve");
		},
	});

	async function setTheme(
		reactivePlugin: RNPlugin,
		theme?: string | undefined,
		accent?: string | undefined
	) {
		if (theme === undefined || theme === null) {
			theme = await reactivePlugin.settings.getSetting("theme");
		}
		if (accent === undefined || accent === null) {
			accent = await reactivePlugin.settings.getSetting("accent-color");
		}

		const masterTheme: string = await fetch(
			`${plugin.rootURL}theme.less`
		).then((response) => response.text());
		let themeFile: string | any;
		if (theme === "latte") {
			plugin.app.toast(
				"Make sure to enable light mode in your RemNote settings!"
			);
		}
		if (
			theme === null ||
			theme === undefined ||
			accent === null ||
			accent === undefined
		) {
			return;
		}
		await formTheme(theme, masterTheme, accent)
			.then((compiledCSS) => {
				themeFile = compiledCSS;
			})
			.catch((error) => {
				console.error(error);
			});
		await reactivePlugin.app.registerCSS("catppuccin-palette", themeFile);
	}
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
