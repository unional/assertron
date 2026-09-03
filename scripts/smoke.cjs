// The CJS half of the cross-runtime smoke test: proves `require('assertron')` resolves
// through the `require` export condition and that `cjs/index.js` loads on each runtime.
// The ESM half (`smoke.mjs`) is where the behavioural checks live.
const path = require('node:path')

const entry = path.join(__dirname, '..', 'cjs', 'index.js')
const mod = require(entry)
const assertron = mod.assertron

const runtime = globalThis.Bun ? `bun ${globalThis.Bun.version}` : `node ${process.versions.node}`
console.log(`assertron CJS smoke test on ${runtime}`)

if (typeof assertron !== 'function' && typeof assertron !== 'object') {
	throw new Error('`assertron` is not exported from the CJS build')
}
if (typeof mod.AssertOrder !== 'function') throw new Error('`AssertOrder` is not exported from the CJS build')
if (typeof mod.AssertionError !== 'function') throw new Error('`AssertionError` is not exported from the CJS build')

assertron.truthy(1)
assertron.satisfies({ a: 1, b: 2 }, { a: 1 })

let threw = false
try {
	assertron.truthy(false)
} catch (e) {
	threw = e instanceof mod.AssertionError
}
if (!threw) throw new Error('a failed assertion did not throw the library AssertionError')

const order = new mod.AssertOrder()
order.once(1)
const taken = order.end()
if (typeof taken !== 'number' || Number.isNaN(taken) || taken < 0) {
	throw new Error(`end() returned ${taken}, expected an elapsed-milliseconds number`)
}

console.log(`\nall CJS smoke checks passed on ${runtime}`)
