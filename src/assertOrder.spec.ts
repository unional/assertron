import test from 'ava'
import AssertOrder from './index'

test('different starting index', t => {
  let a = new AssertOrder(0, 1)
  a.once(1)
  a.once(2)

  a = new AssertOrder(0, -1)
  a.once(-1)
  a.once(0)
  a.once(1)

  a = new AssertOrder(0, 5)
  a.once(5)
  a.once(6)
})

test('once()', t => {
  let a = new AssertOrder()
  a.once(0)
  t.is(a.next, 1)
  a.once(1)
  t.is(a.next, 2)
  a.once(2)
  t.is(a.next, 3)
  a.once(3)
  t.is(a.next, 4)

  a = new AssertOrder()
  t.throws(() => a.once(1), "Expecting 'once(0)', 'step(0)', 'some(0)', 'all(0)', but received 'once(1)'")

  a = new AssertOrder()
  a.once(0)
  t.throws(() => a.once(2), "Expecting 'once(1)', 'step(1)', 'some(1)', 'all(1)', but received 'once(2)'")

  a = new AssertOrder()
  a.once(0)
  t.throws(() => a.once(0), "Expecting 'once(1)', 'step(1)', 'some(1)', 'all(1)', but received 'once(0)'")
})

test('step()', t => {
  let a = new AssertOrder()
  a.step(0)
  a.step(1)
  a.step(2)
  a.step(3)

  a = new AssertOrder()
  t.throws(() => a.step(1), "Expecting 'once(0)', 'step(0)', 'some(0)', 'all(0)', but received 'step(1)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(2), "Expecting 'once(1)', 'step(1)', 'some(1)', 'all(1)', but received 'step(2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(0), "Expecting 'once(1)', 'step(1)', 'some(1)', 'all(1)', but received 'step(0)'")
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
  t.throws(() => a.any(1, 2), "Expecting 'once(0)', 'step(0)', 'some(0)', 'all(0)', but received 'any(1,2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.any(2), "Expecting 'once(1)', 'step(1)', 'some(1)', 'all(1)', but received 'any(2)'")
})

test('some()', t => {
  let a = new AssertOrder()

  a.step(0)
  t.is(a.next, 1)
  a.some(1)
  t.is(a.next, 2)
  a.some(1)
  t.is(a.next, 2)
  a.step(2)
  t.is(a.next, 3)

  a = new AssertOrder()

  a.some(0)
  a.some(0)
  a.step(1)
  t.throws(() => a.some(1), "Expecting 'once(2)', 'step(2)', 'some(2)', 'all(2)', but received 'some(1)'")

  a = new AssertOrder()
  t.is(a.some(0), 1)
  t.is(a.some(0), 2)
  t.is(a.some(1), 1)
  t.is(a.some(1), 2)
  t.is(a.some(2), 1)
  t.is(a.some(2), 2)

  a = new AssertOrder()
  a.some(0)
  a.some(1)
  t.throws(() => a.some(0), "Expecting 'once(2)', 'step(2)', 'some(1|2)', 'all(2)', but received 'some(0)'")

  a = new AssertOrder()
  t.throws(() => a.some(1), "Expecting 'once(0)', 'step(0)', 'some(0)', 'all(0)', but received 'some(1)'")

  a = new AssertOrder()
  a.some(0)
  t.throws(() => a.some(2), "Expecting 'once(1)', 'step(1)', 'some(0|1)', 'all(1)', but received 'some(2)'")
})

test('all()', t => {
  let a = new AssertOrder()
  t.is(a.all(0, 2), 1)
  t.is(a.next, 0)
  t.is(a.all(0, 2), 2)
  t.is(a.next, 1)
  a.step(1)
  t.is(a.next, 2)

  a = new AssertOrder()
  t.throws(() => a.all(0, 0), "0 is not a valid 'plan' value.")
  t.throws(() => a.all(0, -1), "-1 is not a valid 'plan' value.")

  a = new AssertOrder()
  a.step(0)
  a.some(1)
  t.throws(() => a.all(1, 1), "Expecting 'once(2)', 'step(2)', 'some(1|2)', 'all(2)', but received 'all(1)'")

  a = new AssertOrder()
  a.step(0)
  a.all(1, 2)
  t.throws(() => a.some(1), "Expecting 'all(1)', but received 'some(1)'")

  a = new AssertOrder()
  a.all(0, 2)
  a.all(0, 2)
  t.throws(() => a.all(0, 2), "Expecting 'once(1)', 'step(1)', 'some(1)', 'all(1)', but received 'all(0)'")

  a = new AssertOrder()
  a.all(0, 2)
  t.throws(() => a.all(0, 3), 'The plan count (3) does not match with previous value (2).')

  a = new AssertOrder()
  t.is(a.all(0, 1), 1)
  a.step(1)
  t.is(a.all(2, 2), 1)
  t.is(a.all(2, 2), 2)
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
  a.once(0)
  t.is(a.some(1), 1)
  t.is(a.some(1), 2)
  t.is(a.all(2, 2), 1)
  t.throws(() => a.end(), `Planned 3 steps but executed 2 steps`)
  t.is(a.all(2, 2), 2)
  a.end()

  a = new AssertOrder(1)
  setTimeout(() => {
    a.once(0)
  }, 10)
  return a.end(50)
})

test(`end() reject`, t => {
  const a = new AssertOrder(2)
  setTimeout(() => {
    a.once(0)
  }, 50)
  return a.end(1).then(() => t.fail('should fail'), () => t.pass('should fail'))
})
