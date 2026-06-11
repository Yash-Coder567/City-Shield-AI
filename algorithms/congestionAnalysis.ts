export function analyzeCongestion(
  congestion: number
): string {
  if (congestion >= 70) {
    return "Heavy";
  }

  if (congestion >= 40) {
    return "Moderate";
  }

  return "Smooth";
}