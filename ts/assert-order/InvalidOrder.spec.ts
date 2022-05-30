import t from 'assert'
import { AssertOrder } from '../index.js'
import { assertThrows } from '../testUtils.js'

test('error message for once()', () => {
  const o = new AssertOrder()
  const err = assertThrows(() => o.once(2))
  t.strictEqual(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'once(2)'`)
})

test('error message for multi-step methods', () => {
  const o = new AssertOrder()
  o.exactly(1, 2)
  const err = assertThrows(() => o.once(2))
  t.strictEqual(err.message, `Expecting 'exactly(1, 2)', but received 'once(2)'`)
})

test('error message for exactly() called too many times', () => {
  const o = new AssertOrder()
  o.exactly(1, 2)
  o.exactly(1, 2)
  const err = assertThrows(() => o.exactly(1, 2))
  t.strictEqual(err.message, `Expecting 'is(2)', 'once(2)', 'any([2])', but received 'exactly(1, 2)'`)
})

test('error message for is()', () => {
  const order = new AssertOrder()
  const err = assertThrows(() => order.is(0))
  t.strictEqual(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'is(0)'`)
})

test(`error message for not()`, () => {
  const order = new AssertOrder()
  const err = assertThrows(() => order.not(1))
  t.strictEqual(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'not(1)'`)
})

test('error message for atLeastOnce()', () => {
  const order = new AssertOrder()
  order.once(1)
  const err = assertThrows(() => order.atLeastOnce(1))
  t.strictEqual(err.message, `Expecting 'is(2)', 'once(2)', 'any([2])', but received 'atLeastOnce(1)'`)
})

test('error message for any()', () => {
  const order = new AssertOrder()

  let err = assertThrows(() => order.any([2]))
  t.strictEqual(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'any([2])'`)

  err = assertThrows(() => order.any([2, 3]))
  t.strictEqual(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'any([2, 3])'`)
})

test('error message for end()', () => {
  const order = new AssertOrder(1)

  const err = assertThrows(() => order.end())
  t.strictEqual(err.message, `Planned for 1 step but expecting step 1 when 'end()' is called`)
})
