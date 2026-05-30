import type { ResourceRegistry } from './resources.js'

export type PassKind = 'COMPUTE' | 'RENDER'

export interface PassNode {
  readonly name: string
  readonly kind: PassKind
  // Resource IDs this pass reads from — used by Kahn's algorithm for dependency edges
  readonly reads: readonly string[]
  // Resource IDs this pass writes to — defines which downstream passes depend on it
  readonly writes: readonly string[]
  execute(encoder: GPUCommandEncoder, registry: ResourceRegistry): void
}
