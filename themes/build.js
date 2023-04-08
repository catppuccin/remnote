const request = require("request");
const less = require("less");
const fs = require("fs");
const { variants, labels } = require("@catppuccin/palette");

const themes = ["latte", "frappe", "macchiato", "mocha"];

const url = "https://raw.githubusercontent.com/catppuccin/palette/main/less/";

console.log("Reading theme.less file");
fs.readFile("src/theme.less", "utf8", (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	// iterate through themes
	themes.forEach((theme) => {
		// replace appearance with .light or .dark
		const themeData = data.replace(
			/"appearance"/g,
			theme === "latte" ? ".light" : ".dark"
		);

		// fetch the less file from github
		console.log("Fetching less file from GitHub");
		request(url + theme + ".less", (err, res, body) => {
			if (err) {
				console.error(err);
				return;
			}

			for (let colorName in variants[theme]) {
				let color = variants[theme][colorName];
				body += `@${colorName}-raw: ${color.raw};\n`;
				body += `@${colorName}-hsl: ${color.hsl};\n`;
				body += `@${colorName}-rgb: ${color.rgb};\n`;
			}

			console.log("Writing less file to theme.less");
			let newFile = body + themeData;
			console.log("Compiling theme.less file");
			less.render(newFile, (err, output) => {
				if (err) {
					console.error(err);
					return;
				}
				console.log("Creating theme folder");
				fs.mkdirSync(theme);
				console.log("Writing CSS file to theme folder");
				fs.writeFile(theme + "/theme.css", output.css, (err) => {
					if (err) {
						console.error(err);
						return;
					}
					console.log("Copying manifest.json to theme folder");
					fs.copyFile(
						"src/manifest.json",
						theme + "/manifest.json",
						(err) => {
							if (err) {
								console.error(err);
								return;
							}
							console.log("Copying logo.png to theme folder");
							fs.copyFile(
								theme === "latte"
									? "src/wlogo.png"
									: "src/logo.png",
								theme + "/logo.png",
								(err) => {
									if (err) {
										console.error(err);
										return;
									}
								}
							);
						}
					);
				});
			});
		});
	});
});
