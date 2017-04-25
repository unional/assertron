import test from 'ava'
import AssertOrder from './index'

test('different starting index', _t => {
  let a = new AssertOrder(0, 1)
  a.runOnce(1)
  a.runOnce(2)

  a = new AssertOrder(0, -1)
  a.runOnce(-1)
  a.runOnce(0)
  a.runOnce(1)

  a = new AssertOrder(0, 5)
  a.runOnce(5)
  a.runOnce(6)
})

test('runOnce()', t => {
  let a = new AssertOrder()
  a.runOnce(0)
  t.is(a.next, 1)
  a.runOnce(1)
  t.is(a.next, 2)
  a.runOnce(2)
  t.is(a.next, 3)
  a.runOnce(3)
  t.is(a.next, 4)

  a = new AssertOrder()
  t.throws(() => a.runOnce(1), "Expecting 'runOnce(0)', 'step(0)', 'runAtleastOnce(0)', 'repeatExactCount(0)', 'multiple(0)', but received 'runOnce(1)'")

  a = new AssertOrder()
  a.runOnce(0)
  t.throws(() => a.runOnce(2), "Expecting 'runOnce(1)', 'step(1)', 'runAtleastOnce(1)', 'repeatExactCount(1)', 'multiple(1)', but received 'runOnce(2)'")

  a = new AssertOrder()
  a.runOnce(0)
  t.throws(() => a.runOnce(0), "Expecting 'runOnce(1)', 'step(1)', 'runAtleastOnce(1)', 'repeatExactCount(1)', 'multiple(1)', but received 'runOnce(0)'")
})

test('step()', t => {
  let a = new AssertOrder()
  a.step(0)
  a.step(1)
  a.step(2)
  a.step(3)

  a = new AssertOrder()
  t.throws(() => a.step(1), "Expecting 'runOnce(0)', 'step(0)', 'runAtleastOnce(0)', 'repeatExactCount(0)', 'multiple(0)', but received 'step(1)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(2), "Expecting 'runOnce(1)', 'step(1)', 'runAtleastOnce(1)', 'repeatExactCount(1)', 'multiple(1)', but received 'step(2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(0), "Expecting 'runOnce(1)', 'step(1)', 'runAtleastOnce(1)', 'repeatExactCount(1)', 'multiple(1)', but received 'step(0)'")
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
  t.throws(() => a.any(1, 2), "Expecting 'runOnce(0)', 'step(0)', 'runAtleastOnce(0)', 'repeatExactCount(0)', 'multiple(0)', but received 'any(1,2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.any(2), "Expecting 'runOnce(1)', 'step(1)', 'runAtleastOnce(1)', 'repeatExactCount(1)', 'multiple(1)', but received 'any(2)'")
})

test('runAtleastOnce()', t => {
  let a = new AssertOrder()

  a.step(0)
  t.is(a.next, 1)
  a.runAtleastOnce(1)
  t.is(a.next, 2)
  a.runAtleastOnce(1)
  t.is(a.next, 2)
  a.step(2)
  t.is(a.next, 3)

  a = new AssertOrder()

  a.runAtleastOnce(0)
  a.runAtleastOnce(0)
  a.step(1)
  t.throws(() => a.runAtleastOnce(1), "Expecting 'runOnce(2)', 'step(2)', 'runAtleastOnce(2)', 'repeatExactCount(2)', 'multiple(2)', but received 'runAtleastOnce(1)'")

  a = new AssertOrder()
  t.is(a.runAtleastOnce(0), 1)
  t.is(a.runAtleastOnce(0), 2)
  t.is(a.runAtleastOnce(1), 1)
  t.is(a.runAtleastOnce(1), 2)
  t.is(a.runAtleastOnce(2), 1)
  t.is(a.runAtleastOnce(2), 2)

  a = new AssertOrder()
  a.runAtleastOnce(0)
  a.runAtleastOnce(1)
  t.throws(() => a.runAtleastOnce(0), "Expecting 'runOnce(2)', 'step(2)', 'runAtleastOnce(1|2)', 'repeatExactCount(2)', 'multiple(2)', but received 'runAtleastOnce(0)'")

  a = new AssertOrder()
  t.throws(() => a.runAtleastOnce(1), "Expecting 'runOnce(0)', 'step(0)', 'runAtleastOnce(0)', 'repeatExactCount(0)', 'multiple(0)', but received 'runAtleastOnce(1)'")

  a = new AssertOrder()
  a.runAtleastOnce(0)
  t.throws(() => a.runAtleastOnce(2), "Expecting 'runOnce(1)', 'step(1)', 'runAtleastOnce(0|1)', 'repeatExactCount(1)', 'multiple(1)', but received 'runAtleastOnce(2)'")
})

test('repeatExactCount()', t => {
  let a = new AssertOrder()
  t.is(a.repeatExactCount(0, 2), 1)
  t.is(a.next, 0)
  t.is(a.repeatExactCount(0, 2), 2)
  t.is(a.next, 1)
  a.step(1)
  t.is(a.next, 2)

  a = new AssertOrder()
  t.throws(() => a.repeatExactCount(0, 0), "0 is not a valid 'plan' value.")
  t.throws(() => a.repeatExactCount(0, -1), "-1 is not a valid 'plan' value.")

  a = new AssertOrder()
  a.step(0)
  a.runAtleastOnce(1)
  t.throws(() => a.repeatExactCount(1, 1), "Expecting 'runOnce(2)', 'step(2)', 'runAtleastOnce(1|2)', 'repeatExactCount(2)', 'multiple(2)', but received 'repeatExactCount(1)'")

  a = new AssertOrder()
  a.step(0)
  a.repeatExactCount(1, 2)
  t.throws(() => a.runAtleastOnce(1), "Expecting 'repeatExactCount(1)', 'multiple(1)', but received 'runAtleastOnce(1)'")

  a = new AssertOrder()
  a.repeatExactCount(0, 2)
  a.repeatExactCount(0, 2)
  t.throws(() => a.repeatExactCount(0, 2), "Expecting 'runOnce(1)', 'step(1)', 'runAtleastOnce(1)', 'repeatExactCount(1)', 'multiple(1)', but received 'repeatExactCount(0)'")

  a = new AssertOrder()
  a.repeatExactCount(0, 2)
  t.throws(() => a.repeatExactCount(0, 3), 'The plan count (3) does not match with previous value (2).')

  a = new AssertOrder()
  t.is(a.repeatExactCount(0, 1), 1)
  a.step(1)
  t.is(a.repeatExactCount(2, 2), 1)
  t.is(a.repeatExactCount(2, 2), 2)
  a.step(3)
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
  a.runAtleastOnce(1)
  t.throws(() => a.multiple(1, 1), "Expecting 'runOnce(2)', 'step(2)', 'runAtleastOnce(1|2)', 'repeatExactCount(2)', 'multiple(2)', but received 'multiple(1)'")

  a = new AssertOrder()
  a.step(0)
  a.multiple(1, 2)
  t.throws(() => a.runAtleastOnce(1), "Expecting 'repeatExactCount(1)', 'multiple(1)', but received 'runAtleastOnce(1)'")

  a = new AssertOrder()
  a.multiple(0, 2)
  a.multiple(0, 2)
  t.throws(() => a.multiple(0, 2), "Expecting 'runOnce(1)', 'step(1)', 'runAtleastOnce(1)', 'repeatExactCount(1)', 'multiple(1)', but received 'multiple(0)'")

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
  a.runOnce(0)
  t.is(a.runAtleastOnce(1), 1)
  t.is(a.runAtleastOnce(1), 2)
  t.is(a.repeatExactCount(2, 2), 1)
  t.throws(() => a.end(), `Planned 3 steps but executed 2 steps`)
  t.is(a.repeatExactCount(2, 2), 2)
  a.end()

  a = new AssertOrder(1)
  setTimeout(() => {
    a.runOnce(0)
  }, 10)
  return a.end(50)
})

test(`end() reject`, t => {
  const a = new AssertOrder(2)
  setTimeout(() => {
    a.runOnce(0)
  }, 50)
  return a.end(1).then(() => t.fail('should fail'), () => t.pass('should fail'))
})
