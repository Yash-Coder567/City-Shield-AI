export function knapsack(
  items: {
    zone: string;
    value: number;
    cost: number;
  }[],
  capacity: number
) {
  const selected = [];

  let remaining = capacity;

  const sorted = [...items].sort(
    (a, b) =>
      b.value / b.cost -
      a.value / a.cost
  );

  for (const item of sorted) {
    if (item.cost <= remaining) {
      selected.push(item);
      remaining -= item.cost;
    }
  }

  return selected;
}