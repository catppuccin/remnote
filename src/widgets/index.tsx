import {
	declareIndexPlugin,
	ReactRNPlugin,
	EventNamespace,
	RNPlugin,
	useLocalStorageState,
	useSyncedStorageState,
} from "@remnote/plugin-sdk";
import { formTheme } from "../funcs/buildLess";
import React from "react";

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

	async function setTheme(reactivePlugin: RNPlugin) {
		const theme: string = await reactivePlugin.settings.getSetting("theme");
		const accent: string = await reactivePlugin.settings.getSetting(
			"accent-color"
		);

		const masterTheme: string = await fetch(
			`${plugin.rootURL}theme.less`
		).then((response) => response.text());
		let themeFile: string | any;
		if (theme === "latte") {
			plugin.app.toast(
				"Make sure to enable light mode in your RemNote settings!"
			);
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
