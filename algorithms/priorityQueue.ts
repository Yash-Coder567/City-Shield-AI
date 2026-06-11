export interface ThreatRecord {
  id: number;
  location: string;
  type: string;
  risk: string;
}

function getPriority(risk: string): number {
  switch (risk) {
    case "High":
      return 3;
    case "Medium":
      return 2;
    default:
      return 1;
  }
}

export class PriorityQueue {
  private heap: ThreatRecord[] = [];

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private heapifyUp(index: number) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);

      if (
        getPriority(this.heap[index].risk) <=
        getPriority(this.heap[parent].risk)
      ) {
        break;
      }

      this.swap(index, parent);
      index = parent;
    }
  }

  private heapifyDown(index: number) {
    const length = this.heap.length;

    while (true) {
      let largest = index;

      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (
        left < length &&
        getPriority(this.heap[left].risk) >
          getPriority(this.heap[largest].risk)
      ) {
        largest = left;
      }

      if (
        right < length &&
        getPriority(this.heap[right].risk) >
          getPriority(this.heap[largest].risk)
      ) {
        largest = right;
      }

      if (largest === index) break;

      this.swap(index, largest);
      index = largest;
    }
  }

  enqueue(threat: ThreatRecord) {
    this.heap.push(threat);
    this.heapifyUp(this.heap.length - 1);
  }

  dequeue(): ThreatRecord | undefined {
    if (this.heap.length === 0) return undefined;

    const max = this.heap[0];
    const end = this.heap.pop();

    if (this.heap.length > 0 && end) {
      this.heap[0] = end;
      this.heapifyDown(0);
    }

    return max;
  }

  getAll(): ThreatRecord[] {
    const copy = new PriorityQueue();

    this.heap.forEach((item) =>
      copy.enqueue(item)
    );

    const result: ThreatRecord[] = [];

    while (true) {
      const threat = copy.dequeue();

      if (!threat) break;

      result.push(threat);
    }

    return result;
  }
}