export function calculateFrequency(
  text: string
): Record<string, number> {
  const freq: Record<string, number> = {};

  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }

  return freq;
}