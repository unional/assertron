import AssertionError from 'assertion-error';

export function truthy(value: any) {
  if (!value) throw new AssertionError(
    `Expected value to be truthy, but received ${value}`,
    { value },
    truthy
  )
}
