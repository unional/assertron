import { test } from 'ava'
import { satisfy } from './satisfy'

test('primitive types will pass', t => {
  satisfy(1, 1)
  satisfy('a', 'a')
  satisfy(true, true)
  t.pass()
})

test('primitive types shows value directly in error', t => {
  let err = t.throws(() => satisfy(1, 2))
  t.is(err.message, 'Expect actual to be 2, but received 1')

  err = t.throws(() => satisfy(true, false))
  t.is(err.message, 'Expect actual to be false, but received true')

  err = t.throws(() => satisfy('a', 'b'))
  t.is(err.message, `Expect actual to be 'b', but received 'a'`)
})

test('empty object will pass any object', t => {
  satisfy({}, {})
  satisfy({ a: 1 }, {})
  t.pass()
})

test('empty object will fail against primitive types', t => {
  let err = t.throws(() => satisfy(1, {} as any))
  t.is(err.message, 'Type mismatch. Expecting object')
})

test(`actual is array while expected is not throws error`, t => {
  let err = t.throws(() => satisfy([1], 1))
  t.is(err.message, 'Type mismatch. Expecting number')
})

test(`array length not match throws error`, t => {
  t.throws(() => satisfy([1, 2], [1]))
})

test.todo('matching entries within array')

test('work with primitive array', t => {
  satisfy([1, 2, 3], [1, 2, 3])
  satisfy([true, false], [true, false])
  satisfy(['a', 'b'], ['a', 'b'])
  t.pass()
})

test('missing property will fail', t => {
  const err = t.throws(() => satisfy({}, { a: 1 }))
  t.is(err.message, `Missing property a`)
})

test('missing property at deeper level', t => {
  const err = t.throws(() => satisfy({ a: {} }, { a: { b: 1 } }))
  t.is(err.message, `Missing property a.b`)
})

test('extra property will pass', t => {
  satisfy({ a: 1, b: 2 }, { a: 1 })
  t.pass()
})

test('property not match will fail', t => {
  const err = t.throws(() => satisfy({ a: 1 }, { a: 2 }))
  t.is(err.message, `Expect a to be 2, but received 1`)
})

test('regex will match regex', t => {
  satisfy({ a: /foo/ }, { a: /foo/ })
  t.pass()
})

test('regex will be used to match', t => {
  satisfy({ a: 'foo' }, { a: /foo/ })
  t.pass()
})

test('function will use as predicate', t => {
  satisfy({ a: 1 }, { a: a => a === 1 })
  t.pass()
})

test('predicate error should mention path', t => {
  const err = t.throws(() => satisfy({ a: 1 }, { a: () => false }))
  t.is(err.message, `Property a fails predicate`)
})

test('deep predicate error should mention path', t => {
  const err = t.throws(() => satisfy({ a: { b: 1 } }, { a: { b: b => b === 2 } }))
  t.is(err.message, `Property a.b fails predicate`)
})
