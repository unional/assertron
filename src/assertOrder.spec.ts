import test from 'ava'
import * as utils from './testUtils'
import AssertOrder from './index'

test('different starting index', _t => {
  let a = new AssertOrder(0, 1)
  a.assertStepOnce(1)
  a.assertStepOnce(2)

  a = new AssertOrder(0, -1)
  a.assertStepOnce(-1)
  a.assertStepOnce(0)
  a.assertStepOnce(1)

  a = new AssertOrder(0, 5)
  a.assertStepOnce(5)
  a.assertStepOnce(6)
})

test('assertStepOnce()', t => {
  let a = new AssertOrder()
  a.assertStepOnce(0)
  t.is(a.next, 1)
  a.assertStepOnce(1)
  t.is(a.next, 2)
  a.assertStepOnce(2)
  t.is(a.next, 3)
  a.assertStepOnce(3)
  t.is(a.next, 4)

  a = new AssertOrder()
  t.throws(() => a.assertStepOnce(1), "Expecting 'assertStepOnce(0)', 'step(0)', 'assertStepAtLeastOnce(0)', 'assertAllSteps(0)', 'multiple(0)', but received 'assertStepOnce(1)'")

  a = new AssertOrder()
  a.assertStepOnce(0)
  t.throws(() => a.assertStepOnce(2), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'assertStepOnce(2)'")

  a = new AssertOrder()
  a.assertStepOnce(0)
  t.throws(() => a.assertStepOnce(0), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'assertStepOnce(0)'")
})

test('assertStepOnce() async', async t => {
  let a = new AssertOrder()
  await utils.runAsync(() => a.assertStepOnce(0))
  t.is(a.next, 1)
  await utils.runAsync(() => a.assertStepOnce(1))
  t.is(a.next, 2)
  await utils.runAsync(() => a.assertStepOnce(2))
  t.is(a.next, 3)
  await utils.runAsync(() => a.assertStepOnce(3))
  t.is(a.next, 4)

  a = new AssertOrder()
  await t.throws(utils.runAsync(() => a.assertStepOnce(1)), "Expecting 'assertStepOnce(0)', 'step(0)', 'assertStepAtLeastOnce(0)', 'assertAllSteps(0)', 'multiple(0)', but received 'assertStepOnce(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.assertStepOnce(0))
  await t.throws(utils.runAsync(() => a.assertStepOnce(2)), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'assertStepOnce(2)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.assertStepOnce(0))
  await t.throws(utils.runAsync(() => a.assertStepOnce(0)), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'assertStepOnce(0)'")
})

test('step()', t => {
  let a = new AssertOrder()
  a.step(0)
  a.step(1)
  a.step(2)
  a.step(3)

  a = new AssertOrder()
  t.throws(() => a.step(1), "Expecting 'assertStepOnce(0)', 'step(0)', 'assertStepAtLeastOnce(0)', 'assertAllSteps(0)', 'multiple(0)', but received 'step(1)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(2), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'step(2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(0), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'step(0)'")
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
  await t.throws(utils.runAsync(() => a.step(1)), "Expecting 'assertStepOnce(0)', 'step(0)', 'assertStepAtLeastOnce(0)', 'assertAllSteps(0)', 'multiple(0)', but received 'step(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await t.throws(utils.runAsync(() => a.step(2)), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'step(2)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await t.throws(utils.runAsync(() => a.step(0)), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'step(0)'")
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
  t.throws(() => a.any(1, 2), "Expecting 'assertStepOnce(0)', 'step(0)', 'assertStepAtLeastOnce(0)', 'assertAllSteps(0)', 'multiple(0)', but received 'any(1,2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.any(2), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'any(2)'")
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
  t.throws(utils.runAsync(() => a.any(1, 2)), "Expecting 'assertStepOnce(0)', 'step(0)', 'assertStepAtLeastOnce(0)', 'assertAllSteps(0)', 'multiple(0)', but received 'any(1,2)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await t.throws(utils.runAsync(() => a.any(2)), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'any(2)'")
})

test('assertStepAtLeastOnce()', t => {
  let a = new AssertOrder()
  a.step(0)
  t.is(a.next, 1)
  a.assertStepAtLeastOnce(1)
  t.is(a.next, 2)
  a.assertStepAtLeastOnce(1)
  t.is(a.next, 2)
  a.step(2)
  t.is(a.next, 3)

  a = new AssertOrder()
  a.assertStepAtLeastOnce(0)
  a.assertStepAtLeastOnce(0)
  a.step(1)
  t.throws(() => a.assertStepAtLeastOnce(1), "Expecting 'assertStepOnce(2)', 'step(2)', 'assertStepAtLeastOnce(2)', 'assertAllSteps(2)', 'multiple(2)', but received 'assertStepAtLeastOnce(1)'")

  a = new AssertOrder()
  t.is(a.assertStepAtLeastOnce(0), 1)
  t.is(a.assertStepAtLeastOnce(0), 2)
  t.is(a.assertStepAtLeastOnce(1), 1)
  t.is(a.assertStepAtLeastOnce(1), 2)
  t.is(a.assertStepAtLeastOnce(2), 1)
  t.is(a.assertStepAtLeastOnce(2), 2)

  a = new AssertOrder()
  a.assertStepAtLeastOnce(0)
  a.assertStepAtLeastOnce(0)
  a.assertStepAtLeastOnce(1)
  t.throws(() => a.assertStepAtLeastOnce(0), "Expecting 'assertStepOnce(2)', 'step(2)', 'assertStepAtLeastOnce(1|2)', 'assertAllSteps(2)', 'multiple(2)', but received 'assertStepAtLeastOnce(0)'")

  a = new AssertOrder()
  t.throws(() => a.assertStepAtLeastOnce(1), "Expecting 'assertStepOnce(0)', 'step(0)', 'assertStepAtLeastOnce(0)', 'assertAllSteps(0)', 'multiple(0)', but received 'assertStepAtLeastOnce(1)'")

  a = new AssertOrder()
  a.assertStepAtLeastOnce(0)
  t.throws(() => a.assertStepAtLeastOnce(2), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(0|1)', 'assertAllSteps(1)', 'multiple(1)', but received 'assertStepAtLeastOnce(2)'")
})

test('assertStepAtLeastOnce() async', async t => {
  let a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  t.is(a.next, 1)
  await utils.runAsync(() => a.assertStepAtLeastOnce(1))
  t.is(a.next, 2)
  await utils.runAsync(() => a.assertStepAtLeastOnce(1))
  t.is(a.next, 2)
  await utils.runAsync(() => a.step(2))
  t.is(a.next, 3)

  a = new AssertOrder()
  await utils.runSequentialAsync(() => a.assertStepAtLeastOnce(0), () => a.assertStepAtLeastOnce(0), () => a.step(1))
  await t.throws(utils.runAsync(() => a.assertStepAtLeastOnce(1)), "Expecting 'assertStepOnce(2)', 'step(2)', 'assertStepAtLeastOnce(2)', 'assertAllSteps(2)', 'multiple(2)', but received 'assertStepAtLeastOnce(1)'")

  a = new AssertOrder()
  t.is(await utils.runAsync(() => a.assertStepAtLeastOnce(0)), 1)
  t.is(await utils.runAsync(() => a.assertStepAtLeastOnce(0)), 2)
  t.is(await utils.runAsync(() => a.assertStepAtLeastOnce(1)), 1)
  t.is(await utils.runAsync(() => a.assertStepAtLeastOnce(1)), 2)
  t.is(await utils.runAsync(() => a.assertStepAtLeastOnce(2)), 1)
  t.is(await utils.runAsync(() => a.assertStepAtLeastOnce(2)), 2)

  a = new AssertOrder()
  await utils.runParallelAsync(() => a.assertStepAtLeastOnce(0), () => a.assertStepAtLeastOnce(0))
  await utils.runAsync(() => a.assertStepAtLeastOnce(1))
  await t.throws(utils.runAsync(() => a.assertStepAtLeastOnce(0)), "Expecting 'assertStepOnce(2)', 'step(2)', 'assertStepAtLeastOnce(1|2)', 'assertAllSteps(2)', 'multiple(2)', but received 'assertStepAtLeastOnce(0)'")

  a = new AssertOrder()
  await t.throws(utils.runAsync(() => a.assertStepAtLeastOnce(1)), "Expecting 'assertStepOnce(0)', 'step(0)', 'assertStepAtLeastOnce(0)', 'assertAllSteps(0)', 'multiple(0)', but received 'assertStepAtLeastOnce(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.assertStepAtLeastOnce(0))
  await t.throws(utils.runAsync(() => a.assertStepAtLeastOnce(2)), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(0|1)', 'assertAllSteps(1)', 'multiple(1)', but received 'assertStepAtLeastOnce(2)'")

  a = new AssertOrder()
  await t.throws(utils.runSequentialAsync(() => a.assertStepAtLeastOnce(0), () => a.assertStepAtLeastOnce(2)), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(0|1)', 'assertAllSteps(1)', 'multiple(1)', but received 'assertStepAtLeastOnce(2)'")
})

test('assertAllSteps()', t => {
  let a = new AssertOrder()
  t.is(a.assertAllSteps(0, 2), 1)
  t.is(a.next, 0)
  t.is(a.assertAllSteps(0, 2), 2)
  t.is(a.next, 1)
  a.step(1)
  t.is(a.next, 2)

  a = new AssertOrder()
  t.throws(() => a.assertAllSteps(0, 0), "0 is not a valid 'plan' value.")
  t.throws(() => a.assertAllSteps(0, -1), "-1 is not a valid 'plan' value.")

  a = new AssertOrder()
  a.step(0)
  a.assertStepAtLeastOnce(1)
  t.throws(() => a.assertAllSteps(1, 1), "Expecting 'assertStepOnce(2)', 'step(2)', 'assertStepAtLeastOnce(1|2)', 'assertAllSteps(2)', 'multiple(2)', but received 'assertAllSteps(1)'")

  a = new AssertOrder()
  a.step(0)
  a.assertAllSteps(1, 2)
  t.throws(() => a.assertStepAtLeastOnce(1), "Expecting 'assertAllSteps(1)', 'multiple(1)', but received 'assertStepAtLeastOnce(1)'")

  a = new AssertOrder()
  a.assertAllSteps(0, 2)
  a.assertAllSteps(0, 2)
  t.throws(() => a.assertAllSteps(0, 2), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'assertAllSteps(0)'")

  a = new AssertOrder()
  a.assertAllSteps(0, 2)
  t.throws(() => a.assertAllSteps(0, 3), 'The plan count (3) does not match with previous value (2).')

  a = new AssertOrder()
  t.is(a.assertAllSteps(0, 1), 1)
  a.step(1)
  t.is(a.assertAllSteps(2, 2), 1)
  t.is(a.assertAllSteps(2, 2), 2)
  a.step(3)
})

test('assertAllSteps() async', async t => {
  let a = new AssertOrder()
  t.is(await utils.runAsync(() => a.assertAllSteps(0, 2)), 1)
  t.is(a.next, 0)
  t.is(await utils.runAsync(() => a.assertAllSteps(0, 2)), 2)
  t.is(a.next, 1)
  await utils.runAsync(() => a.step(1))
  t.is(a.next, 2)

  a = new AssertOrder()
  await t.throws(utils.runAsync(() => a.assertAllSteps(0, 0)), "0 is not a valid 'plan' value.")
  await t.throws(utils.runAsync(() => a.assertAllSteps(0, -1)), "-1 is not a valid 'plan' value.")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await utils.runAsync(() => a.assertStepAtLeastOnce(1))
  await t.throws(utils.runAsync(() => a.assertAllSteps(1, 1)), "Expecting 'assertStepOnce(2)', 'step(2)', 'assertStepAtLeastOnce(1|2)', 'assertAllSteps(2)', 'multiple(2)', but received 'assertAllSteps(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await utils.runAsync(() => a.assertAllSteps(1, 2))
  await t.throws(utils.runAsync(() => a.assertStepAtLeastOnce(1)), "Expecting 'assertAllSteps(1)', 'multiple(1)', but received 'assertStepAtLeastOnce(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.assertAllSteps(0, 2))
  await utils.runAsync(() => a.assertAllSteps(0, 2))
  await t.throws(utils.runAsync(() => a.assertAllSteps(0, 2)), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertStepAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'assertAllSteps(0)'")

  a = new AssertOrder()
  await t.throws(
    utils.runParallelAsync(() => a.assertAllSteps(0, 2), () => a.assertAllSteps(0, 2), () => a.assertAllSteps(0, 2)),
    "Expecting 'assertStepOnce(1)', 'step(1)', 'assertAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'assertAllSteps(0)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.assertAllSteps(0, 2))
  await t.throws(utils.runAsync(() => a.assertAllSteps(0, 3)), 'The plan count (3) does not match with previous value (2).')

  a = new AssertOrder()
  await t.is(await utils.runAsync(() => a.assertAllSteps(0, 1)), 1)
  await utils.runAsync(() => a.step(1))
  await t.is(await utils.runAsync(() => a.assertAllSteps(2, 2)), 1)
  await t.is(await utils.runAsync(() => a.assertAllSteps(2, 2)), 2)
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
  a.assertStepAtLeastOnce(1)
  t.throws(() => a.multiple(1, 1), "Expecting 'assertStepOnce(2)', 'step(2)', 'assertAtLeastOnce(1|2)', 'assertAllSteps(2)', 'multiple(2)', but received 'multiple(1)'")

  a = new AssertOrder()
  a.step(0)
  a.multiple(1, 2)
  t.throws(() => a.assertStepAtLeastOnce(1), "Expecting 'assertAllSteps(1)', 'multiple(1)', but received 'assertAtLeastOnce(1)'")

  a = new AssertOrder()
  a.multiple(0, 2)
  a.multiple(0, 2)
  t.throws(() => a.multiple(0, 2), "Expecting 'assertStepOnce(1)', 'step(1)', 'assertAtLeastOnce(1)', 'assertAllSteps(1)', 'multiple(1)', but received 'multiple(0)'")

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
  a.assertStepOnce(0)
  t.is(a.assertStepAtLeastOnce(1), 1)
  t.is(a.assertStepAtLeastOnce(1), 2)
  t.is(a.assertAllSteps(2, 2), 1)
  t.throws(() => a.end(), `Planned 3 steps but executed 2 steps`)
  t.is(a.assertAllSteps(2, 2), 2)
  a.end()

  a = new AssertOrder(1)
  setTimeout(() => {
    a.assertStepOnce(0)
  }, 10)
  return a.end(50)
})

test(`end() reject`, t => {
  const a = new AssertOrder(2)
  setTimeout(() => {
    a.assertStepOnce(0)
  }, 50)
  return a.end(1).then(() => t.fail('should fail'), () => t.pass('should fail'))
})
