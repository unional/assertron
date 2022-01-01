import { tersify } from 'tersify'

export function notRejectedMessage(value: any) {
  return `Expected promise to reject, but it resolves with ` + (typeof value === 'string'
    ? `'${value}'` : tersify(value, { maxLength: Infinity }))
}

export function notResolvedMessage(error: any) {
  return `Expected promise to resolve, but it rejects with ` + (typeof error === 'string'
    ? `'${error}'` : error instanceof Error ? error : tersify(error, { maxLength: Infinity }))
}

