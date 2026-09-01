import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		// `describe`/`test`/`it`/`expect` are used bare across the specs, as they were
		// under jest. `globals: true` plus `vitest/globals` in tsconfig `types` keeps the
		// spec files unchanged by the runner swap.
		globals: true,
		include: ['ts/**/*.spec.ts'],
		coverage: {
			provider: 'v8',
			include: ['ts/**/*.ts'],
			exclude: ['ts/**/*.spec.ts', 'ts/testUtils.ts'],
			reporter: ['text', 'lcov'],
			// Set to the level the repo already meets, so coverage is a gate rather than a
			// report. vitest's `text` reporter lists only files with gaps — an empty table
			// means full coverage, not a broken report.
			thresholds: {
				statements: 95,
				branches: 95,
				functions: 95,
				lines: 95,
			},
		},
	},
})
