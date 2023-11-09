import tsconfigPaths from "vite-tsconfig-paths";
import { type UserConfig } from "vitest/config";

export default {
	plugins: [tsconfigPaths()],
	test: {
		coverage: {
			provider: "istanbul",
		},
		reporters: ["basic"],
	},
} satisfies UserConfig;
