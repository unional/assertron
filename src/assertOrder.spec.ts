import test from 'ava'
import AssertOrder from './index'

test('different starting index', t => {
  let a = new AssertOrder(1)
  a.step(1)
  a.step(2)

  a = new AssertOrder(-1)
  a.step(-1)
  a.step(0)
  a.step(1)

  a = new AssertOrder(5)
  a.step(5)
  a.step(6)
})

test('step()', t => {
  let a = new AssertOrder()
  a.step(0)
  a.step(1)
  a.step(2)
  a.step(3)

  a = new AssertOrder()
  t.throws(() => a.step(1), "Expecting 'once(0)', 'some(0)', 'all(0)', but received 'step(1)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(2), "Expecting 'once(1)', 'some(1)', 'all(1)', but received 'step(2)'")

  a = new AssertOrder()
  a.step(0)
  t.throws(() => a.step(0), "Expecting 'once(1)', 'some(1)', 'all(1)', but received 'step(0)'")
})

test('any()', t => {
  let a = new AssertOrder()

  a.step(0)
  a.any(1)
  a.any(1)
  a.step(2)

  a = new AssertOrder()

  a.any(0)
  a.any(0)
  a.step(1)
  t.throws(() => a.any(1), "Expecting 'once(2)', 'some(2)', 'all(2)', but received 'any(1)'")

  a = new AssertOrder()
  a.any(0)
  a.any(0)
  a.any(1)
  a.any(1)
  a.any(2)
  a.any(2)

  a = new AssertOrder()
  a.any(0)
  a.any(1)
  t.throws(() => a.any(0), "Expecting 'once(2)', 'some(1,2)', 'all(2)', but received 'any(0)'")

  a = new AssertOrder()
  t.throws(() => a.any(1), "Expecting 'once(0)', 'some(0)', 'all(0)', but received 'any(1)'")

  a = new AssertOrder()
  a.any(0)
  t.throws(() => a.any(2), "Expecting 'once(1)', 'some(0,1)', 'all(1)', but received 'any(2)'")
})

test('once()', t => {
  let a = new AssertOrder()
  a.once(0)
  a.once(1)
  a.once(2)
  a.once(3)

  a = new AssertOrder(1)
  a.once(1)
  a.once(2)

  a = new AssertOrder(-1)
  a.once(-1)
  a.once(0)
  a.once(1)

  a = new AssertOrder(5)
  a.once(5)
  a.once(6)

  a = new AssertOrder()
  t.throws(() => a.once(1), "Expecting 'once(0)', 'some(0)', 'all(0)', but received 'once(1)'")

  a = new AssertOrder()
  a.once(0)
  t.throws(() => a.once(2), "Expecting 'once(1)', 'some(1)', 'all(1)', but received 'once(2)'")

  a = new AssertOrder()
  a.once(0)
  t.throws(() => a.once(0), "Expecting 'once(1)', 'some(1)', 'all(1)', but received 'once(0)'")
})

test('all()', t => {
  let a = new AssertOrder()
  a.all(0, 2)
  a.all(0, 2)
  a.step(1)

  a = new AssertOrder()
  t.throws(() => a.all(0, 0), "0 is not a valid 'plan' value.")
  t.throws(() => a.all(0, -1), "-1 is not a valid 'plan' value.")

  a = new AssertOrder()
  a.step(0)
  a.any(1)
  t.throws(() => a.all(1, 1), "Expecting 'once(2)', 'some(1,2)', 'all(2)', but received 'all(1)'")

  a = new AssertOrder()
  a.step(0)
  a.all(1, 2)
  t.throws(() => a.any(1), "Expecting 'all(1)', but received 'any(1)'")

  a = new AssertOrder()
  a.all(0, 2)
  a.all(0, 2)
  t.throws(() => a.all(0, 2), "Expecting 'once(1)', 'some(1)', 'all(1)', but received 'all(0)'")

  a = new AssertOrder()
  a.all(0, 2)
  t.throws(() => a.all(0, 3), 'The plan count (3) does not match with previous value (2).')

  a = new AssertOrder()
  a.all(0, 1)
  a.step(1)
  a.all(2, 2)
  a.all(2, 2)
  a.step(3)
})
