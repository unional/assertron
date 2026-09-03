---
'assertron': patch
---

Drop the last Node builtin from the shipped code.

`AssertOrder`'s clock imported the bare `perf_hooks` specifier and preferred
`process.hrtime`. It now uses `performance.now()`, which every target runtime provides as
a global, falling back to `Date.now()`. The published `esm/` and `cjs/` output no longer
references any Node builtin, so it loads unchanged on Bun, Deno, browsers and edge
runtimes.

Elapsed times from `AssertOrder#end()` and `getTimeTaken()` are still high-resolution
milliseconds; only the clock behind them changed. The `browser` field's
`"perf_hooks": false` mapping is removed because there is no longer an import for a
bundler to stub.

`node:assert` is unchanged and unaffected: it appears only in the test helpers and spec
files, neither of which is published.
