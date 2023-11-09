import { type Options } from "tsup";

export default {
	bundle: true,
	dts: true,
	entry: ["./src/index.ts"],
	format: ["esm"],
	minify: true,
	platform: "neutral",
	sourcemap: true,
} satisfies Options;
