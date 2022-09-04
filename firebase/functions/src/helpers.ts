export function copyProps(object: unknown, props: string[]) {
  return props.reduce(
    (acum, current) =>
      object[current] !== undefined && object[current] !== null ? { ...acum, [current]: object[current] } : acum,
    {}
  ) as Record<string, unknown>
}
