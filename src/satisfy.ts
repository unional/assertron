import { createSatisfier, Struct, SatisfierExec, Expecter } from 'satisfier'
import { tersify } from 'tersify'

export class NotSatisfied extends Error {
  constructor(public entries: SatisfierExec[]) {
    super(format(entries).join('\n'))
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

function format(entries: SatisfierExec[]) {
  return entries.map(e => {
    const path = formatPath(e.path)
    return `Expect ${path} to satisfy ${tersify(e.expected)}, but received ${tersify(e.actual)}`
  })
}

function formatPath(entries: string[]) {
  if (entries.length === 0)
    return 'actual'
  const nodes = [...entries]
  if (isIndice(nodes[0])) {
    nodes.unshift('actual')
  }
  return nodes.map(n => isIndice(n) ? n : '.' + n).join('').slice(1)
}

function isIndice(node: string) {
  return /\[\d*\]/.test(node)
}
/**
 * Check if `actual` satisfies criteria in `expected`.
 * @param expected All properties can be a value which will be compared to the same property in `actual`, RegExp, or a predicate function that will be used to check against the property.
 */
export function satisfy<Actual extends Struct>(actual: Actual, expected: Expecter<Partial<Actual>>) {
  const diff = createSatisfier(expected).exec(actual);
  if (diff) {
    throw new NotSatisfied(diff)
  }
}
