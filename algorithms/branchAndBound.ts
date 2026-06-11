interface Task {
  name: string;
  cost: number;
}

export function branchAndBound(
  tasks: Task[],
  budget: number
) {
  let bestPlan: Task[] = [];
  let bestCost = 0;

  function solve(
    index: number,
    currentPlan: Task[],
    currentCost: number
  ) {
    if (currentCost > budget) return;

    if (currentCost > bestCost) {
      bestCost = currentCost;
      bestPlan = [...currentPlan];
    }

    if (index >= tasks.length) return;

    solve(
      index + 1,
      [...currentPlan, tasks[index]],
      currentCost + tasks[index].cost
    );

    solve(
      index + 1,
      currentPlan,
      currentCost
    );
  }

  solve(0, [], 0);

  return {
    bestPlan,
    bestCost,
  };
}