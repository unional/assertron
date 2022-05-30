import assertron, { AssertionError } from '../index.js'
import { assertThrows, noStackTraceFor } from '../testUtils.js'

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

test(`/d/foo should match d:\\foo`, () => {
  assertron.pathEqual('/d/foo', 'd:\\foo')
})

test('does not contain internal stack trace', () => {
  const err = assertThrows(() => assertron.pathEqual('a', 'b'), AssertionError)
  noStackTraceFor('pathEqual.ts', err)
})
