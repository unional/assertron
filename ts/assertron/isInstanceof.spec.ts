import { isType } from 'type-plus'
import { a, AssertionError } from '../index.js'

it('accepts a class', () => {
  a.isInstanceof(new Number(1), Number)
})

it('works as a assertion', () => {
  class Foo { a = 1 }
  const v: unknown = new Foo()
  a.isInstanceof(v, Foo)

  isType.equal<true, Foo, typeof v>()
})

it('throws if fail', () => {
  a.throws(() => a.isInstanceof(String('a'), Number), AssertionError)
})
