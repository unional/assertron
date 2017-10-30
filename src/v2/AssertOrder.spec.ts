
import test from 'ava'

import { AssertOrder, AssertError, State } from './AssertOrder'

function assertThrows(t, fn, method, value, state: Partial<State>) {
  const err = t.throws(fn) as AssertError
  value = Array.isArray(value) ? value : [value]
  t.is(err.method, method)
  t.deepEqual(err.steps, value)
  if (state.step) {
    t.is(err.expecting.step, state.step)
  }
  if (state.subStep) {
    t.is(err.expecting.subStep, state.subStep)
  }
}

test('is() expecting 1', t => {
  const order = new AssertOrder()
  order.is(1)
  t.pass()
})

test('is() does not move the order forward', t => {
  const order = new AssertOrder()
  order.is(1)
  order.is(1)
  t.pass()
})

test('is() with wrong step should throw', t => {
  const order = new AssertOrder()
  assertThrows(t, () => order.is(0), 'is', 0, { step: 1 })
})

test(`not() with right step should throw`, t => {
  const order = new AssertOrder()

  assertThrows(t, () => order.not(1), 'not', 1, { step: 1 })
})

test('not() with wrong step should pass', t => {
  const order = new AssertOrder()
  order.not(0)
  order.not(2)
  t.pass()
})

test('move() to move to next step', t => {
  const order = new AssertOrder()
  order.move()
  order.is(2)
  t.pass()
})

test('move(n) moves to step n', t => {
  const order = new AssertOrder()
  order.move(3)
  order.is(3)
  t.pass()
})

test('move(0) or negative also works', t => {
  const order = new AssertOrder()
  order.move(0)
  order.is(0)

  order.move(-2)
  order.is(-2)

  order.move()
  order.is(-1)
  t.pass()
})

test('once() move to next step', t => {
  const order = new AssertOrder()
  order.once(1)
  order.is(2)
  t.pass()
})

test('once() assert for current step', t => {
  const order = new AssertOrder()

  assertThrows(t, () => order.once(0), 'once', 0, { step: 1 })
})

test('on(1) will have no effect', t => {
  const order = new AssertOrder()
  order.on(1, () => t.fail('should not be called'))

  order.move()

  t.pass()
})

test('on(1) will be invoked on move(1)', t => {
  const order = new AssertOrder()
  order.on(1, () => t.pass())
  t.plan(1)

  order.move(1)
})

test('on(1) will be invoked on move(0) + move()', t => {
  const order = new AssertOrder()
  order.on(1, () => t.pass())
  t.plan(1)

  order.move(0)
  order.move()
})

test('on(2) will be invoked on move()', t => {
  const order = new AssertOrder()
  order.on(2, () => t.pass())
  t.plan(1)

  order.move()
})

test('on(2) will be invoke on once(1)', t => {
  const order = new AssertOrder()
  order.on(2, () => t.pass())
  t.plan(1)
  order.once(1)
})

test('atLeastOnce(1) would move step forward', t => {
  const order = new AssertOrder()
  order.atLeastOnce(1)
  order.once(2)
  t.pass()
})

test('atLeastOnce(1) can called multiple times', t => {
  const order = new AssertOrder()
  order.once(1)
  order.atLeastOnce(2)
  order.atLeastOnce(2)
  order.once(3)
  t.is(order.currentStep, 4)
})

test('atLeastOnce(1) should throws after once(1)', t => {
  const order = new AssertOrder()
  order.once(1)
  assertThrows(t, () => order.atLeastOnce(1), 'atLeastOnce', 1, { step: 2 })
})

test('atLeastOnce() returns sub step', t => {
  const order = new AssertOrder()
  t.is(order.atLeastOnce(1), 1)
  t.is(order.atLeastOnce(1), 2)
  t.is(order.atLeastOnce(2), 1)
  t.is(order.atLeastOnce(2), 2)
  t.is(order.atLeastOnce(3), 1)
  t.is(order.atLeastOnce(3), 2)
})

test('any(2) should throws', t => {
  const order = new AssertOrder()

  assertThrows(t, () => order.any(2), 'any', [2], { step: 1 })
})

test('any(2, 3) should throws', t => {
  const order = new AssertOrder()

  assertThrows(t, () => order.any(2, 3), 'any', [2, 3], { step: 1 })
})

test('any(1) should move to next step', t => {
  const order = new AssertOrder()

  order.any(1)

  order.once(2)
  t.pass()
})

test('any(1, 2) should pass with once(1) and move to step 3', t => {
  const order = new AssertOrder()
  order.once(1)

  order.any(1, 2)

  order.once(3)
  t.pass()
})

test(`any() should returns the step it encountered`, t => {
  const order = new AssertOrder()

  t.is(order.any(1, 2, 3), 1)
  t.is(order.any(1, 2, 3), 2)
  t.is(order.any(1, 2, 3), 3)
})

test(`onAny(1, fn) will not be invoked`, t => {
  const order = new AssertOrder()

  order.onAny(1)
})