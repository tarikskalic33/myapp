import type { PassNode } from './pass.js'

// FrameGraph accumulates PassNodes then produces a topologically sorted execution list.
// build() implements Kahn's algorithm; throws on cycle detection.
export class FrameGraph {
  private readonly passes: PassNode[] = []

  addPass(pass: PassNode): void {
    this.passes.push(pass)
  }

  // Kahn's topological sort:
  // 1. Build adjacency: A depends on B if A.reads ∩ B.writes ≠ ∅
  // 2. Compute in-degree per pass
  // 3. Process zero-in-degree queue
  // 4. Cycle ↔ sorted.length < total
  build(): readonly PassNode[] {
    const n = this.passes.length
    if (n === 0) return []

    // Map pass name → index
    const idx = new Map<string, number>()
    for (let i = 0; i < n; i++) idx.set(this.passes[i].name, i)

    // Build write→pass index: resource ID → index of pass that writes it
    const writtenBy = new Map<string, number>()
    for (let i = 0; i < n; i++) {
      for (const resource of this.passes[i].writes) {
        writtenBy.set(resource, i)
      }
    }

    // adj[i] = set of pass indices that depend on pass i
    const adj: Set<number>[] = Array.from({ length: n }, () => new Set<number>())
    const inDegree = new Array<number>(n).fill(0)

    for (let i = 0; i < n; i++) {
      for (const resource of this.passes[i].reads) {
        const producer = writtenBy.get(resource)
        if (producer !== undefined && producer !== i && !adj[producer].has(i)) {
          adj[producer].add(i)
          inDegree[i]++
        }
      }
    }

    // Enqueue all zero-in-degree passes
    const queue: number[] = []
    for (let i = 0; i < n; i++) {
      if (inDegree[i] === 0) queue.push(i)
    }

    const sorted: PassNode[] = []
    while (queue.length > 0) {
      const current = queue.shift()!
      sorted.push(this.passes[current])
      for (const dep of adj[current]) {
        inDegree[dep]--
        if (inDegree[dep] === 0) queue.push(dep)
      }
    }

    if (sorted.length < n) {
      throw new Error('FrameGraph: cycle detected — frame graph is not a DAG')
    }

    return Object.freeze(sorted)
  }
}
