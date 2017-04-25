import test from 'ava'
import {AssertOrder} from './assertOrder'

test('Testing message for runOnce error case', _t => {
  let a = new AssertOrder();
  _t.throws(() => a.runOnce(1), "Expecting 'runOnce(0)', 'step(0)', 'runAtleastOnce(0)', 'repeatExactCount(0)', 'multiple(0)', but received 'runOnce(1)'")
})

test('Testing message for runAtleastOnce error case', _t => {
  let a = new AssertOrder();
  a.runOnce(0);
  _t.throws(() => a.runAtleastOnce(3), "Expecting 'runOnce(1)', 'step(1)', 'runAtleastOnce(1)', 'repeatExactCount(1)', 'multiple(1)', but received 'runAtleastOnce(3)'")
})

test('Testing message for repeatExactCount error case', _t => {
  let a = new AssertOrder()
  a.runOnce(0);
  _t.throws(() => a.repeatExactCount(3,3), "Expecting 'runOnce(1)', 'step(1)', 'runAtleastOnce(1)', 'repeatExactCount(1)', 'multiple(1)', but received 'repeatExactCount(3)'")
})
