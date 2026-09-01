---
'assertron': patch
---

Raise the minimum of every runtime dependency to the version this release is built and
tested against: `iso-error@6.0.5`, `path-equal@1.2.7`, `satisfier@5.4.4`, `tersify@4.0.6`
and `type-plus@7.6.2`. Consumers resolve the newer upstreams as a result.

The published bundles are also rebuilt by tsdown rather than three `tsc` passes. The public
API is unchanged and `esm/index.js`, `cjs/index.js` and the declarations beside them keep
their paths, but the emitted output differs: the CJS target moves from ES5 to ES2015
(rolldown's floor), a small `_virtual/` helper module set appears alongside the entry, and
per-module `.d.ts` files that were never reachable through the `exports` map are no longer
emitted. Two source files that nothing referenced — `ts/assert-order/internalInterfaces.ts`
and `ts/testUtils.ts` — are dropped from the published `ts/` sources.
