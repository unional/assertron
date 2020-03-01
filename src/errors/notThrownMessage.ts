import { tersify } from 'tersify'

export function notThrownMessage(value: any) {
  return `Expect function to throw, but it returned '${tersify(value)}' instead.`
}
