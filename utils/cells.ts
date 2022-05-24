export function cells() {
  return Array(9)
    .fill(0)
    .map((_, i) => 1 << (8 - i))
}
