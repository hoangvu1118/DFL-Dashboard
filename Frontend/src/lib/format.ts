export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(val);
}

export function formatPercent(val: number): string {
  return `${val.toFixed(1)}%`;
}
