
import test from 'ava'

import { AssertOrder, AssertError, State } from './index'

function assertThrows(t, fn, state: Partial<State>, method, ...args) {
  const err = t.throws(fn) as AssertError
  t.is(err.method, method)
  t.deepEqual(err.args, args)
  if (state.step) {
    t.is(err.state.step, state.step)
  }
  if (state.subStep) {
    t.is(err.state.subStep, state.subStep)
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
  assertThrows(t, () => order.is(0), { step: 1 }, 'is', 0)
})

test(`not() with right step should throw`, t => {
  const order = new AssertOrder()

  assertThrows(t, () => order.not(1), { step: 1 }, 'not', 1)
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

  assertThrows(t, () => order.once(0), { step: 1 }, 'once', 0)
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

  order.move(1)
})

test('on(1) will be invoked on move(0) + move()', t => {
  const order = new AssertOrder()
  order.on(1, () => t.pass())

  order.move(0)
  order.move()
})

test('on(2) will be invoked on move()', t => {
  const order = new AssertOrder()
  order.on(2, () => t.pass())

  order.move()
})

test('on(2) will be invoke on once(1)', t => {
  const order = new AssertOrder()
  order.on(2, () => t.pass())
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
  assertThrows(t, () => order.atLeastOnce(1), { step: 2 }, 'atLeastOnce', 1)
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

test.todo(`atLeast(n, m) where m <= 0 doesn't make sense`)
test.todo(`atLeast(n, 2) pass`)
test.todo(`atLeast(n, 2) fail`)

test('any(2) should throws', t => {
  const order = new AssertOrder()

  assertThrows(t, () => order.any([2]), { step: 1 }, 'any', [2])
})

test('any(2, 3) should throws', t => {
  const order = new AssertOrder()

  assertThrows(t, () => order.any([2, 3]), { step: 1 }, 'any', [2, 3])
})

test('any(1) should move to next step', t => {
  const order = new AssertOrder()

  order.any([1])

  order.once(2)
  t.pass()
})

test('any(1, 2) should pass with once(1) and move to step 3', t => {
  const order = new AssertOrder()
  order.once(1)

  order.any([1, 2])

  order.once(3)
  t.pass()
})

test(`any() should returns the step it encountered`, t => {
  const order = new AssertOrder()

  t.is(order.any([1, 2, 3]), 1)
  t.is(order.any([1, 2, 3]), 2)
  t.is(order.any([1, 2, 3]), 3)
})

test(`onAny(1, fn) will not be invoked immediately`, t => {
  const order = new AssertOrder()

  order.onAny([1], () => t.fail('should be be invoked'))
  t.pass()
})

test(`onAny(2, fn) invokes after move()`, t => {
  const order = new AssertOrder()

  order.onAny([2], step => t.is(step, 2))
  order.move()
})

test(`onAny() should not move step`, t => {
  const order = new AssertOrder()
  const o = new AssertOrder()

  order.onAny([2], step => {
    t.is(step, 2)
    o.once(2)
  })
  o.once(1)
  order.move()

  order.is(2)
  o.once(3)
})

test(`onAny([2,3], fn) invoke with the specific step`, t => {
  const order = new AssertOrder()

  t.plan(2)
  order.onAny([2, 3], step => t.true(step === 2 || step === 3))

  order.move()
  order.move()
})

test('onAny() passes if one of the assert functions passes ', t => {
  const a = new AssertOrder(2)
  let steps = ''
  a.onAny([2, 3], step => {
    steps += step
    t.true([2, 3].indexOf(step) >= 0)
    throw new Error('some error')
  }, step => {
    steps += step
    t.true([2, 3].indexOf(step) >= 0)
  })
  a.move()
  a.move()

  t.is(steps, '2233')
})

test(`onAny() throws if all assert functions throws`, t => {
  const a = new AssertOrder(2)
  a.onAny([2], () => {
    throw new Error('first error')
  }, () => {
    throw new Error('second error')
  })
  const err = t.throws(() => a.move())
  t.is(err.message, 'first error')
})

test('AssertOrder(0) accepts no step >= 1', t => {
  const order = new AssertOrder(0)

  const err = t.throws(() => order.once(1)) as AssertError

  t.is(err.state.maxStep, 0)
})

test('AssertOrder(1) accepts step 1 but not 2', t => {
  const order = new AssertOrder(1)

  order.once(1)

  const err = t.throws(() => order.once(2)) as AssertError

  t.is(err.state.maxStep, 1)
})

test('AssertOrder(0) can use move(...)', t => {
  const order = new AssertOrder(0)

  order.move(0)
  order.once(0)
  t.pass()
})

test('end() should not throw if plan is not defined', t => {
  const order = new AssertOrder()
  order.end()
  t.pass()
})

test('end() would mark to not accepting more steps if plan is not defined', t => {
  let order = new AssertOrder()
  order.end()

  let err = t.throws(() => order.once(1)) as AssertError

  t.is(err.state.maxStep, 0)

  order = new AssertOrder()
  order.once(1)
  order.end()

  err = t.throws(() => order.once(2)) as AssertError

  t.is(err.state.maxStep, 1)
})

test('end() passes with meeting planned step', t => {
  const order = new AssertOrder(1)
  order.once(1)

  order.end()
  t.pass()
})

test('end() throws if planned step not met', t => {
  const order = new AssertOrder(2)
  order.once(1)

  const err = t.throws(() => order.end()) as AssertError

  t.is(err.state.maxStep, 2)
})

test('end(n) waits n milliseconds before checking', async t => {
  const order = new AssertOrder(1)

  setTimeout(() => {
    order.once(1)
  }, 1)

  await order.end(2)
  t.pass()
})

test('end(n) waits n milliseconds and fail when step not met', async t => {
  const order = new AssertOrder(1)

  setTimeout(() => {
    order.once(1)
  }, 10)
  const err: AssertError = await t.throws(order.end(1))

  t.is(err.state.maxStep, 1)
})
test.todo(`exactly(n, 0) doesn't make sense`)

test(`exactly(n, 1) is the same as once(n)`, t => {
  const order = new AssertOrder()
  order.exactly(1, 1)
  order.once(2)
  t.pass()
})

test(`exactly(n, 2) moves to next step at sub step 2`, t => {
  const order = new AssertOrder()
  order.exactly(1, 2)
  order.exactly(1, 2)
  order.once(2)
  t.pass()
})

test(`exactly() returns the sub step`, t => {
  const order = new AssertOrder()
  t.is(order.exactly(1, 2), 1)
  t.is(order.exactly(1, 2), 2)
})

test('move(0) restore 0 based step AssertOrder', t => {
  const order = new AssertOrder()
  order.move(0)
  order.once(0)
  order.once(1)
  t.pass()
})
