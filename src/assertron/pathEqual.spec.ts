import assertron from '..'
import { assertThrows } from '../testUtils';

test('path with same style passes', () => {
  assertron.pathEqual('a', 'a')
  assertron.pathEqual('a/b', 'a/b')
  assertron.pathEqual('a\\b', 'a\\b')
})

test('same style different value throws', () => {
  assertThrows(() => assertron.pathEqual('a', 'b'))
})

test('UNIX style matches Windows style', () => {
  assertron.pathEqual('a/b', 'a\\b')
  assertron.pathEqual('a/b/c', 'a\\b\\c')
  assertron.pathEqual('a\\b', 'a/b')
  assertron.pathEqual('a\\b\\c', 'a/b/c')
})

// not supported yet
test.skip(`/d/foo should match d:\\foo`, () => { })
