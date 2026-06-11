export function dijkstra(
  graph: Record<string, Record<string, number>>,
  start: string,
  end: string
) {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();

  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  distances[start] = 0;

  while (visited.size < Object.keys(graph).length) {
    let currentNode = "";
    let shortestDistance = Infinity;

    for (const node in distances) {
      if (
        !visited.has(node) &&
        distances[node] < shortestDistance
      ) {
        shortestDistance = distances[node];
        currentNode = node;
      }
    }

    if (!currentNode) break;

    visited.add(currentNode);

    for (const neighbor in graph[currentNode]) {
      const newDistance =
        distances[currentNode] +
        graph[currentNode][neighbor];

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = currentNode;
      }
    }
  }

  const path: string[] = [];

  let current: string | null = end;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    distance: distances[end],
    path,
  };
}