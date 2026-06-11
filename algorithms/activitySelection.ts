export interface SignalActivity {
  zone: string;
  start: number;
  end: number;
}

export function activitySelection(
  activities: SignalActivity[]
) {
  const sorted = [...activities].sort(
    (a, b) => a.end - b.end
  );

  const selected: SignalActivity[] = [];

  let lastEnd = -1;

  for (const activity of sorted) {
    if (activity.start >= lastEnd) {
      selected.push(activity);
      lastEnd = activity.end;
    }
  }

  return selected;
}