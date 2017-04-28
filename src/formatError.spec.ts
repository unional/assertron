import test from 'ava'
import * as errFormatter from './formatError'

test('Testing format error function directly',_t => {
  let calledFnName = 'runOnce';
  let possible_moves = {
    runOnce:[0],
    runAtleastOnce:[0],
    repeatExactCount:[0]
  };
  let reverseAlias = {
    runOnce:['step'],
    runAtleastOnce:[],
    repeatExactCount: ['multiple']
  };
  let calledSteps = [1];
  const expected = "Expecting 'runOnce(0)', 'step(0)', 'runAtleastOnce(0)', 'repeatExactCount(0)', 'multiple(0)', but received 'runOnce(1)'";
  const actual = errFormatter.formatError(calledFnName,possible_moves,reverseAlias,...calledSteps);
  _t.is(actual,expected);

});
