export function predictCongestion(
  current: number
): string {
  if (current >= 70) {
    return "Severe Congestion Expected";
  }

  if (current >= 40) {
    return "Moderate Traffic Expected";
  }

  return "Traffic Flow Normal";
}