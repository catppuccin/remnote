import less from "less";
import { variants } from "@catppuccin/palette";

const themes = ["latte", "frappe", "macchiato", "mocha"];

function formTheme(theme: string, masterTheme: string) {
	// replace appearance with .light or .dark
	let themeData = masterTheme.replace(
		/"appearance"/g,
		theme === "latte" ? ".light" : ".dark"
	);

	// prepend the color palette to the less file
	let palette = "";

	for (const colorName in variants[theme]) {
		let color = variants[theme][colorName];
		palette += `@${colorName}-raw: ${color.raw};\n`;
		palette += `@${colorName}-hsl: ${color.hsl};\n`;
		palette += `@${colorName}-rgb: ${color.rgb};\n`;
		palette += `@${colorName}: ${color.hex};\n`;
	}

	themeData = palette + themeData;

	console.log("Compiling theme: " + themeData);

	let output = "";

	// compile the less file
	return new Promise((resolve, reject) => {
		// compile the less file
		less.render(themeData, (err: any, output: any) => {
			if (err) {
				reject(err);
			} else {
				resolve(output.css);
			}
		});
	});
}

export { formTheme };
