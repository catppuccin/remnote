import {
	AppEvents,
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

	plugin.event.addListener(AppEvents.setDarkMode, undefined, (newvalue) => {
		const isDarkMode: boolean = newvalue["darkMode"];
		console.log("dark mode: " + isDarkMode);
	});

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

	await plugin.settings.registerBooleanSetting({
		id: "debug-mode",
		title: "Debug Mode",
		description: "Enables debug mode",
		defaultValue: false,
	});

	// Each time the setting changes, re-register the text color css.
	plugin.track(async (reactivePlugin) => {
		await setTheme(reactivePlugin);
		await isDebugMode(reactivePlugin).then(async (debugMode) => {
			if (debugMode) {
				plugin.app.toast("Debug Mode Enabled; Registering Debug Tools");

				plugin.app.registerCommand({
					id: "debug-enable-ctp",
					name: "Enable Catppuccin Theme",
					quickCode: "ectp",
					description: "Enables the Catppuccin Theme",
					action: async () => {
						await setTheme(plugin);
					},
				});

				for (let i = 0; i < Object.keys(labels).length; i++) {
					const catColor = Object.keys(labels)[i];
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

				await plugin.app.registerCommand({
					id: "debug-disable-ctp",
					name: "Disable Catppuccin Theme",
					quickCode: "dctp",
					description: "Disables the Catppuccin Theme",
					action: async () => {
						await plugin.app.registerCSS("catppuccin-palette", "");
					},
				});

				await plugin.app.registerCommand({
					id: "dump-css-clipconsole",
					name: "Dump CSS to Clipboard and Console",
					quickCode: "dumpcss",
					description: "Dumps the CSS to the clipboard and console",
					action: async () => {
						const css = await setTheme(plugin);
						plugin.app.toast("CSS dumped to clipboard and console");
						console.log(css);

						if (
							navigator.clipboard &&
							navigator.clipboard.writeText
						) {
							try {
								await navigator.clipboard.writeText(css);
							} catch (error) {
								console.error("Clipboard write failed:", error);
							}
						} else {
							console.error(
								"Clipboard API is not supported in this browser."
							);
						}
					},
				});
			}
		});
	});
}

async function isDebugMode(reactivePlugin: RNPlugin): Promise<boolean> {
	return await reactivePlugin.settings.getSetting("debug-mode");
}

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
		`${reactivePlugin.rootURL}theme.less`
	).then((response) => response.text());
	let themeFile: string | any;
	if (theme === "latte") {
		reactivePlugin.app.toast(
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
	return themeFile;
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
