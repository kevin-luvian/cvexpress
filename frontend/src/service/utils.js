export function randId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
export function toMb(num) {
  return Math.round((num * 0.000001 + Number.EPSILON) * 100) / 100;
}
