import test from 'ava'
import { AssertOrder } from './index'

test('error message for once()', t => {
  const o = new AssertOrder()
  const err = t.throws(() => o.once(2))
  t.is(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'once(2)'`)
})

test('error message for multi-step methods', t => {
  const o = new AssertOrder()
  o.exactly(1, 2)
  const err = t.throws(() => o.once(2))
  t.is(err.message, `Expecting 'exactly(1, 2)', but received 'once(2)'`)
})

test('error message for exactly() called too many times', t => {
  const o = new AssertOrder()
  o.exactly(1, 2)
  o.exactly(1, 2)
  const err = t.throws(() => o.exactly(1, 2))
  t.is(err.message, `Expecting 'is(2)', 'once(2)', 'any([2])', but received 'exactly(1, 2)'`)
})


test('error message for is()', t => {
  const order = new AssertOrder()
  const err = t.throws(() => order.is(0))
  t.is(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'is(0)'`)
})


test(`error message for not()`, t => {
  const order = new AssertOrder()
  const err = t.throws(() => order.not(1))
  t.is(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'not(1)'`)
})

test('error message for atLeastOnce()', t => {
  const order = new AssertOrder()
  order.once(1)
  const err = t.throws(() => order.atLeastOnce(1))
  t.is(err.message, `Expecting 'is(2)', 'once(2)', 'any([2])', but received 'atLeastOnce(1)'`)
})

test('error message for any()', t => {
  const order = new AssertOrder()

  let err = t.throws(() => order.any([2]))
  t.is(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'any([2])'`)

  err = t.throws(() => order.any([2, 3]))
  t.is(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'any([2, 3])'`)
})

test('error message for end()', t => {
  const order = new AssertOrder(1)

  const err = t.throws(() => order.end())
  t.is(err.message, `Expecting 'is(1)', 'once(1)', 'any([1])', but received 'end()'`)
})
