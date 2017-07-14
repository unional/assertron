import test from 'ava'
import AssertError from './assertError'

test('test error format based on input', _t => {
  let reverseAlias = {
    alias1: ['method1', 'method2'],
    alias2: [], // new method
    alias3: ['method3']
  }

  let possibleMoves = {
    alias1: [2],
    alias2: [2],
    alias3: [1, 2]
  }

  let error = new AssertError(possibleMoves, reverseAlias, 'calledMethod', 3, 4, 5);
  console.log(error.message);
  _t.is(error.message, 'Expecting \'alias1(2)\', \'method1(2)\', \'method2(2)\', \'alias2(2)\', \'alias3(1|2)\', \'method3(1|2)\', but received \'calledMethod(3,4,5)\'')
})
