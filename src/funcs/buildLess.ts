import less from "less";
import { variants } from "@catppuccin/palette";

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

function formTheme(theme: string, masterTheme: string, accent: string) {
	// replace appearance with .light or .dark

	let themeData = masterTheme.replace(
		/"appearance"/g,
		theme === "latte" ? ".light" : ".dark"
	);
	themeData = themeData.replace(/@accent: @blue;/g, `@accent: @{${accent}};`);

	let americano: boolean = false;
	// prepend the color palette to the less file
	let palette = "";

	console.log(theme);

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

	themeData = palette + themeData;
	console.log(themeData);
	// compile the less file
	return new Promise((resolve, reject) => {
		// compile the less file
		less.render(themeData, (err: any, output: any) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				console.log(output.css);
				resolve(output.css);
			}
		});
	});
}

export { formTheme };
