export function predictThreat(
  risk: string
): string {
  if (risk === "High") {
    return "Immediate Response Required";
  }

  if (risk === "Medium") {
    return "Continue Monitoring";
  }

  return "Low Priority";
}