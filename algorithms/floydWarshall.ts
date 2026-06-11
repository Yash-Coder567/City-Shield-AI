export function floydWarshall(
  graph: number[][]
) {
  const dist = graph.map(row => [...row]);

  const n = dist.length;

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (
          dist[i][k] + dist[k][j] <
          dist[i][j]
        ) {
          dist[i][j] =
            dist[i][k] +
            dist[k][j];
        }
      }
    }
  }

  return dist;
}