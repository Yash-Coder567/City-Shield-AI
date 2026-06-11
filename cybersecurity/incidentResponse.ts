export function generateResponse(
  risk: string
): string {
  if (risk === "High") {
    return "Dispatch emergency response team";
  }

  if (risk === "Medium") {
    return "Increase monitoring";
  }

  return "Continue surveillance";
}