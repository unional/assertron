import test from 'ava'
import { AssertError } from './assertError'

test('test error format based on input', _t => {
  let reverseAlias = {
    once: ['method1', 'method2'],
    some: [], // new method
    all: ['method3']
  }

  let possibleMoves = {
    once: [2],
    some: [2],
    all: [1, 2]
  }

  let error = new AssertError(possibleMoves, reverseAlias, 'calledMethod', 3, 4, 5);
  _t.is(error.message, "Expecting 'once(2)', 'method1(2)', 'method2(2)', 'some(2)', 'all(1|2)', 'method3(1|2)', but received 'calledMethod(3,4,5)'")
})
