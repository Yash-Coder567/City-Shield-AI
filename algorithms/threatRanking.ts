export interface ThreatRecord {
  id: number;
  location: string;
  type: string;
  risk: string;
}

export function rankThreat(risk: string): number {
  switch (risk) {
    case "High":
      return 3;

    case "Medium":
      return 2;

    default:
      return 1;
  }
}

export function sortThreatsByPriority(threats: ThreatRecord[]): ThreatRecord[] {
  return mergeSortByPriority([...threats]);
}

function mergeSortByPriority(threats: ThreatRecord[]): ThreatRecord[] {
  if (threats.length <= 1) return threats;

  const mid = Math.floor(threats.length / 2);

  const left = mergeSortByPriority(threats.slice(0, mid));
  const right = mergeSortByPriority(threats.slice(mid));

  return mergeThreats(left, right);
}

function mergeThreats(
  left: ThreatRecord[],
  right: ThreatRecord[]
): ThreatRecord[] {
  const result: ThreatRecord[] = [];

  while (left.length && right.length) {
    const leftPriority = rankThreat(left[0].risk);
    const rightPriority = rankThreat(right[0].risk);

    if (leftPriority >= rightPriority) {
      result.push(left.shift()!);
    } else {
      result.push(right.shift()!);
    }
  }

  return [...result, ...left, ...right];
}