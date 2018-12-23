import { pathEqual as isPathEqual } from 'path-equal';
import { NotEqual } from '../errors';

export function pathEqual(actual: string, expected: string) {
  if (!isPathEqual(actual, expected))
    throw new NotEqual(actual, expected)
}
