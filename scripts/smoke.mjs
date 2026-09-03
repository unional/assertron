// Cross-runtime smoke test for the *published* ESM output.
//
// Runs unmodified on Node, Bun and Deno. The vitest suite covers behaviour; this covers
// portability — that `esm/index.js` and everything it pulls in loads and works on a
// runtime that is not Node. It therefore imports the build output, not `ts/`, because the
// build output is the only thing consumers ever see.
import a, { AssertionError, AssertOrder, assertron } from '../esm/index.js'

const _runtime = globalThis.Deno
	? `deno ${globalThis.Deno.version.deno}`
	: globalThis.Bun
		? `bun ${globalThis.Bun.version}`
		: `node ${globalThis.process.versions.node}`

let failed = 0

function check(_name, fn) {
	try {
		fn()
	} catch (_e) {
		failed++
	}
}

async function checkAsync(_name, fn) {
	try {
		await fn()
	} catch (_e) {
		failed++
	}
}

function expectThrows(fn) {
	try {
		fn()
	} catch (e) {
		return e
	}
	throw new Error('expected to throw, did not')
}

check('default export is assertron', () => {
	if (a !== assertron) throw new Error('default export is not `assertron`')
})

check('truthy / falsy pass', () => {
	assertron.truthy(1)
	assertron.falsy(0)
})

check('truthy failure throws the library AssertionError', () => {
	const err = expectThrows(() => assertron.truthy(false))
	if (!(err instanceof AssertionError)) throw new Error(`not an assertron AssertionError: ${err}`)
})

check('satisfies passes and fails', () => {
	assertron.satisfies({ a: 1, b: 2 }, { a: 1 })
	expectThrows(() => assertron.satisfies({ a: 1 }, { a: 2 }))
})

check('isInstanceof', () => {
	assertron.isInstanceof(new Error('x'), Error)
	expectThrows(() => assertron.isInstanceof({}, Error))
})

check('pathEqual', () => {
	assertron.pathEqual('a/b/c', 'a/b/c')
	expectThrows(() => assertron.pathEqual('a/b/c', 'a/b/d'))
})

await checkAsync('throws / rejects / resolves', async () => {
	assertron.throws(() => {
		throw new Error('boom')
	})
	await assertron.rejects(Promise.reject(new Error('boom')))
	await assertron.resolves(Promise.resolve(1))
})

// The one place the package used to reach for a Node builtin (`perf_hooks`): the
// AssertOrder clock. If the portability fix regressed, importing this module would fail
// on Deno before any of this ran.
check('AssertOrder step tracking and its clock', () => {
	const order = new AssertOrder(2)
	order.once(1)
	order.once(2)
	expectThrows(() => order.once(1))

	// `end()` on an open-ended order returns the elapsed time from that clock.
	const timed = new AssertOrder()
	timed.once(1)
	const taken = timed.end()
	if (typeof taken !== 'number' || Number.isNaN(taken) || taken < 0) {
		throw new Error(`end() returned ${taken}, expected an elapsed-milliseconds number`)
	}
})
if (failed > 0) {
	if (globalThis.Deno) globalThis.Deno.exit(1)
	else globalThis.process.exit(1)
}
