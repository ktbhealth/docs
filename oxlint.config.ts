import { defineConfig, type OxlintConfig } from "oxlint";
import { arch } from "@ktbhealth/workspace/eslint-config-arch";

// UI preset from @ktbhealth/workspace's eslint-config-arch: enables
// `arch/no-hardcoded-colors` on source globs (palette utilities,
// arbitrary color values, literal white/black fills in class strings)
// and turns it off on test files. `pluginSpecifier` is required — the
// plugin ships inside the workspace package under a subpath export.
const ui = arch.ui({
	pluginSpecifier: "@ktbhealth/workspace/eslint-plugin-arch",
});

export default defineConfig({
	// Generated/tool-managed output is not repo source.
	ignorePatterns: [
		"src/paraglide/**",
		"src/routeTree.gen.ts",
		".output/**",
		".tanstack/**",
		".vercel/**",
		".wrangler/**",
		".alchemy/**",
	],
	// The preset's `rules` maps are typed `Record<string, unknown>`;
	// oxlint's `DummyRuleMap` is narrower — the values are valid
	// AllowWarnDeny entries, so the cast is safe.
	...(ui as unknown as OxlintConfig),
});
