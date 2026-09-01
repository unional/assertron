import { writeFile } from 'node:fs/promises'
import { defineConfig } from 'tsdown'

// Two configs, one per format, because each needs its own `outDir` and `target`.
// The published paths (`esm/index.js`, `cjs/index.js`, and the `.d.ts` beside each) are
// the ones the `tsc` passes used to emit — they have to stay byte-for-byte addressable
// or every consumer's deep import breaks.
//
// `outExtensions` is load-bearing: without it tsdown writes `.mjs` / `.d.mts`.
const shared = {
	entry: { index: 'ts/index.ts' },
	// Preserves the per-module shape `tsc` emitted, rather than bundling to one file.
	unbundle: true,
	dts: { sourcemap: true },
	outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
	sourcemap: true,
	clean: true,
} as const

export default defineConfig([
	{
		...shared,
		format: 'esm',
		outDir: 'esm',
		target: 'es2020',
	},
	{
		...shared,
		format: 'cjs',
		outDir: 'cjs',
		target: 'es2015',
		hooks: {
			// `copy`'s `to` is treated as a directory, so it cannot write this file.
			// A `"type": "module"` package needs it or the CJS output is parsed as ESM.
			// This replaces the old `ncp package.cjs.json cjs/package.json` step.
			'build:done': async () => {
				await writeFile('cjs/package.json', `${JSON.stringify({ type: 'commonjs' }, null, '\t')}\n`)
			},
		},
	},
])
