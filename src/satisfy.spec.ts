import { test } from 'ava'

import { satisfy } from './index'

test('primitive types will pass', t => {
  satisfy(1, 1)
  satisfy('a', 'a')
  satisfy(true, true)
  t.pass()
})

test('primitive types shows value directly in error', t => {
  t.throws(() => satisfy<number>(1, 2), 'Expect actual to satisfy 2, but received 1')

  t.throws(() => satisfy<boolean>(true, false), 'Expect actual to satisfy false, but received true')

  t.throws(() => satisfy<string>('a', 'b'), `Expect actual to satisfy 'b', but received 'a'`)
})

test('empty object will pass any object', t => {
  satisfy({}, {})
  satisfy({ a: 1 }, {})
  t.pass()
})

test('empty object will fail against primitive types', t => {
  t.throws(() => satisfy(1, {} as any), 'Expect actual to satisfy {}, but received 1')
})

test(`actual is array while expected is single entry will check expected on each entry in the array`, t => {
  satisfy([1], 1)
  t.throws(() => satisfy([1, 2], 1), 'Expect actual[1] to satisfy 1, but received 2')
})

test(`expect with shorter array will only check matched indices in actual`, t => {
  satisfy([1, 2], [1])
  t.pass()
  t.throws(() => satisfy([2, 1], [1]), 'Expect actual[0] to satisfy 1, but received 2')
})

test(`array entries are checked`, t => {
  t.throws(() => satisfy([1], [2]), `Expect actual[0] to satisfy 2, but received 1`)
})

test('work with primitive array', t => {
  satisfy([1, 2, 3], [1, 2, 3])
  satisfy([true, false], [true, false])
  satisfy(['a', 'b'], ['a', 'b'])
  t.pass()
})

test(`check deep entry in array`, t => {
  t.throws(() => satisfy([1, { a: { b: 1 } }], [1, { a: { b: 2 } }]), `Expect actual[1].a.b to satisfy 2, but received 1`)
})

test('missing property will fail', t => {
  t.throws(() => satisfy({}, { a: 1 }), `Expect a to satisfy 1, but received undefined`)
})

test('missing property at deeper level', t => {
  t.throws(() => satisfy({ a: {} }, { a: { b: 1 } }), `Expect a.b to satisfy 1, but received undefined`)
})

test('extra property will pass', t => {
  satisfy({ a: 1, b: 2 }, { a: 1 })
  t.pass()
})

test('property not match will fail', t => {
  t.throws(() => satisfy({ a: 1 }, { a: 2 }), `Expect a to satisfy 2, but received 1`)
})

test('regex will match regex', t => {
  satisfy({ a: /foo/ }, { a: /foo/ })
  t.pass()
})

test('regex will be used to match', t => {
  satisfy({ a: 'foo' }, { a: /foo/ })
  t.pass()
})

test('function will use as predicate', t => {
  satisfy({ a: 1 }, { a: a => a === 1 })
  t.pass()
})

test('predicate error should mention path', t => {
  t.throws(() => /* istanbul ignore next */satisfy({ a: 1 }, { a: () => false }), `Expect a to satisfy function () { return false; }, but received 1`)
})

test('deep predicate error should mention path', t => {

  t.throws(() => /* istanbul ignore next */satisfy({ a: { b: 1 } }, { a: { b: b => b === 2 } }), `Expect a.b to satisfy function (b) { return b === 2; }, but received 1`)
})

test('can check parent property', t => {
  class Foo {
    foo = 'foo'
  }
  class Boo extends Foo {
    boo = 'boo'
  }
  const boo = new Boo()
  satisfy(boo, { foo: 'foo' })
  t.pass()
})

test('actual of type any should not have type checking error', t => {
  let actual: any = { a: 1 }
  satisfy(actual, { a: 1 })
  t.pass()
})

test('fsa', t => {
  interface Foo {
    payload: any;
  }
  let action: Foo = {} as any
  satisfy(action, { payload: 1 })
  satisfy(action, { payload: true })
  satisfy(action, { payload: 'a' })
  satisfy(action, { payload: [1, 2, 3] })
  satisfy(action, { payload: ['a', 'b', 'c'] })
  satisfy(action, { payload: ['a', 1, true] })
  satisfy(action, { payload: [null, 3, 4] })
  t.pass()
})
