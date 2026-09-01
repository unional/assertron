# assertron

## 11.5.4

### Patch Changes

- cdcd018: Raise the minimum of every runtime dependency to the version this release is built and
  tested against: `iso-error@6.0.5`, `path-equal@1.2.7`, `satisfier@5.4.4`, `tersify@4.0.6`
  and `type-plus@7.6.2`. Consumers resolve the newer upstreams as a result.
  
  The published bundles are also rebuilt by tsdown rather than three `tsc` passes. The public
  API is unchanged and `esm/index.js`, `cjs/index.js` and the declarations beside them keep
  their paths, but the emitted output differs: the CJS target moves from ES5 to ES2015
  (rolldown's floor), a small `_virtual/` helper module set appears alongside the entry, and
  per-module `.d.ts` files that were never reachable through the `exports` map are no longer
  emitted. Two source files that nothing referenced — `ts/assert-order/internalInterfaces.ts`
  and `ts/testUtils.ts` — are dropped from the published `ts/` sources.

## 11.5.3

### Patch Changes

- 363640b: Point repository metadata at `cyberuni/assertron` and release through npm trusted
  publishing (OIDC) instead of a long-lived `NPM_TOKEN`.

## 11.5.2

### Patch Changes

- 7b46ba0: Fix process is not defined in browser

## 11.5.1

### Patch Changes

- 49aaed5: fix global is not defined in browser.

## 11.5.0

### Minor Changes

- 358b239: Add message support for `true|false|truthy|falsy`

## 11.4.0

### Minor Changes

- cf66a04: Add `uuid()`
