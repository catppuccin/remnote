/**
 * Utility functions for theme detection and manipulation
 * @module themeUtils
 */

import tinycolor from "tinycolor2";
import { ColorDefinition } from "../types";

/**
 * Detects if the current application is in dark mode
 * Uses media query strategy for theme detection
 *
 * @returns {boolean} True if dark mode is detected, false for light mode
 */
export function detectDarkMode(): boolean {
	// Strategy: Check media query for system preference
	if (
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		return true;
	}

	// Legacy Strategy 1: Check document body classes (most reliable)
	// if (document && document.body) {
	// 	const bodyClasses = document.body.className.split(" ");
	// 	if (bodyClasses.includes("dark")) {
	// 		return true;
	// 	} else if (bodyClasses.includes("light")) {
	// 		return false;
	// 	}
	// }

	// Default to dark mode as fallback
	return true;
}

/**
 * Type guard to safely check if a key exists in an object
 *
 * @template T - The object type
 * @param {T} obj - The object to check
 * @param {PropertyKey} key - The key to check for
 * @returns {key is keyof T} True if the key exists in the object
 */
export function hasKey<T extends object>(
	obj: T,
	key: PropertyKey,
): key is keyof T {
	return key in obj;
}

/**
 * Normalizes a hex color code string by ensuring it has a leading '#'
 *
 * @param {string} hexCode - The hex code to normalize
 * @returns {string} A normalized hex code with leading '#' (or empty string if input is empty)
 */
export function normalizeHexCode(hexCode: string): string {
	if (!hexCode) return "";
	return hexCode.charAt(0) === "#" ? hexCode : `#${hexCode}`;
}

/**
 * Extracts or creates color components in a type-safe way
 * Handles different color object formats and provides fallbacks
 *
 * @param {any} colorObj - The color object to extract components from
 * @returns {ColorDefinition} An object containing color components in different formats
 */
export function extractColorComponents(colorObj: any): ColorDefinition {
	// Handle different color object formats
	if (typeof colorObj === "object" && colorObj !== null) {
		// Try to extract the specific fields with fallbacks
		const hex = colorObj.hex || "#000000";

		// For raw RGB components - either extract or create from hex
		let raw = "";
		if ("rgb" in colorObj && typeof colorObj.rgb === "string") {
			// Try to extract RGB values from string
			const rgbMatch = colorObj.rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
			if (rgbMatch) {
				raw = rgbMatch[0];
			}
		}

		// If raw couldn't be extracted, create it from hex
		if (!raw) {
			const color = tinycolor(hex);
			const rgbObj = color.toRgb();
			raw = `${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}`;
		}

		// Get or generate the other formats
		const rgb = colorObj.rgb || tinycolor(hex).toRgbString();
		const hsl = colorObj.hsl || tinycolor(hex).toHslString();

		return { hex, rgb, hsl, raw };
	}

	// Fallback to black if the color object is invalid
	return {
		hex: "#000000",
		rgb: "rgb(0, 0, 0)",
		hsl: "hsl(0, 0%, 0%)",
		raw: "0, 0, 0",
	};
}
