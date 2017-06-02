import test from 'ava'
import * as utils from './testUtils'
import AssertOrder from './index'

test('different starting index', _t => {
  let a = new AssertOrder(0, 1)
  a.runExactlyOnce(1)
  a.runExactlyOnce(2)

  a = new AssertOrder(0, -1)
  a.runExactlyOnce(-1)
  a.runExactlyOnce(0)
  a.runExactlyOnce(1)

  a = new AssertOrder(0, 5)
  a.runExactlyOnce(5)
  a.runExactlyOnce(6)
})

test('runExactlyOnce()', t => {
  let a = new AssertOrder()
  a.runExactlyOnce(0)
  t.is(a.next, 1)
  a.runExactlyOnce(1)
  t.is(a.next, 2)
  a.runExactlyOnce(2)
  t.is(a.next, 3)
  a.runExactlyOnce(3)
  t.is(a.next, 4)

  a = new AssertOrder()
  t.throws(() => a.runExactlyOnce(1), "Expecting 'runExactlyOnce(0)', 'step(0)', 'runAtLeastOnce(0)', 'runExactlyXTimes(0)', 'multiple(0)', but received 'runExactlyOnce(1)'")

  a = new AssertOrder()
  a.runExactlyOnce(0)
  t.throws(() => a.runExactlyOnce(2), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'runExactlyOnce(2)'")

  a = new AssertOrder()
  a.runExactlyOnce(0)
  t.throws(() => a.runExactlyOnce(0), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'runExactlyOnce(0)'")
})

test('runExactlyOnce() async', async t => {
  let a = new AssertOrder()
  await utils.runAsync(() => a.runExactlyOnce(0))
  t.is(a.next, 1)
  await utils.runAsync(() => a.runExactlyOnce(1))
  t.is(a.next, 2)
  await utils.runAsync(() => a.runExactlyOnce(2))
  t.is(a.next, 3)
  await utils.runAsync(() => a.runExactlyOnce(3))
  t.is(a.next, 4)

  a = new AssertOrder()
  await t.throws(utils.runAsync(() => a.runExactlyOnce(1)), "Expecting 'runExactlyOnce(0)', 'step(0)', 'runAtLeastOnce(0)', 'runExactlyXTimes(0)', 'multiple(0)', but received 'runExactlyOnce(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.runExactlyOnce(0))
  await t.throws(utils.runAsync(() => a.runExactlyOnce(2)), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'runExactlyOnce(2)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.runExactlyOnce(0))
  await t.throws(utils.runAsync(() => a.runExactlyOnce(0)), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'runExactlyOnce(0)'")
})

test('step()', t => {
  let a = new AssertOrder()
  a.step(0)
  a.step(1)
  a.step(2)
  a.step(3)

  a = new AssertOrder()
  t.throws(() => a.step(1), "Expecting 'runExactlyOnce(0)', 'step(0)', 'runAtLeastOnce(0)', 'runExactlyXTimes(0)', 'multiple(0)', but received 'step(1)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(2), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'step(2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(0), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'step(0)'")
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
  await t.throws(utils.runAsync(() => a.step(1)), "Expecting 'runExactlyOnce(0)', 'step(0)', 'runAtLeastOnce(0)', 'runExactlyXTimes(0)', 'multiple(0)', but received 'step(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await t.throws(utils.runAsync(() => a.step(2)), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'step(2)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await t.throws(utils.runAsync(() => a.step(0)), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'step(0)'")
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
  t.throws(() => a.any(1, 2), "Expecting 'runExactlyOnce(0)', 'step(0)', 'runAtLeastOnce(0)', 'runExactlyXTimes(0)', 'multiple(0)', but received 'any(1,2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.any(2), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'any(2)'")
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
  t.throws(utils.runAsync(() => a.any(1, 2)), "Expecting 'runExactlyOnce(0)', 'step(0)', 'runAtLeastOnce(0)', 'runExactlyXTimes(0)', 'multiple(0)', but received 'any(1,2)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await t.throws(utils.runAsync(() => a.any(2)), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'any(2)'")
})

test('runAtLeastOnce()', t => {
  let a = new AssertOrder()
  a.step(0)
  t.is(a.next, 1)
  a.runAtLeastOnce(1)
  t.is(a.next, 2)
  a.runAtLeastOnce(1)
  t.is(a.next, 2)
  a.step(2)
  t.is(a.next, 3)

  a = new AssertOrder()
  a.runAtLeastOnce(0)
  a.runAtLeastOnce(0)
  a.step(1)
  t.throws(() => a.runAtLeastOnce(1), "Expecting 'runExactlyOnce(2)', 'step(2)', 'runAtLeastOnce(2)', 'runExactlyXTimes(2)', 'multiple(2)', but received 'runAtLeastOnce(1)'")

  a = new AssertOrder()
  t.is(a.runAtLeastOnce(0), 1)
  t.is(a.runAtLeastOnce(0), 2)
  t.is(a.runAtLeastOnce(1), 1)
  t.is(a.runAtLeastOnce(1), 2)
  t.is(a.runAtLeastOnce(2), 1)
  t.is(a.runAtLeastOnce(2), 2)

  a = new AssertOrder()
  a.runAtLeastOnce(0)
  a.runAtLeastOnce(0)
  a.runAtLeastOnce(1)
  t.throws(() => a.runAtLeastOnce(0), "Expecting 'runExactlyOnce(2)', 'step(2)', 'runAtLeastOnce(1|2)', 'runExactlyXTimes(2)', 'multiple(2)', but received 'runAtLeastOnce(0)'")

  a = new AssertOrder()
  t.throws(() => a.runAtLeastOnce(1), "Expecting 'runExactlyOnce(0)', 'step(0)', 'runAtLeastOnce(0)', 'runExactlyXTimes(0)', 'multiple(0)', but received 'runAtLeastOnce(1)'")

  a = new AssertOrder()
  a.runAtLeastOnce(0)
  t.throws(() => a.runAtLeastOnce(2), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(0|1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'runAtLeastOnce(2)'")
})

test('runAtLeastOnce() async', async t => {
  let a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  t.is(a.next, 1)
  await utils.runAsync(() => a.runAtLeastOnce(1))
  t.is(a.next, 2)
  await utils.runAsync(() => a.runAtLeastOnce(1))
  t.is(a.next, 2)
  await utils.runAsync(() => a.step(2))
  t.is(a.next, 3)

  a = new AssertOrder()
  await utils.runSequentialAsync(() => a.runAtLeastOnce(0), () => a.runAtLeastOnce(0), () => a.step(1))
  await t.throws(utils.runAsync(() => a.runAtLeastOnce(1)), "Expecting 'runExactlyOnce(2)', 'step(2)', 'runAtLeastOnce(2)', 'runExactlyXTimes(2)', 'multiple(2)', but received 'runAtLeastOnce(1)'")

  a = new AssertOrder()
  t.is(await utils.runAsync(() => a.runAtLeastOnce(0)), 1)
  t.is(await utils.runAsync(() => a.runAtLeastOnce(0)), 2)
  t.is(await utils.runAsync(() => a.runAtLeastOnce(1)), 1)
  t.is(await utils.runAsync(() => a.runAtLeastOnce(1)), 2)
  t.is(await utils.runAsync(() => a.runAtLeastOnce(2)), 1)
  t.is(await utils.runAsync(() => a.runAtLeastOnce(2)), 2)

  a = new AssertOrder()
  await utils.runParallelAsync(() => a.runAtLeastOnce(0), () => a.runAtLeastOnce(0))
  await utils.runAsync(() => a.runAtLeastOnce(1))
  await t.throws(utils.runAsync(() => a.runAtLeastOnce(0)), "Expecting 'runExactlyOnce(2)', 'step(2)', 'runAtLeastOnce(1|2)', 'runExactlyXTimes(2)', 'multiple(2)', but received 'runAtLeastOnce(0)'")

  a = new AssertOrder()
  await t.throws(utils.runAsync(() => a.runAtLeastOnce(1)), "Expecting 'runExactlyOnce(0)', 'step(0)', 'runAtLeastOnce(0)', 'runExactlyXTimes(0)', 'multiple(0)', but received 'runAtLeastOnce(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.runAtLeastOnce(0))
  await t.throws(utils.runAsync(() => a.runAtLeastOnce(2)), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(0|1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'runAtLeastOnce(2)'")

  a = new AssertOrder()
  await t.throws(utils.runSequentialAsync(() => a.runAtLeastOnce(0), () => a.runAtLeastOnce(2)), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(0|1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'runAtLeastOnce(2)'")
})

test('runExactlyXTimes()', t => {
  let a = new AssertOrder()
  t.is(a.runExactlyXTimes(0, 2), 1)
  t.is(a.next, 0)
  t.is(a.runExactlyXTimes(0, 2), 2)
  t.is(a.next, 1)
  a.step(1)
  t.is(a.next, 2)

  a = new AssertOrder()
  t.throws(() => a.runExactlyXTimes(0, 0), "0 is not a valid 'plan' value.")
  t.throws(() => a.runExactlyXTimes(0, -1), "-1 is not a valid 'plan' value.")

  a = new AssertOrder()
  a.step(0)
  a.runAtLeastOnce(1)
  t.throws(() => a.runExactlyXTimes(1, 1), "Expecting 'runExactlyOnce(2)', 'step(2)', 'runAtLeastOnce(1|2)', 'runExactlyXTimes(2)', 'multiple(2)', but received 'runExactlyXTimes(1)'")

  a = new AssertOrder()
  a.step(0)
  a.runExactlyXTimes(1, 2)
  t.throws(() => a.runAtLeastOnce(1), "Expecting 'runExactlyXTimes(1)', 'multiple(1)', but received 'runAtLeastOnce(1)'")

  a = new AssertOrder()
  a.runExactlyXTimes(0, 2)
  a.runExactlyXTimes(0, 2)
  t.throws(() => a.runExactlyXTimes(0, 2), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'runExactlyXTimes(0)'")

  a = new AssertOrder()
  a.runExactlyXTimes(0, 2)
  t.throws(() => a.runExactlyXTimes(0, 3), 'The plan count (3) does not match with previous value (2).')

  a = new AssertOrder()
  t.is(a.runExactlyXTimes(0, 1), 1)
  a.step(1)
  t.is(a.runExactlyXTimes(2, 2), 1)
  t.is(a.runExactlyXTimes(2, 2), 2)
  a.step(3)
})

test('runExactlyXTimes() async', async t => {
  let a = new AssertOrder()
  t.is(await utils.runAsync(() => a.runExactlyXTimes(0, 2)), 1)
  t.is(a.next, 0)
  t.is(await utils.runAsync(() => a.runExactlyXTimes(0, 2)), 2)
  t.is(a.next, 1)
  await utils.runAsync(() => a.step(1))
  t.is(a.next, 2)

  a = new AssertOrder()
  await t.throws(utils.runAsync(() => a.runExactlyXTimes(0, 0)), "0 is not a valid 'plan' value.")
  await t.throws(utils.runAsync(() => a.runExactlyXTimes(0, -1)), "-1 is not a valid 'plan' value.")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await utils.runAsync(() => a.runAtLeastOnce(1))
  await t.throws(utils.runAsync(() => a.runExactlyXTimes(1, 1)), "Expecting 'runExactlyOnce(2)', 'step(2)', 'runAtLeastOnce(1|2)', 'runExactlyXTimes(2)', 'multiple(2)', but received 'runExactlyXTimes(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.step(0))
  await utils.runAsync(() => a.runExactlyXTimes(1, 2))
  await t.throws(utils.runAsync(() => a.runAtLeastOnce(1)), "Expecting 'runExactlyXTimes(1)', 'multiple(1)', but received 'runAtLeastOnce(1)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.runExactlyXTimes(0, 2))
  await utils.runAsync(() => a.runExactlyXTimes(0, 2))
  await t.throws(utils.runAsync(() => a.runExactlyXTimes(0, 2)), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'runExactlyXTimes(0)'")

  a = new AssertOrder()
  await t.throws(
    utils.runParallelAsync(() => a.runExactlyXTimes(0, 2), () => a.runExactlyXTimes(0, 2), () => a.runExactlyXTimes(0, 2)),
    "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'runExactlyXTimes(0)'")

  a = new AssertOrder()
  await utils.runAsync(() => a.runExactlyXTimes(0, 2))
  await t.throws(utils.runAsync(() => a.runExactlyXTimes(0, 3)), 'The plan count (3) does not match with previous value (2).')

  a = new AssertOrder()
  await t.is(await utils.runAsync(() => a.runExactlyXTimes(0, 1)), 1)
  await utils.runAsync(() => a.step(1))
  await t.is(await utils.runAsync(() => a.runExactlyXTimes(2, 2)), 1)
  await t.is(await utils.runAsync(() => a.runExactlyXTimes(2, 2)), 2)
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
  a.runAtLeastOnce(1)
  t.throws(() => a.multiple(1, 1), "Expecting 'runExactlyOnce(2)', 'step(2)', 'runAtLeastOnce(1|2)', 'runExactlyXTimes(2)', 'multiple(2)', but received 'multiple(1)'")

  a = new AssertOrder()
  a.step(0)
  a.multiple(1, 2)
  t.throws(() => a.runAtLeastOnce(1), "Expecting 'runExactlyXTimes(1)', 'multiple(1)', but received 'runAtLeastOnce(1)'")

  a = new AssertOrder()
  a.multiple(0, 2)
  a.multiple(0, 2)
  t.throws(() => a.multiple(0, 2), "Expecting 'runExactlyOnce(1)', 'step(1)', 'runAtLeastOnce(1)', 'runExactlyXTimes(1)', 'multiple(1)', but received 'multiple(0)'")

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
  a.runExactlyOnce(0)
  t.is(a.runAtLeastOnce(1), 1)
  t.is(a.runAtLeastOnce(1), 2)
  t.is(a.runExactlyXTimes(2, 2), 1)
  t.throws(() => a.end(), `Planned 3 steps but executed 2 steps`)
  t.is(a.runExactlyXTimes(2, 2), 2)
  a.end()

  a = new AssertOrder(1)
  setTimeout(() => {
    a.runExactlyOnce(0)
  }, 10)
  return a.end(50)
})

test(`end() reject`, t => {
  const a = new AssertOrder(2)
  setTimeout(() => {
    a.runExactlyOnce(0)
  }, 50)
  return a.end(1).then(() => t.fail('should fail'), () => t.pass('should fail'))
})
