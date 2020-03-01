import AssertionError from 'assertion-error';
import { every } from 'satisfier';
import a from '..';
import { assertThrows, noStackTraceFor } from '../testUtils';

test('primitive types will pass', () => {
  a.satisfies(1, 1)
  a.satisfies('a', 'a')
  a.satisfies(true, true)
})

test('primitive types shows value directly in error', () => {
  a.throws(() => a.satisfies<number>(1, 2), e => e.message === 'Expect actual to satisfy 2, but received 1')

  a.throws(() => a.satisfies<boolean>(true, false), e => e.message === 'Expect actual to satisfy false, but received true')

  a.throws(() => a.satisfies<string>('a', 'b'), e => e.message === `Expect actual to satisfy 'b', but received 'a'`)
})

test('empty object will pass any object', () => {
  a.satisfies({}, {})
  a.satisfies({ a: 1 }, {})
})

test('empty object will fail against primitive types', () => {
  a.throws(() => a.satisfies(1, {} as any), e => e.message === 'Expect actual to satisfy {}, but received 1')
})

test(`can use satisfier util function such as has()/every()`, () => {
  a.satisfies([1], every(1))
  a.throws(() => a.satisfies([1, 2], every(1)), e => e.message === 'Expect actual[1] to satisfy 1, but received 2')
})

test(`array entries are checked`, () => {
  a.throws(() => a.satisfies([1], [2]), e => e.message === `Expect actual[0] to satisfy 2, but received 1`)
})

test('work with primitive array', () => {
  a.satisfies([1, 2, 3], [1, 2, 3])
  a.satisfies([true, false], [true, false])
  a.satisfies(['a', 'b'], ['a', 'b'])
})

test(`check deep entry in array`, () => {
  a.throws(() => a.satisfies([1, { a: { b: 1 } }], [1, { a: { b: 2 } }]), e => e.message === `Expect actual[1].a.b to satisfy 2, but received 1`)
})

test('missing property will fail', () => {
  a.throws(() => a.satisfies({}, { a: 1 }), e => e.message === `Expect a to satisfy 1, but received undefined`)
})

test('missing property at deeper level', () => {
  a.throws(() => a.satisfies({ a: {} }, { a: { b: 1 } }), e => e.message === `Expect a.b to satisfy 1, but received undefined`)
})

test('extra property will pass', () => {
  a.satisfies({ a: 1, b: 2 }, { a: 1 })
})

test('property not match will fail', () => {
  a.throws(() => a.satisfies({ a: 1 }, { a: 2 }), e => e.message === `Expect a to satisfy 2, but received 1`)
})

test('regex will match regex', () => {
  a.satisfies({ a: /foo/ }, { a: /foo/ })
})

test('regex will be used to match', () => {
  a.satisfies({ a: 'foo' }, { a: /foo/ })
})

test('function will use as predicate', () => {
  a.satisfies({ a: 1 }, { a: a => a === 1 })
})

test('predicate error should mention path', () => {
  a.throws(() => a.satisfies({ a: 1 }, { a: () => false }), e => e.message === `Expect a to satisfy () => false, but received 1`)
})

test('deep predicate error should mention path', () => {
  a.throws(() => a.satisfies({ a: { b: 1 } }, { a: { b: b => b === 2 } }), e => e.message === `Expect a.b to satisfy b => b === 2, but received 1`)
})

test('can check parent property', () => {
  class Foo {
    foo = 'foo'
  }
  class Boo extends Foo {
    boo = 'boo'
  }
  const boo = new Boo()
  a.satisfies(boo, { foo: 'foo' })
})

test('actual of type any should not have type checking error', () => {
  const actual: any = { a: 1 }
  a.satisfies(actual, { a: 1 })
})

test('Work with null in array', () => {
  interface Foo {
    payload: any;
  }
  const action: Foo = { payload: [null, 3, 4] }
  a.satisfies(action, { payload: [null, 3, 4] })
})

test('does not contain internal stack trace', async () => {
  const err = assertThrows(() => a.satisfies({ a: 1 }, { a: 2 }), AssertionError)
  noStackTraceFor('satisfies.ts', err)
})
