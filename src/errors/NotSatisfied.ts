import { Diff } from 'satisfier';
import { tersify } from 'tersify';

export function notSatisfiedMessage(entries: Diff[]) {
  return entries.map(e => {
    const path = formatPath(e.path)
    return `Expect ${path} to satisfy ${formatValue(e.expected)}, but received ${formatValue(e.actual)}`
  }).join('\n')
}

function formatPath(entries: (string | number)[]) {
  if (entries.length === 0)
    return 'actual'
  const nodes = [...entries]
  if (isIndice(nodes[0])) {
    nodes.unshift('actual')
  }
  return nodes.map(n => isIndice(n) ? `[${n}]` : '.' + n).join('').slice(1)
}

function isIndice(node: string | number): node is number {
  return typeof node === 'number'
}

function formatValue(value: any) {
  return tersify(value)
}
