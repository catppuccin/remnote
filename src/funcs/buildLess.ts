import less from "less";
import { variants } from "@catppuccin/palette";
import tinycolor from "tinycolor2";

const americanoPalette = {
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

interface CustomColors {
	[key: string]: string;
}

function formTheme(
	theme: string,
	masterTheme: string,
	accent: string,
	customColors: CustomColors
) {
	// replace appearance with .light or .dark

	let themeData = masterTheme
		.replace(/"appearance"/g, theme === "latte" ? ".light" : ".dark")
		.replace(/"appearance-no-dot"/g, theme === "latte" ? "light" : "dark");
	themeData = themeData.replace(/@accent: @blue;/g, `@accent: @{${accent}};`);

	let americano: boolean = false;
	// prepend the color palette to the less file
	let palette = "";

	if (theme === "americano") {
		americano = true;
		theme = "mocha";
	}

	for (const colorName in variants[theme]) {
		// if the theme is americano, console.log americano everytime the colorName is either base, mantle, or crust
		if (americano && ["base", "mantle", "crust"].includes(colorName)) {
			palette += `@${colorName}-raw: ${americanoPalette[colorName].raw};\n`;
			palette += `@${colorName}-hsl: ${americanoPalette[colorName].hsl};\n`;
			palette += `@${colorName}-rgb: ${americanoPalette[colorName].rgb};\n`;
			palette += `@${colorName}: ${americanoPalette[colorName].hex};\n`;
			continue;
		}

		if (
			customColors.hasOwnProperty(colorName) &&
			customColors[colorName] !== ""
		) {
			console.log(customColors[colorName]);
			let color = tinycolor(customColors[colorName]);
			palette += `@${colorName}-raw: ${color.toRgbString()};\n`;
			palette += `@${colorName}-hsl: ${color.toHslString()};\n`;
			palette += `@${colorName}-rgb: ${color.toRgbString()};\n`;
			palette += `@${colorName}: ${color.toHexString()};\n`;
			continue;
		}

		let color = variants[theme][colorName];
		palette += `@${colorName}-raw: ${color.raw};\n`;
		palette += `@${colorName}-hsl: ${color.hsl};\n`;
		palette += `@${colorName}-rgb: ${color.rgb};\n`;
		palette += `@${colorName}: ${color.hex};\n`;
	}

	// do the same for the accent color
	const accentColor = variants[theme][accent];
	palette += `@accent-raw: ${accentColor.raw};\n`;
	palette += `@accent-hsl: ${accentColor.hsl};\n`;
	palette += `@accent-rgb: ${accentColor.rgb};\n`;
	palette += `@accent: ${accentColor.hex};\n`;
	//     '@blue-raw: 137, 180, 250;\n' +
	// '@blue-hsl: hsl(217, 92%, 76%);\n' +
	// '@blue-rgb: rgb(137, 180, 250);\n' +
	// '@blue: #89b4fa;\n' +

	themeData = palette + themeData;
	// compile the less file
	return new Promise((resolve, reject) => {
		// compile the less file
		less.render(themeData, (err: any, output: any) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				let css = output.css;
				const replaceDict = {
					CHECKBOX_ACCENT__: `${accentColor.hex.replace("#", "%23")}`,
				};
				for (const key in replaceDict) {
					css = css.replace(key, replaceDict[key]);
				}
				resolve(css);
			}
		});
	});
}

export { formTheme };
export type { CustomColors };
