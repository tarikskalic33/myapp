import type { PassNode } from './pass.js'
import type { ResourceRegistry } from './resources.js'
import type { FrameGraph } from './graph.js'

// Executor holds the topologically sorted pass list (computed once from the FrameGraph)
// and dispatches them in order every frame. No allocations in execute().
export class Executor {
  private readonly sortedPasses: readonly PassNode[]

  constructor(graph: FrameGraph) {
    this.sortedPasses = graph.build()
  }

  get passNames(): readonly string[] {
    return this.sortedPasses.map(p => p.name)
  }

  // Encode all passes into the command encoder in dependency order.
  execute(encoder: GPUCommandEncoder, registry: ResourceRegistry): void {
    for (const pass of this.sortedPasses) {
      pass.execute(encoder, registry)
    }
  }
}
