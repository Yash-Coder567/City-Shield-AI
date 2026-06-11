export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export function kruskal(
  nodes: string[],
  edges: Edge[]
) {
  const parent: Record<string, string> = {};

  nodes.forEach((node) => {
    parent[node] = node;
  });

  function find(node: string): string {
    if (parent[node] === node) {
      return node;
    }

    parent[node] = find(parent[node]);

    return parent[node];
  }

  function union(a: string, b: string) {
    parent[find(a)] = find(b);
  }

  const mst: Edge[] = [];

  const sortedEdges = [...edges].sort(
    (a, b) => a.weight - b.weight
  );

  for (const edge of sortedEdges) {
    if (
      find(edge.from) !== find(edge.to)
    ) {
      mst.push(edge);

      union(edge.from, edge.to);
    }
  }

  return mst;
}