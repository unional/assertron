import type { AnyConstructor } from 'type-plus'
import { AssertionError } from '../errors.js'

export function isInstanceof<T extends AnyConstructor>(value: unknown, type: T): asserts value is InstanceType<T> {
  if (value instanceof type) return

  throw new AssertionError(`Expected ${value} to be an instance of ${type.name}`, { ssf: isInstanceof })
}
