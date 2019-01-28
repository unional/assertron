export function notRejectedMessage(value: any) {
  return `Expected promise to be rejected, but it was resolved instead '${value}'`
}
