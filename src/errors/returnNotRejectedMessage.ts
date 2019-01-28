export function returnNotRejectedMessage(value: any) {
  return `Expected return promise to be rejected, but it was resolved instead '${value}'`
}
