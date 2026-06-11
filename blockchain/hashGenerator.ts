export function generateHash(): string {
  return (
    "0x" +
    Math.random()
      .toString(16)
      .substring(2, 10)
      .toUpperCase()
  );
}