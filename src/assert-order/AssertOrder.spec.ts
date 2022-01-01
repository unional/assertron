import t from 'assert';
import a, { AssertOrder, InvalidOrder, State } from '..';

test('is() expecting 1', () => {
  const order = new AssertOrder()
  order.is(1)
})

test('is() does not move the order forward', () => {
  const order = new AssertOrder()
  order.is(1)
  order.is(1)
})

test('is() with wrong step should throw', async () => {
  const order = new AssertOrder()
  await assertOrderThrows(() => order.is(0), { step: 1 }, 'is', 0)
})

test(`not() with right step should throw`, async () => {
  const order = new AssertOrder()

  await assertOrderThrows(() => order.not(1), { step: 1 }, 'not', 1)
})

test('not() with wrong step should pass', () => {
  const order = new AssertOrder()
  order.not(0)
  order.not(2)
})

test('move() to move to next step', () => {
  const order = new AssertOrder()
  order.move()
  order.is(2)
})

test('move(n) moves to step n', () => {
  const order = new AssertOrder()
  order.jump(3)
  order.is(3)
})

test('move(0) or negative also works', () => {
  const order = new AssertOrder()
  order.jump(0)
  order.is(0)

  order.jump(-2)
  order.is(-2)

  order.move()
  order.is(-1)
})

test('once() move to next step', () => {
  const order = new AssertOrder()
  order.once(1)
  order.is(2)
})

test('once() assert for current step', async () => {
  const order = new AssertOrder()

  await assertOrderThrows(() => order.once(0), { step: 1 }, 'once', 0)
})

test('on(1) will invoke at initial move', () => {
  const order = new AssertOrder()
  let called = false
  order.on(1, () => called = true)

  order.move()

  t.strictEqual(called, true)
})

test('jump(n) will not invoke on(y)', () => {
  const order = new AssertOrder()
  let called = false
  order.on(1, () => called = true)

  order.jump(1)
  t(!called)
})

test('on(0) will be invoked on jump(0) + move()', () => {
  const order = new AssertOrder()
  let called = false
  order.on(0, () => called = true)

  order.jump(0)
  order.move()
  t(called)
})

test('on(1) will be invoked on move()', () => {
  const order = new AssertOrder()
  let called = false
  order.on(1, () => called = true)

  order.move()
  t(called)
})

test('on(1) will be invoke on once(1)', () => {
  const order = new AssertOrder()
  let called = false
  order.on(1, () => called = true)

  order.once(1)
  t(called)
})

test('atLeastOnce(1) would move step forward', () => {
  const order = new AssertOrder()
  order.atLeastOnce(1)
  order.once(2)
})

test('atLeastOnce(1) can called multiple times', () => {
  const order = new AssertOrder()
  order.once(1)
  order.atLeastOnce(2)
  order.atLeastOnce(2)
  order.once(3)
  t.strictEqual(order.currentStep, 4)
})

test('atLeastOnce(1) should throws after once(1)', async () => {
  const order = new AssertOrder()
  order.once(1)
  await assertOrderThrows(() => order.atLeastOnce(1), { step: 2 }, 'atLeastOnce', 1)
})

test('atLeastOnce() returns sub step', () => {
  const order = new AssertOrder()
  t.strictEqual(order.atLeastOnce(1), 1)
  t.strictEqual(order.atLeastOnce(1), 2)
  t.strictEqual(order.atLeastOnce(2), 1)
  t.strictEqual(order.atLeastOnce(2), 2)
  t.strictEqual(order.atLeastOnce(3), 1)
  t.strictEqual(order.atLeastOnce(3), 2)
})

test.skip(`atLeast(n, m) where m <= 0 doesn't make sense`, () => { })
test.skip(`atLeast(n, 2) pass`, () => { })
test.skip(`atLeast(n, 2) fail`, () => { })

test('any(2) should throws', async () => {
  const order = new AssertOrder()

  await assertOrderThrows(() => order.any([2]), { step: 1 }, 'any', [2])
})

test('any(2, 3) should throws', async () => {
  const order = new AssertOrder()

  await assertOrderThrows(() => order.any([2, 3]), { step: 1 }, 'any', [2, 3])
})

test('any(1) should move to next step', () => {
  const order = new AssertOrder()

  order.any([1])

  order.once(2)
})

test('any(1, 2) should pass with once(1) and move to step 3', () => {
  const order = new AssertOrder()
  order.once(1)

  order.any([1, 2])

  order.once(3)
})

test(`any() should returns the step it encountered`, () => {
  const order = new AssertOrder()

  t.strictEqual(order.any([1, 2, 3]), 1)
  t.strictEqual(order.any([1, 2, 3]), 2)
  t.strictEqual(order.any([1, 2, 3]), 3)
})

test(`onAny(1, fn) will not be invoked immediately`, () => {
  const order = new AssertOrder()

  order.onAny([1], () => t.fail('should be be invoked'))
})

test(`onAny(2, fn) invokes after move()`, () => {
  const order = new AssertOrder()

  order.onAny([2], step => t.strictEqual(step, 2))
  order.move()
})

test(`onAny() should not move step`, () => {
  const order = new AssertOrder()
  const o = new AssertOrder()

  order.onAny([1], step => {
    t.strictEqual(step, 1)
    o.once(2)
  })
  o.once(1)
  order.move()

  order.is(2)
  o.once(3)
})

test(`onAny([2,3], fn) invoke with the specific step`, () => {
  const order = new AssertOrder()

  const steps: number[] = []
  order.onAny([1, 2], step => steps.push(step))

  order.move()
  order.move()
  t.deepStrictEqual(steps, [1, 2])
})

test('onAny() passes if one of the assert functions passes ', () => {
  const a = new AssertOrder(2)
  let steps = ''
  a.onAny([1, 2], step => {
    steps += step
    t([1, 2].indexOf(step) >= 0)
    throw new Error('some error')
  }, step => {
    steps += step
    t([1, 2].indexOf(step) >= 0)
  })
  a.move()
  a.move()

  t.strictEqual(steps, '1122')
})

test(`onAny() throws if all assert functions throws`, () => {
  const o = new AssertOrder(2)
  o.onAny([1], () => {
    throw new Error('first error')
  }, () => {
    throw new Error('second error')
  })
  const err = a.throws(() => o.move())
  t.strictEqual(err.message, 'first error')
})

test('AssertOrder(0) accepts no step >= 1', () => {
  const order = new AssertOrder(0)

  const err = a.throws(() => order.once(1), InvalidOrder)

  t.strictEqual(err.state.maxStep, 0)
})

test('AssertOrder(1) accepts step 1 but not 2', () => {
  const order = new AssertOrder(1)

  order.once(1)

  const err = a.throws(() => order.once(2), InvalidOrder)

  t.strictEqual(err.state.maxStep, 1)
})

test('AssertOrder(0) can use jump(...)', () => {
  const order = new AssertOrder(0)

  order.jump(0)
  order.once(0)
})

test('end() should not throw if plan is not defined', () => {
  const order = new AssertOrder()
  order.end()
})

test('end() would mark to not accepting more steps if plan is not defined', () => {
  let order = new AssertOrder()
  order.end()

  let err = a.throws(() => order.once(1), InvalidOrder)

  t.strictEqual(err.state.maxStep, 0)

  order = new AssertOrder()
  order.once(1)
  order.end()

  err = a.throws(() => order.once(2), InvalidOrder)

  t.strictEqual(err.state.maxStep, 1)
})

test('end() passes with meeting planned step', () => {
  const order = new AssertOrder(1)
  order.once(1)

  order.end()
})

test('end() throws if planned step not met', () => {
  const order = new AssertOrder(2)
  order.once(1)

  const err = a.throws(() => order.end(), InvalidOrder)

  t.strictEqual(err.state.maxStep, 2)
})

test('end(n) waits n milliseconds before checking', async () => {
  const order = new AssertOrder(1)

  setTimeout(() => {
    order.once(1)
  }, 1)

  await order.end(2)
})

test('end(n) waits n milliseconds and fail when step not met', async () => {
  const order = new AssertOrder(1)

  setTimeout(() => {
    order.once(1)
  }, 10)
  const err = await a.throws(order.end(1), InvalidOrder)

  t.strictEqual(err.state.maxStep, 1)
})

test.skip(`exactly(n, 0) doesn't make sense`, () => { })

test(`exactly(n, 1) is the same as once(n)`, () => {
  const order = new AssertOrder()
  order.exactly(1, 1)
  order.once(2)
})

test(`exactly(n, 2) moves to next step at sub step 2`, () => {
  const order = new AssertOrder()
  order.exactly(1, 2)
  order.exactly(1, 2)
  order.once(2)
})

test(`exactly() returns the sub step`, () => {
  const order = new AssertOrder()
  t.strictEqual(order.exactly(1, 2), 1)
  t.strictEqual(order.exactly(1, 2), 2)
})

test('jump(0) restore 0 based step AssertOrder', () => {
  const order = new AssertOrder()
  order.jump(0)
  order.once(0)
  order.once(1)
})

test('end() returns time taken', () => {
  const order = new AssertOrder()
  let i = 10000
  while (i) i--
  t(order.end() > 0)
})

test('end(number) returns promise with time taken', async () => {
  const order = new AssertOrder()
  let i = 10000
  while (i) i--
  t(await order.end(1) > 0)
})

test('calling end() with planned step met will pass', () => {
  const order = new AssertOrder(1)
  order.once(1)
  order.end()
})

test('calling end() early will throw', () => {
  const order = new AssertOrder(2)
  order.once(1)
  a.throws(() => order.end())
})

test('calling end() without planned step will pass', () => {
  const order = new AssertOrder()
  order.end()
})

test('wait(step) will wait for specific step to happen', async () => {
  const order = new AssertOrder()

  setImmediate(() => {
    order.once(1)
  })
  await order.wait(1)
  t.strictEqual(order.currentStep, 2)
})

test('wait(step, callback) will execute the callback and return void', async () => {
  const order = new AssertOrder(2)

  order.wait(1, () => {
    order.once(2)
  })
  order.once(1)

  return order.end(100)
})

test('wait(step, callback) will execute the async callback but not wait for it and return void', async () => {
  const order = new AssertOrder(1)
  const o2 = new AssertOrder(1)

  order.wait(1, () => {
    return new Promise<void>(a => {
      setImmediate(() => {
        o2.once(1)
        a()
      })
    })
  })
  order.once(1)

  order.end()
  return o2.end(100)
})

async function assertOrderThrows(fn: () => any, state: Partial<State>, method: string, ...args: any[]) {
  const err = await a.throws(fn, InvalidOrder)
  t.strictEqual(err.method, method)
  t.deepStrictEqual(err.args, args)
  if (state.step) {
    t.strictEqual(err.state.step, state.step)
  }
  if (state.subStep) {
    t.strictEqual(err.state.subStep, state.subStep)
  }
}
