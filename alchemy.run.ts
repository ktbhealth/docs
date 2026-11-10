import * as Alchemy from "alchemy";
import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Effect from "effect/Effect";

// Deploys the nitro `cloudflare_module` build output (.output) to a single
// Cloudflare Worker. Run `bun run build:cf` first (or use `bun run deploy`,
// which builds then deploys).
export default Alchemy.Stack(
	"ktb-docs",
	{
		providers: Cloudflare.providers(),
		state: Cloudflare.state(),
	},
	Effect.gen(function* () {
		const worker = yield* Cloudflare.Workers.Worker("docs", {
			// nitro emits a Worker-ready ESM bundle; bundle:false uploads
			// index.mjs plus its sibling chunks byte-for-byte.
			main: ".output/server/index.mjs",
			bundle: false,
			// Prerendered pages + hashed client assets, served through the
			// ASSETS binding nitro's runtime expects.
			assets: {
				directory: ".output/public",
			},
			// nitro's runtime imports node:process/node:buffer/node:timers.
			compatibility: {
				flags: ["nodejs_compat"],
			},
		});

		return {
			url: worker.url,
		};
	}),
);
