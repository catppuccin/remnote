import {
	declareIndexPlugin,
	ReactRNPlugin,
	RNPlugin,
} from "@remnote/plugin-sdk";
import { CustomColors, formTheme } from "../funcs/buildLess";
import { variants, labels } from "@catppuccin/palette";

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
			{
				key: "4",
				label: "Americano",
				value: "americano",
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

	for (let i = 0; i < Object.keys(variants).length; i++) {
		const variant = Object.keys(variants)[i];
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

	for (let i = 0; i < Object.keys(labels).length; i++) {
		const catColor = Object.keys(labels)[i];
		await plugin.app.registerCommand({
			id: "set-${catColor}",
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

	// Register a setting to change the catppuccin base
	await plugin.settings.registerStringSetting({
		id: "catppuccinBaseColor",
		title: "Catppuccin Base Color",
		description:
			"Use a hex code to override the color in the Catppuccin Palette.",
	});
	// Register a setting to change the catppuccin crust
	await plugin.settings.registerStringSetting({
		id: "catppuccinCrustColor",
		title: "Catppuccin Crust Color",
		description:
			"Use a hex code to override the color in the Catppuccin Palette.",
	});
	// Register a setting to change the catppuccin mantle
	await plugin.settings.registerStringSetting({
		id: "catppuccinMantleColor",
		title: "Catppuccin Mantle Color",
		description:
			"Use a hex code to override the color in the Catppuccin Palette.",
	});

	function readHexCode(hexCode: string): string {
		// reads hex code string that can either have a # or not. Returns a hex code string with a #
		if (hexCode.charAt(0) === "#") {
			return hexCode;
		} else if (hexCode !== "") {
			return "#" + hexCode;
		} else {
			return "";
		}
	}

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

		// sleep for 2 secods FIXME: THIS IS A HACK/WORKAROUND AND SHOULD NOT PERSIST WHEN 1.3 KAJNFKDSJNFKSDJN
		// https://discord.com/channels/689979930804617224/995328932624744479/1111504182873161738
		await new Promise((r) => setTimeout(r, 1000));

		// check if the user has set a custom color for the base, crust, or mantle
		let baseColor: string | undefined =
			await reactivePlugin.settings.getSetting("catppuccinBaseColor");
		let crustColor: string | undefined =
			await reactivePlugin.settings.getSetting("catppuccinCrustColor");
		let mantleColor: string | undefined =
			await reactivePlugin.settings.getSetting("catppuccinMantleColor");

		// package the custom colors into an object
		const customColors: CustomColors = {
			base: readHexCode(baseColor || ""),
			mantle: readHexCode(mantleColor || ""),
			crust: readHexCode(crustColor || ""),
		};

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
		await formTheme(theme, masterTheme, accent, customColors)
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
