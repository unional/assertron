import test from 'ava'
import * as utils from './testUtils'
import AssertOrder from './index'

test('different starting index', _t => {
  let a = new AssertOrder(0, 1)
  a.runStepOnce(1)
  a.runStepOnce(2)

  a = new AssertOrder(0, -1)
  a.runStepOnce(-1)
  a.runStepOnce(0)
  a.runStepOnce(1)

  a = new AssertOrder(0, 5)
  a.runStepOnce(5)
  a.runStepOnce(6)
})

test('runStepOnce()', t => {
  let a = new AssertOrder()
  a.runStepOnce(0)
  t.is(a.next, 1)
  a.runStepOnce(1)
  t.is(a.next, 2)
  a.runStepOnce(2)
  t.is(a.next, 3)
  a.runStepOnce(3)
  t.is(a.next, 4)

  a = new AssertOrder()
  t.throws(() => a.runStepOnce(1), "Expecting 'runStepOnce(0)', 'step(0)', 'runStepAtLeastOnce(0)', 'runStepFor(0)', 'multiple(0)', but received 'runStepOnce(1)'")

  a = new AssertOrder()
  a.runStepOnce(0)
  t.throws(() => a.runStepOnce(2), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'runStepOnce(2)'")

  a = new AssertOrder()
  a.runStepOnce(0)
  t.throws(() => a.runStepOnce(0), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'runStepOnce(0)'")
})

test('runStepOnce() async', async t => {
  let a = new AssertOrder()
  await utils.runAsync(() => a.runStepOnce(0))
  t.is(a.next, 1)
  await utils.runAsync(() => a.runStepOnce(1))
  t.is(a.next, 2)
  await utils.runAsync(() => a.runStepOnce(2))
  t.is(a.next, 3)
  await utils.runAsync(() => a.runStepOnce(3))
  t.is(a.next, 4)

  a = new AssertOrder()
  await t.throws(utils.runAsync(() => a.runStepOnce(1)), "Expecting 'runStepOnce(0)', 'step(0)', 'runStepAtLeastOnce(0)', 'runStepFor(0)', 'multiple(0)', but received 'runStepOnce(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.runStepOnce(0))
  await t.throws(utils.runAsync(() => a.runStepOnce(2)), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'runStepOnce(2)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.runStepOnce(0))
  await t.throws(utils.runAsync(() => a.runStepOnce(0)), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'runStepOnce(0)'")
})

test('step()', t => {
  let a = new AssertOrder()
  a.step(0)
  a.step(1)
  a.step(2)
  a.step(3)

  a = new AssertOrder()
  t.throws(() => a.step(1), "Expecting 'runStepOnce(0)', 'step(0)', 'runStepAtLeastOnce(0)', 'runStepFor(0)', 'multiple(0)', but received 'step(1)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(2), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'step(2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(0), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'step(0)'")
})

test('step() async', async t => {
  let a = new AssertOrder()
  await utils.runSequentialAsync(
    () => a.step(0),
    () => a.step(1),
    () => a.step(2),
    () => a.step(3)
  )

  a = new AssertOrder()
  await t.throws(utils.runAsync(() => a.step(1)), "Expecting 'runStepOnce(0)', 'step(0)', 'runStepAtLeastOnce(0)', 'runStepFor(0)', 'multiple(0)', but received 'step(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await t.throws(utils.runAsync(() => a.step(2)), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'step(2)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await t.throws(utils.runAsync(() => a.step(0)), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'step(0)'")
})

test('any()', t => {
  let a = new AssertOrder()
  t.is(a.any(0, 1), 0)
  t.is(a.any(0, 1), 1)
  a.step(2)

  a = new AssertOrder()
  t.is(a.any(0, 2), 0)
  a.step(1)
  t.is(a.any(1, 2), 2)
  t.is(a.any(3, 4, 5), 3)
  t.is(a.any(4), 4)
  a.step(5)

  a = new AssertOrder()
  t.throws(() => a.any(1, 2), "Expecting 'runStepOnce(0)', 'step(0)', 'runStepAtLeastOnce(0)', 'runStepFor(0)', 'multiple(0)', but received 'any(1,2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.any(2), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'any(2)'")
})

test('any() async', async t => {
  let a = new AssertOrder()
  t.is(await utils.runAsync(() => a.any(0, 1)), 0)
  t.is(await utils.runAsync(() => a.any(0, 1)), 1)
  await utils.runAsync(() => a.step(2))

  a = new AssertOrder()
  t.is(await utils.runAsync(() => a.any(0, 2)), 0)
  await utils.runAsync(() => a.step(1))
  t.is(await utils.runAsync(() => a.any(1, 2)), 2)
  t.is(await utils.runAsync(() => a.any(3, 4, 5)), 3)
  t.is(await utils.runAsync(() => a.any(4)), 4)
  await utils.runAsync(() => a.step(5))

  a = new AssertOrder()
  t.throws(utils.runAsync(() => a.any(1, 2)), "Expecting 'runStepOnce(0)', 'step(0)', 'runStepAtLeastOnce(0)', 'runStepFor(0)', 'multiple(0)', but received 'any(1,2)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await t.throws(utils.runAsync(() => a.any(2)), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'any(2)'")
})

test('runStepAtLeastOnce()', t => {
  let a = new AssertOrder()
  a.step(0)
  t.is(a.next, 1)
  a.runStepAtLeastOnce(1)
  t.is(a.next, 2)
  a.runStepAtLeastOnce(1)
  t.is(a.next, 2)
  a.step(2)
  t.is(a.next, 3)

  a = new AssertOrder()
  a.runStepAtLeastOnce(0)
  a.runStepAtLeastOnce(0)
  a.step(1)
  t.throws(() => a.runStepAtLeastOnce(1), "Expecting 'runStepOnce(2)', 'step(2)', 'runStepAtLeastOnce(2)', 'runStepFor(2)', 'multiple(2)', but received 'runStepAtLeastOnce(1)'")

  a = new AssertOrder()
  t.is(a.runStepAtLeastOnce(0), 1)
  t.is(a.runStepAtLeastOnce(0), 2)
  t.is(a.runStepAtLeastOnce(1), 1)
  t.is(a.runStepAtLeastOnce(1), 2)
  t.is(a.runStepAtLeastOnce(2), 1)
  t.is(a.runStepAtLeastOnce(2), 2)

  a = new AssertOrder()
  a.runStepAtLeastOnce(0)
  a.runStepAtLeastOnce(0)
  a.runStepAtLeastOnce(1)
  t.throws(() => a.runStepAtLeastOnce(0), "Expecting 'runStepOnce(2)', 'step(2)', 'runStepAtLeastOnce(1|2)', 'runStepFor(2)', 'multiple(2)', but received 'runStepAtLeastOnce(0)'")

  a = new AssertOrder()
  t.throws(() => a.runStepAtLeastOnce(1), "Expecting 'runStepOnce(0)', 'step(0)', 'runStepAtLeastOnce(0)', 'runStepFor(0)', 'multiple(0)', but received 'runStepAtLeastOnce(1)'")

  a = new AssertOrder()
  a.runStepAtLeastOnce(0)
  t.throws(() => a.runStepAtLeastOnce(2), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(0|1)', 'runStepFor(1)', 'multiple(1)', but received 'runStepAtLeastOnce(2)'")
})

test('runStepAtLeastOnce() async', async t => {
  let a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  t.is(a.next, 1)
  await utils.runAsync(() => a.runStepAtLeastOnce(1))
  t.is(a.next, 2)
  await utils.runAsync(() => a.runStepAtLeastOnce(1))
  t.is(a.next, 2)
  await utils.runAsync(() => a.step(2))
  t.is(a.next, 3)

  a = new AssertOrder()
  await utils.runSequentialAsync(() => a.runStepAtLeastOnce(0), () => a.runStepAtLeastOnce(0), () => a.step(1))
  await t.throws(utils.runAsync(() => a.runStepAtLeastOnce(1)), "Expecting 'runStepOnce(2)', 'step(2)', 'runStepAtLeastOnce(2)', 'runStepFor(2)', 'multiple(2)', but received 'runStepAtLeastOnce(1)'")

  a = new AssertOrder()
  t.is(await utils.runAsync(() => a.runStepAtLeastOnce(0)), 1)
  t.is(await utils.runAsync(() => a.runStepAtLeastOnce(0)), 2)
  t.is(await utils.runAsync(() => a.runStepAtLeastOnce(1)), 1)
  t.is(await utils.runAsync(() => a.runStepAtLeastOnce(1)), 2)
  t.is(await utils.runAsync(() => a.runStepAtLeastOnce(2)), 1)
  t.is(await utils.runAsync(() => a.runStepAtLeastOnce(2)), 2)

  a = new AssertOrder()
  await utils.runParallelAsync(() => a.runStepAtLeastOnce(0), () => a.runStepAtLeastOnce(0))
  await utils.runAsync(() => a.runStepAtLeastOnce(1))
  await t.throws(utils.runAsync(() => a.runStepAtLeastOnce(0)), "Expecting 'runStepOnce(2)', 'step(2)', 'runStepAtLeastOnce(1|2)', 'runStepFor(2)', 'multiple(2)', but received 'runStepAtLeastOnce(0)'")

  a = new AssertOrder()
  await t.throws(utils.runAsync(() => a.runStepAtLeastOnce(1)), "Expecting 'runStepOnce(0)', 'step(0)', 'runStepAtLeastOnce(0)', 'runStepFor(0)', 'multiple(0)', but received 'runStepAtLeastOnce(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.runStepAtLeastOnce(0))
  await t.throws(utils.runAsync(() => a.runStepAtLeastOnce(2)), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(0|1)', 'runStepFor(1)', 'multiple(1)', but received 'runStepAtLeastOnce(2)'")

  a = new AssertOrder()
  await t.throws(utils.runSequentialAsync(() => a.runStepAtLeastOnce(0), () => a.runStepAtLeastOnce(2)), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(0|1)', 'runStepFor(1)', 'multiple(1)', but received 'runStepAtLeastOnce(2)'")
})

test('runStepFor()', t => {
  let a = new AssertOrder()
  t.is(a.runStepFor(0, 2), 1)
  t.is(a.next, 0)
  t.is(a.runStepFor(0, 2), 2)
  t.is(a.next, 1)
  a.step(1)
  t.is(a.next, 2)

  a = new AssertOrder()
  t.throws(() => a.runStepFor(0, 0), "0 is not a valid 'plan' value.")
  t.throws(() => a.runStepFor(0, -1), "-1 is not a valid 'plan' value.")

  a = new AssertOrder()
  a.step(0)
  a.runStepAtLeastOnce(1)
  t.throws(() => a.runStepFor(1, 1), "Expecting 'runStepOnce(2)', 'step(2)', 'runStepAtLeastOnce(1|2)', 'runStepFor(2)', 'multiple(2)', but received 'runStepFor(1)'")

  a = new AssertOrder()
  a.step(0)
  a.runStepFor(1, 2)
  t.throws(() => a.runStepAtLeastOnce(1), "Expecting 'runStepFor(1)', 'multiple(1)', but received 'runStepAtLeastOnce(1)'")

  a = new AssertOrder()
  a.runStepFor(0, 2)
  a.runStepFor(0, 2)
  t.throws(() => a.runStepFor(0, 2), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'runStepFor(0)'")

  a = new AssertOrder()
  a.runStepFor(0, 2)
  t.throws(() => a.runStepFor(0, 3), 'The plan count (3) does not match with previous value (2).')

  a = new AssertOrder()
  t.is(a.runStepFor(0, 1), 1)
  a.step(1)
  t.is(a.runStepFor(2, 2), 1)
  t.is(a.runStepFor(2, 2), 2)
  a.step(3)
})

test('runStepFor() async', async t => {
  let a = new AssertOrder()
  t.is(await utils.runAsync(() => a.runStepFor(0, 2)), 1)
  t.is(a.next, 0)
  t.is(await utils.runAsync(() => a.runStepFor(0, 2)), 2)
  t.is(a.next, 1)
  await utils.runAsync(() => a.step(1))
  t.is(a.next, 2)

  a = new AssertOrder()
  await t.throws(utils.runAsync(() => a.runStepFor(0, 0)), "0 is not a valid 'plan' value.")
  await t.throws(utils.runAsync(() => a.runStepFor(0, -1)), "-1 is not a valid 'plan' value.")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await utils.runAsync(() => a.runStepAtLeastOnce(1))
  await t.throws(utils.runAsync(() => a.runStepFor(1, 1)), "Expecting 'runStepOnce(2)', 'step(2)', 'runStepAtLeastOnce(1|2)', 'runStepFor(2)', 'multiple(2)', but received 'runStepFor(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await utils.runAsync(() => a.runStepFor(1, 2))
  await t.throws(utils.runAsync(() => a.runStepAtLeastOnce(1)), "Expecting 'runStepFor(1)', 'multiple(1)', but received 'runStepAtLeastOnce(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.runStepFor(0, 2))
  await utils.runAsync(() => a.runStepFor(0, 2))
  await t.throws(utils.runAsync(() => a.runStepFor(0, 2)), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'runStepFor(0)'")

  a = new AssertOrder()
  await t.throws(
    utils.runParallelAsync(() => a.runStepFor(0, 2), () => a.runStepFor(0, 2), () => a.runStepFor(0, 2)),
    "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'runStepFor(0)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.runStepFor(0, 2))
  await t.throws(utils.runAsync(() => a.runStepFor(0, 3)), 'The plan count (3) does not match with previous value (2).')

  a = new AssertOrder()
  await t.is(await utils.runAsync(() => a.runStepFor(0, 1)), 1)
  await utils.runAsync(() => a.step(1))
  await t.is(await utils.runAsync(() => a.runStepFor(2, 2)), 1)
  await t.is(await utils.runAsync(() => a.runStepFor(2, 2)), 2)
  await utils.runAsync(() => a.step(3))
})

test('multiple()', t => {
  let a = new AssertOrder()
  t.is(a.multiple(0, 2), 1)
  t.is(a.next, 0)
  t.is(a.multiple(0, 2), 2)
  t.is(a.next, 1)
  a.step(1)
  t.is(a.next, 2)

  a = new AssertOrder()
  t.throws(() => a.multiple(0, 0), "0 is not a valid 'plan' value.")
  t.throws(() => a.multiple(0, -1), "-1 is not a valid 'plan' value.")

  a = new AssertOrder()
  a.step(0)
  a.runStepAtLeastOnce(1)
  t.throws(() => a.multiple(1, 1), "Expecting 'runStepOnce(2)', 'step(2)', 'runStepAtLeastOnce(1|2)', 'runStepFor(2)', 'multiple(2)', but received 'multiple(1)'")

  a = new AssertOrder()
  a.step(0)
  a.multiple(1, 2)
  t.throws(() => a.runStepAtLeastOnce(1), "Expecting 'runStepFor(1)', 'multiple(1)', but received 'runStepAtLeastOnce(1)'")

  a = new AssertOrder()
  a.multiple(0, 2)
  a.multiple(0, 2)
  t.throws(() => a.multiple(0, 2), "Expecting 'runStepOnce(1)', 'step(1)', 'runStepAtLeastOnce(1)', 'runStepFor(1)', 'multiple(1)', but received 'multiple(0)'")

  a = new AssertOrder()
  a.multiple(0, 2)
  t.throws(() => a.multiple(0, 3), 'The plan count (3) does not match with previous value (2).')

  a = new AssertOrder()
  t.is(a.multiple(0, 1), 1)
  a.step(1)
  t.is(a.multiple(2, 2), 1)
  t.is(a.multiple(2, 2), 2)
  a.step(3)
})

test('end()', t => {
  let a = new AssertOrder()
  a.end()

  a = new AssertOrder(1)
  t.throws(() => a.end(), `Planned 1 steps but executed 0 steps`)

  a = new AssertOrder(1)
  a.step(0)
  a.end()

  a = new AssertOrder(3)
  a.runStepOnce(0)
  t.is(a.runStepAtLeastOnce(1), 1)
  t.is(a.runStepAtLeastOnce(1), 2)
  t.is(a.runStepFor(2, 2), 1)
  t.throws(() => a.end(), `Planned 3 steps but executed 2 steps`)
  t.is(a.runStepFor(2, 2), 2)
  a.end()

  a = new AssertOrder(1)
  setTimeout(() => {
    a.runStepOnce(0)
  }, 10)
  return a.end(50)
})

test(`end() reject`, t => {
  const a = new AssertOrder(2)
  setTimeout(() => {
    a.runStepOnce(0)
  }, 50)
  return a.end(1).then(() => t.fail('should fail'), () => t.pass('should fail'))
})
