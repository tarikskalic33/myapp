// Reads the two AEGIS localStorage chains without importing from shared

export interface TokenRecord {
  call_id: string
  prompt_hash: string
  response_hash: string
  backend: string
  model: string
  latency_ms: number
  ccil_valid: boolean
  session_index: number
}

export interface ProofToken {
  token_id: string
  prev_token_id: string
  chain_hash: string
  ccil_valid: boolean
  product: string
  timestamp_ms: number
  record: TokenRecord
}

export interface LedgerSnapshot {
  chain_hash: string
  total_calls: number
  approved_calls: number
  timestamp_ms: number
}

const V3_KEY = 'aegis_proof_ledger_v3'
const V1_KEY = 'aegis_constitutional_ledger_v1'

const GENESIS_ANCHOR = 'aegis-omega-genesis\x00' +
  String((Math.sqrt(5) - 1) / 2) + '\x00ccil-psi\x001.0.0'

export async function genesisId(): Promise<string> {
  const data = new TextEncoder().encode(GENESIS_ANCHOR)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function readTokenLedger(): ProofToken[] {
  try {
    const raw = localStorage.getItem(V3_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ProofToken[]
  } catch { return [] }
}

export function readSnapshot(): LedgerSnapshot | null {
  try {
    const raw = localStorage.getItem(V1_KEY)
    if (!raw) return null
    return JSON.parse(raw) as LedgerSnapshot
  } catch { return null }
}

export function truncHash(h: string, n = 8): string {
  return h.length > n * 2 + 2 ? `${h.slice(0, n)}…${h.slice(-n)}` : h
}

export function formatTs(ms: number): string {
  const d = new Date(ms)
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
