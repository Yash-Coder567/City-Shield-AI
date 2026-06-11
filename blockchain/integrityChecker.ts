export function checkIntegrity(
  status: string
): string {
  return status === "Verified"
    ? "Integrity Maintained"
    : "Integrity Violation";
}