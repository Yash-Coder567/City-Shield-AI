export function assessRisk(
  risk: string
): string {
  if (risk === "High") {
    return "Critical";
  }

  if (risk === "Medium") {
    return "Warning";
  }

  return "Safe";
}