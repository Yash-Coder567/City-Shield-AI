export function bfs(
  graph: Record<string, string[]>,
  start: string
) {
  const visited = new Set<string>();
  const queue: string[] = [start];
  const result: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;

    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);

      for (const neighbor of graph[node] || []) {
        queue.push(neighbor);
      }
    }
  }

  return result;
}