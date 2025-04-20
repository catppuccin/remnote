/**
 * Theme builder module for generating Catppuccin themes for RemNote
 * @module themeBuilder
 */

import less from "less";
import { variants } from "@catppuccin/palette";
import tinycolor from "tinycolor2";
import { ColorDefinition, CustomColors, ThemeVariant } from "../types";
import {
	extractColorComponents,
	hasKey,
	normalizeHexCode,
} from "../utils/themeUtils";

/**
 * Special palette for the "americano" theme variant
 * This is a custom all-black variant built on top of mocha
 */
const americanoPalette: Record<string, ColorDefinition> = {
	base: {
		hex: "#000000",
		rgb: "rgb(0, 0, 0)",
		hsl: "hsl(0deg, 0%, 0%)",
		raw: "0, 0, 0",
	},
	mantle: {
		hex: "#010101",
		rgb: "rgb(1, 1, 1)",
		hsl: "hsl(0deg, 0%, 0%, 1)",
		raw: "1, 1, 1",
	},
	crust: {
		hex: "#020202",
		rgb: "rgb(2, 2, 2)",
		hsl: "hsl(0deg, 0%, 1%, 1)",
		raw: "2, 2, 2",
	},
};

/**
 * Builds a theme CSS string based on the specified variant, master theme file, and customizations
 *
 * @param {string} theme - The theme variant name ('mocha', 'latte', etc.)
 * @param {string} masterTheme - The master LESS theme template
 * @param {string} accent - The accent color name ('blue', 'pink', etc.)
 * @param {CustomColors} customColors - Custom color overrides
 * @returns {Promise<string>} A promise resolving to the compiled CSS
 */
export async function formTheme(
	theme: string,
	masterTheme: string,
	accent: string,
	customColors: CustomColors,
): Promise<string> {
	// Apply appearance-specific replacements
	let themeData = masterTheme
		.replace(/"appearance"/g, theme === "latte" ? ".light" : ".dark")
		.replace(/"appearance-no-dot"/g, theme === "latte" ? "light" : "dark");

	// Set accent color variable
	themeData = themeData.replace(/@accent: @blue;/g, `@accent: @{${accent}};`);

	// Handle the special americano variant (black theme based on mocha)
	let isAmericano = false;
	let palette = "";

	if (theme === "americano") {
		isAmericano = true;
		theme = "mocha"; // Americano is based on mocha
	}

	// Validate the theme is a valid variant key
	const themeKey = theme as ThemeVariant;
	if (!variants[themeKey as keyof typeof variants]) {
		console.error(`Invalid theme: ${theme}, defaulting to mocha`);
		theme = "mocha";
	}

	// Get the variant object for this theme
	const themeVariant = variants[themeKey as keyof typeof variants];
	const colorNames = Object.keys(themeVariant);

	// Generate LESS variables for each color in the theme
	colorNames.forEach((colorName) => {
		// Handle americano special cases (override specific colors with black variants)
		if (isAmericano && ["base", "mantle", "crust"].includes(colorName)) {
			if (colorName in americanoPalette) {
				const colorDef = americanoPalette[colorName];
				palette += generateColorVariables(colorName, colorDef);
			}
			return;
		}

		// Handle custom colors (user overrides)
		if (customColors[colorName] && customColors[colorName] !== "") {
			console.log(
				`Custom color applied for ${colorName}: ${customColors[colorName]}`,
			);
			const color = tinycolor(customColors[colorName]);
			const colorDef: ColorDefinition = {
				raw: `${color.toRgb().r}, ${color.toRgb().g}, ${color.toRgb().b}`,
				hsl: color.toHslString(),
				rgb: color.toRgbString(),
				hex: color.toHexString(),
			};
			palette += generateColorVariables(colorName, colorDef);
			return;
		}

		// Standard color handling - get from the palette
		if (hasKey(themeVariant, colorName)) {
			const colorObj = themeVariant[colorName];
			const color = extractColorComponents(colorObj);
			palette += generateColorVariables(colorName, color);
		}
	});

	// Add accent color variables
	if (hasKey(themeVariant, accent)) {
		const accentObj = themeVariant[accent];
		const accentColor = extractColorComponents(accentObj);
		palette += generateColorVariables("accent", accentColor);
	}

	// Prepend the palette to the theme data
	themeData = palette + themeData;

	// Compile the LESS file to CSS
	return compileLess(themeData, accent, themeVariant);
}

/**
 * Generates LESS variables for a specific color in all formats
 *
 * @param {string} colorName - The name of the color
 * @param {ColorDefinition} colorDef - The color definition object
 * @returns {string} LESS variable declarations for the color
 */
function generateColorVariables(
	colorName: string,
	colorDef: ColorDefinition,
): string {
	let result = "";
	result += `@${colorName}-raw: ${colorDef.raw};\n`;
	result += `@${colorName}-hsl: ${colorDef.hsl};\n`;
	result += `@${colorName}-rgb: ${colorDef.rgb};\n`;
	result += `@${colorName}: ${colorDef.hex};\n`;
	return result;
}

/**
 * Compiles LESS to CSS with error handling
 *
 * @param {string} lessData - The LESS data to compile
 * @param {string} accent - The accent color name
 * @param {any} themeVariant - The theme variant object
 * @returns {Promise<string>} A promise resolving to the compiled CSS
 */
function compileLess(
	lessData: string,
	accent: string,
	themeVariant: any,
): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		less.render(lessData, (err: any, output: any) => {
			if (err) {
				console.error("LESS compilation error:", err);
				reject(err);
			} else {
				let css = output.css;

				// Apply special replacements after compilation
				const replaceDict: Record<string, string> = {
					CHECKBOX_ACCENT__: hasKey(themeVariant, accent)
						? extractColorComponents(
								themeVariant[accent],
							).hex.replace("#", "%23")
						: "%23000000",
				};

				// Apply all replacements
				for (const key in replaceDict) {
					css = css.replace(key, replaceDict[key]);
				}

				resolve(css);
			}
		});
	});
}
