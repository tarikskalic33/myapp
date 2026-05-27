//! # AEGIS-Ω CL-Ψ — State-Coherence Routing Fabric
//!
//! EPISTEMIC TIER: T2 (engineering hypothesis)
//! Constitutional root: AdaptivePower(T) ≤ ReplayVerifiability(T)
//!
//! This crate implements deterministic state-coherence routing, audit-trail state
//! machines, algorithmic divergence thresholds, and EU AI Act compliance hooks.
//! No emergent properties. No sovereign claims. T2 competency accumulation only.
//!
//! Phase 6 modules (cech_descent, postnikov_truncation, gerbe_splitter):
//! - Code tier: T2 — deterministic O(N) array operations
//! - Theoretical correspondence claim: T3 — the algebraic topology claim is a
//!   research conjecture and does not grant T0–T2 authority.

pub mod sgm_gate;
pub mod lut_kan;
pub mod rwkv_state;
pub mod lyapunov;
pub mod audit;
pub mod orchestrator;

// Phase 1.1 + 2
pub mod sahoo;
pub mod cloud_bridge;
pub mod devs_scheduler;
pub mod hip_runtime;  // always compiled; HIP calls gated inside by cfg(feature = "hip")

// Phase 3
pub mod ccil_lattice;
pub mod rocblas_gemm;  // always compiled; HIP calls gated inside by cfg(feature = "rocblas")

// Phase 4
pub mod obstruction_monitor;
pub mod poly_scheduler;

// Phase 5
pub mod local_resolver;

// Phase 6
pub mod cech_descent;
pub mod postnikov_truncation;
pub mod gerbe_splitter;
pub mod orchestrator_phase6;

// Phase 7 — production hardening
pub mod profiler;
pub mod compliance;
pub mod orchestrator_phase7;

// Gate 177 — Edge BFT Verifier (T2, WASM-compatible, stateless Ed25519 quorum proof)
pub mod edge_verifier;

// Gate 206 — Causal Confidence Arbiter (T2, prevents hallucination via confidence bounding)
pub mod causal_arbiter;

// Gate 207 — Adaptive Lineage Compaction Engine (T2, reduces memory footprint while preserving audit trail)
pub mod lineage_compactor;

// Gate 207 — Pyramidal Stack Engine (T2, computes cumulative causal capacity using square pyramidal numbers)
pub mod pyramidal_stack;

// Gate 207 — Dodecagonal Mesh Engine (T2, transforms pyramid into 12-fold quasicrystalline lattice)
pub mod dodecagonal_mesh;
// Gate 208 — Geometric Variance Engine (T2, replaces scalar sums with tensor-alignment metrics)
pub mod geometric_variance;

// Gate 208 — Triadic Merkle-Patricia Node (T2, gates state mutations behind geometric variance checks)
pub mod triadic_merkle_node;

// Gate 208 — Holonic State Machine (T2, orchestrates 3-layer escalation with BFT consensus)
pub mod holonic_state;

// Gate 211 — Orthogonal Domain Verifier (T2, |dot(C,O)| < ε enforces D0 ∩ D1 = ∅)
pub mod orthogonal_verifier;

// Gate 212 — Dodecagonal Symmetry Router (T2, 12-fold symmetric routing mesh, integer BFS)
pub mod dodecagonal_router;

// Gate 213 — Proportional Unit Metric (T2, rational arithmetic grid, SQUARED_SUM_K8=204)
pub mod proportional_metric;

// Gate 214 — Vortex Sequence Classifier (T2, digital root cycle detection, Triadic/Hexadic)
pub mod vortex_classifier;

// Gate 215 — Abjad Letter Encoder (T2, letter→integer routing via Abjad values, طارق=310)
pub mod abjad_encoder;

// Gate 216 — Tajweed Phonological DFA (T1, empirically validated Arabic phonology)
// Makharij articulation points = acoustic eigenstates. 4 noon-sakinah/tanween rules.
// Clinical studies: 27.3% cortisol reduction, alpha/theta EEG, vagal stimulation confirmed.
pub mod tajweed_dfa;

// Gate 217 — Ring Composition Verifier (T1, chiastic A-B-C-B'-A' structure)
// Isomorphic to AdaptivePower(T) ≤ ReplayVerifiability(T) — the constitutional law is a ring.
pub mod ring_composition;

// Gate 220 — Compile-Time Acyclic DAG Lattice + Lawvere Metric + Homotopy Witness (T1/T2)
// Cycles are unrepresentable: VerifiedEdge<From,To> requires From::RANK < To::RANK at compile time.
// Lawvere enrichment: d(A,C) ≤ d(A,B) + d(B,C) — triangle inequality by additive composition.
// HomotopyWitness: structural endpoint equality (T2 code / T3 full HoTT claim).
pub mod lattice_dag;

// Gate 220 (cont.) — Sovereign Persistence Layer (SPSF) (T2)
// Disk-boundary determinism: sequence-monotone, hash-chained, BTreeMap-indexed writes.
// Genesis root verified at open(); divergence from expected root is rejected (not ignored).
pub mod spsf;

// Gate 221 — Constitutional Convergence Certifier (T1/T2)
// 1/φ ≈ 0.6180339887 governs three scales: edge divergence (SUBATOMIC), path safety (MOLECULAR),
// swarm quorum (ORGANISM). certify_path<P>() proves AdaptivePower(T) ≤ ReplayVerifiability(T).
// RankSpan vortex classification: digital_root → Triadic {3,6,9} vs Hexadic {1,2,4,5,7,8}.
pub mod phi_convergence;

// Gate 222 — Constitutional Resonance Monitor (T1/T2)
// Unifies phi_convergence + ring_composition + vortex_classifier + spsf monotone law.
// is_resonant iff phi_convergent AND ring_valid AND sequence_monotone (three T1 invariants).
// resonance_coefficient = depth × vortex_factor × phi_headroom; > 5.0 → certified path.
pub mod resonance_monitor;

// Gate 223 — Constitutional Chord (T2)
// Compact 4-byte spectral fingerprint of constitutional state for distributed resonance checks.
// chord_bytes: [vortex_family, digital_root, resonance_depth, phi_class]
// chords_in_resonance(a, b): same VortexFamily + same PhiClass → compatible resonance class.
pub mod constitutional_chord;

// Gate 224 — Constitutional Chord Network (T2)
// Peer table tracking chord fingerprints across multiple nodes. Detects UNIFIED / CLUSTERED / SPLIT.
// BTreeMap<node_id, ConstitutionalChord> — deterministic iteration. Integer 1/φ quorum threshold.
// find_dissonant() identifies drift nodes; quorum_triadic checks the 1/φ Triadic majority.
pub mod chord_network;

// Gate 225 — Constitutional Self-Certification — Autopoietic State Closure (T1/T2)
// The system certifies its own constitutional state: SHA-256(resonance + network + version).
// CertificationVerdict: Certified / ProvisionallyGranted / Uncertified.
// Deterministic: same inputs → same self_hash across all platforms. No clock, no RNG.
pub mod self_certification;

// Gate 227 — Lattice Coherence: moduli tower global section checker (T2)
// ObstructionLevels × CoherenceReport × Fibonacci weights.
// GlobalSection exists iff all 5 tower levels simultaneously satisfied.
pub mod lattice_coherence;

// Gate 228 — Coherence Broadcaster: encode CoherenceReport as 16-byte gossip frame (T2)
// Bridges lattice_coherence → peer broadcast. Deterministic fixed-point encoding.
pub mod coherence_broadcaster;

// Gate 229 — Epoch Coherence Chain: hash-linked CoherenceFrame history (T2)
// Temporal dimension of the moduli tower. Continuously coherent = martingale holds.
// SHA-256(epoch ‖ frame ‖ prev_hash). Breach detection. Terminal hash certification.
pub mod epoch_coherence_chain;

// Gate 231 — Constitutional Autonode: unified T2 state machine (resonance + cert + coherence + chain)
// One tick() = full constitutional cycle. AdaptivePower(T) ≤ ReplayVerifiability(T) made concrete.
pub mod constitutional_autonode;

// Gate 232 — Swarm Autonode: N-node constitutional consensus at 1/φ quorum threshold (T2)
// Organism-scale layer. consensus_hash = SHA-256(all chain_entry_hashes, BTreeMap order).
pub mod swarm_autonode;

// Gate 233 — Constitutional Replay: State_t = Replay(Lineage_{0→t}) at organism scale (T2)
// ReplayChain + ReplayProof: terminal_hash and replay_fingerprint are tamper-evident proofs.
pub mod constitutional_replay;

// Gate 234 — Entropy Budget: AdaptivePower(T) ≤ ReplayVerifiability(T) as numerical ledger (T2)
// Hash-linked BudgetEntry chain. consume_adaptive() blocked if balance < ADAPTIVE_EVENT_COST.
pub mod entropy_budget;

// Gate 235 — Drift Classifier: D0–D4 constitutional drift severity system (T2)
// DriftHistory: hash-linked records. D2+: mutation authority suspended.
pub mod drift_classifier;

// Gate 236 — Governance Pipeline: field-scale integration of all constitutional substrates (T2)
// process() = entropy check → autonode tick → drift classify → budget → replay chain.
pub mod governance_pipeline;

// Gate 237 — Swarm Health Monitor (T2, unified constitutional health verdict across swarm)
pub mod swarm_health;

// Gate 238 — Divergence Oracle: classifies constitutional drift between health epochs (T2)
// Stable/Nominal/Elevated/Critical/Terminal. adaptive_permitted() blocks at Critical+.
pub mod divergence_oracle;

// Gate 239 — Resilience Watchdog: rolling-window constitutional stability tracker (T2)
// Recovering/Stable/Oscillating/Degrading/Insufficient. oscillation_count ≥ 2 → intervention.
pub mod resilience_watchdog;

// Gate 240 — Constitutional Pulse: compact 3-byte epoch health signal (T2)
// Green/Yellow/Red triad from HealthVerdict + ResilienceVerdict + DivergenceClass.
// PulseChain hash-linked by SHA-256(prev ‖ pulse_bytes[3] ‖ epoch_be8).
pub mod constitutional_pulse;

// Gate 241 — Adaptive Threshold Engine: dynamic constitutional alert thresholds (T2)
// ThresholdProfile derived from rolling baseline × 1/φ. Clear/EntropyAlert/CoherenceAlert/BothAlert.
pub mod adaptive_threshold;

// Gate 242 — Quorum Drift Detector: quorum transition tracking across epochs (T2)
// QuorumLost/QuorumRestored events. longest_absence tracks worst-case quorum gap.
pub mod quorum_drift;

// Gate 243 — Entropy Forecast Engine: predicts epochs until entropy exhaustion (T2)
// DrainRate from observation window. ExhaustionRisk: Immediate/Imminent/Moderate/Low/None.
pub mod entropy_forecast;

// Gate 244 — Coherence Stability Index: rolling integer stability score 0–100 (T2)
// StabilityGrade A/B/C/D/F from global_section_rate + satisfied_rate + score_avg.
pub mod coherence_stability;

// Gate 245 — Constitutional Momentum Tracker: signed directional trend signal (T2)
// MomentumDir: Improving/Stable/Declining. momentum_int = score[last] - score[first].
pub mod momentum_tracker;

// Gate 246 — Phase Transition Detector: constitutional regime change detection (T2)
// ConstitutionalPhase: Nominal/Degraded/Recovery/Critical. Recovery = improving from Critical+.
pub mod phase_transition;

// Gate 247 — Constitutional Health Aggregator: unified system health vector (T2)
// SystemHealthVector: health_verdict + resilience_verdict + pulse_verdict + stability_grade + momentum_dir + phase.
// OverallCondition: Optimal/Good/Caution/Alert/Emergency. vector_hash = SHA-256(prev ‖ condition ‖ degraded_count ‖ epoch).
pub mod health_aggregator;

// Gate 248 — Constitutional Health Dashboard: epoch-by-epoch DashboardFrame (T2)
// DashboardFrame: vector + phase + momentum + OverallTrend. Thriving/Stable/Concerning/Critical.
// frame_hash = SHA-256(prev ‖ condition_byte ‖ trend_byte ‖ epoch_be8).
pub mod health_dashboard;

// Gate 249 — Epoch Health Ledger: tamper-evident running health record (T2)
// HealthLedgerEntry per epoch; ledger_hash = SHA-256(prev ‖ frame_hash ‖ condition ‖ epoch).
// worst_condition(), critical_epoch_count(), thriving_epoch_count(), verify_chain().
pub mod epoch_health_ledger;

// Gate 250 — Constitutional Alert Engine: AlertSeverity classification + hash-linked AlertLog (T2)
// None/Info/Warn/Critical/Emergency from OverallCondition × OverallTrend.
// alert_hash = SHA-256(prev ‖ severity_byte ‖ condition_byte ‖ epoch_be8).
pub mod alert_engine;

// Gate 251 — Intervention Recommender: ranked remediation actions + PlanHistory (T2)
// InterventionKind: MonitorOnly/TightenThresholds/ForceResilient/QuorumRecovery/PulseReset/PhaseRecovery/EmergencyHalt.
// plan_hash = SHA-256(prev ‖ severity_byte ‖ top_priority_byte ‖ epoch_be8).
pub mod intervention_recommender;

// Gate 252 — Recovery Sequencer: time-ordered step execution with progress hash (T2)
// RecoveryStep: kind + priority + StepStatus (Pending/InProgress/Completed/Skipped).
// advance_step() recomputes step_hash chain. sequence_hash = SHA-256(all step_hashes ‖ epoch).
pub mod recovery_sequencer;

// Gate 253 — Constitutional Audit Certifier: AuditCertificate over (VectorHistory, AlertLog, PlanHistory) (T2)
// chains_valid, peak_condition, peak_severity, certificate_hash = SHA-256(3 terminals ‖ epoch_end).
pub mod audit_certifier;

// Gate 254 — Constitutional Telemetry Encoder: 32-byte gossip packet (T2)
// TelemetryPacket: epoch(8) ‖ condition(1) ‖ trend(1) ‖ severity(1) ‖ phase(1) ‖ dir(1) ‖ degraded(1) ‖ momentum(2) ‖ checksum(8) ‖ frame_hash_prefix(8).
pub mod telemetry_encoder;

// Gate 255 — Gossip Broadcaster: signed GossipMessage for peer broadcast (T2)
// GossipMessage: node_id(4) ‖ sequence(8) ‖ TelemetryPacket(32) ‖ mac(8) = 52 bytes.
// GossipLog: BTreeMap<node_id, highest_sequence>; append validates MAC + monotone sequence.
pub mod gossip_broadcaster;

// Gate 256 — Gossip Router: multi-hop peer routing with deduplication and TTL (T2)
// RoutingTable: BTreeMap<peer_id, PeerEntry> + BTreeMap<(node_id, seq), ()> seen set.
// route() → Forward(peer_ids) | Drop(AlreadySeen|TtlExpired|NoPeers|SelfMessage).
pub mod gossip_router;

// Gate 257 — Peer Manifest: signed peer identity + capability advertisement (T2)
// PeerManifest: node_id + epoch + capabilities(bitmask) + phase + manifest_hash.
// PeerRegistry: BTreeMap<node_id, manifest>; register validates hash + monotone epoch.
pub mod peer_manifest;

// Gate 258 — Swarm Topology Snapshot: hash-linked mesh state capture (T2)
// TopologySnapshot: peer_count + operational_count + cap counts + max_epoch + prev_hash.
// quorum_reached(): operational/total >= 1/φ (integer arithmetic). TopologyLog chains snapshots.
pub mod swarm_topology;

// Gate 259 — Constitutional Beacon: 16-byte self-broadcast frame (T2)
// BeaconFrame: epoch(8) ‖ node_id_byte(1) ‖ phase(1) ‖ capabilities(1) ‖ quorum(1) ‖ checksum(4).
// BeaconLog: hash-chained records; append validates checksum + monotone epoch.
pub mod constitutional_beacon;

// Gate 260 — Epoch Synchronizer: cross-peer epoch alignment + lag detection (T2)
// SyncRecord: local vs max_peer_epoch; alignment = Synchronized/LocalLagging/LocalLeading/NoPeers.
// SyncLog: hash-chained records; lag_count(), max_lag(), synchronized_count().
pub mod epoch_synchronizer;

// Gate 261 — Consensus Ledger: distributed vote log with quorum certification (T2)
// VoteEntry + ConsensusRound: BTreeMap<voter_id, vote>; quorum at 1/φ threshold.
// ConsensusCertificate + ConsensusLedger: hash-chained round certifications.
pub mod consensus_ledger;

// Gate 262 — Node State Machine: per-node lifecycle automaton (T2)
// NodeState: Initializing→Active→Degraded→Recovery→Halted; transition adjacency enforced.
// NodeHistory: hash-chained NodeRecords; degraded_count(), recovery_count(), verify_chain().
pub mod node_state_machine;

// Gate 263 — Fault Detector: mesh-wide fault pattern classifier (T2)
// FaultClass: None/Isolated/Correlated/Cascading from per-epoch degradation analysis.
// FaultLog: hash-chained FaultReports; cascading_count(), max_degraded_count().
pub mod fault_detector;

// Gate 264 — Mesh Census: periodic peer mesh population snapshot (T2)
// CensusRecord: epoch + node counts by state + capability counts + health_ratio_pct + SHA-256 chain.
// CensusLog: hash-chained CensusRecords; min_health_pct(), trend(), verify_chain().
pub mod mesh_census;

// Gate 265 — Recovery Planner: ranked recovery action sequences for degraded mesh (T2)
// RecoveryAction: kind (MonitorOnly/Isolate/Restart/ReduceLoad/ActivateSpare/PartialQuorum/Halt) + priority + target.
// RecoveryPlan: epoch + fault_class + sorted actions + SHA-256 chain. PlanLog: hash-chained plans.
pub mod recovery_planner;

// Gate 266 — Quorum Guard: real-time quorum health monitoring with alert levels (T2)
// QuorumLevel: Healthy(≥70%) / AtThreshold(≥1/φ) / BelowQuorum / NoNodes.
// QuorumGuard: hash-chained QuorumStatus records; alert_epochs(), longest_outage(), latest_delta().
pub mod quorum_guard;

// Gate 267 — Health Ticker: epoch-by-epoch condensed 3-byte health signal (T2)
// TickerFrame[3]: quorum_level(1) ‖ health_pct(1) ‖ fault_class:4|top_action:4(1).
// TickerLog: hash-chained TickerRecords; healthy_count(), alert_count(), verify_chain().
pub mod health_ticker;

// Gate 268 — Mesh Ledger: cross-module tamper-evident epoch ledger (T2)
// MeshEntry: epoch + census/fault/plan/quorum/ticker hashes + SHA-256 chain.
// MeshLedger: hash-chained MeshEntries; entry_count(), terminal_hash(), verify_chain().
pub mod mesh_ledger;

// Gate 269 — Capability Negotiator: peer capability advertisement + intersection (T2)
// NegotiationResult: local∩peer bitmask; gossip_ok/consensus_ok/relay_ok/audit_ok flags.
// NegotiationLog: hash-chained results per (local,peer) pair; capability_stable(), verify_chain().
pub mod capability_negotiator;

// Gate 270 — Epoch Sealer: terminal epoch seal across all gossip subsystems (T2)
// EpochSeal: epoch + ledger/consensus/topology/sync hashes + SHA-256 chain.
// SealChain: hash-chained EpochSeals; terminal_seal_hash(), seal_count(), verify_chain().
pub mod epoch_sealer;

// Gate 271 — Gossip Scheduler: Fibonacci-paced gossip interval calculator (T2)
// fibonacci(n) capped at F_11=89; interval_ms = F(n)*100ms. GossipSchedule: hash-chained intervals.
// next_interval_ms(), total_elapsed_ms(), verify_chain(). Mirrors TypeScript Gate 124.
pub mod gossip_scheduler;

// Gate 272 — Spread Estimator: gossip message propagation reach estimator (T2)
// estimate_reach(): geometric series 1+f+f^2+...+f^ttl, saturating integer, capped at total_nodes.
// hops_to_quorum(): min hops for 1/φ quorum. EstimateLog: hash-chained SpreadEstimates.
pub mod spread_estimator;

// Gate 273 — Fanout Controller: adaptive gossip fanout based on mesh health (T2)
// FanoutPolicy: Conservative(2)/Standard(3)/Aggressive(5)/Maximum(8) selected from QuorumLevel + health_ratio.
// FanoutLog: hash-chained FanoutDecisions; average_fanout(), max_fanout(), aggressive_epoch_count().
pub mod fanout_controller;

// Gate 274 — Backpressure Monitor: per-peer gossip rate tracking and backpressure decisions (T2)
// Accept(≤70%) / Throttle(71–100%) / Drop(>100% capacity). BackpressureRegistry: BTreeMap<peer_id, PeerRateLog>.
// global_drop_count(), global_throttle_count(), peer_decision(). PeerRateLog: hash-chained records.
pub mod backpressure_monitor;

// Gate 275 — Dedup Cache: epoch-scoped gossip message deduplication (T2)
// DedupCache: BTreeMap<(node_id,seq), seen_epoch>. New/Duplicate/EpochTooOld/EpochTooFuture.
// advance_epoch() evicts entries older than current_epoch - max_epoch_lag. hit_rate_pct().
pub mod dedup_cache;

// Gate 276 — Latency Tracker: per-peer round-trip latency estimation with rolling window (T2)
// LatencyTier: Fast(≤50ms)/Normal(≤200ms)/Slow(≤500ms)/Timeout(>500ms).
// PeerLatencyLog: circular buffer window[8], hash-chained records. LatencyRegistry: BTreeMap<peer_id>.
pub mod latency_tracker;

// Gate 277 — Gossip Priority Queue: deterministic outbound message scheduling (T2)
// Score = ttl*urgency*fanout/(elapsed+1). Urgent(≥1000)/High(≥500)/Normal(≥100)/Low.
// GossipPriorityQueue: BTreeMap<(-score,id),msg>; dequeue_batch(), discard_expired(), peek_top().
pub mod gossip_priority;

// Gate 278 — Peer Reputation Scorer: integer 0–100 reputation tracking (T2)
// ReputationTier: Blocked(0-19)/Suspicious/Neutral/Good/Trusted(80-100). Initial score=50.
// ReputationLedger: BTreeMap<peer_id, PeerReputation>; trusted_peers(), blocked_peers(), weakest_peer().
pub mod peer_reputation;

// Gate 279 — Mesh Supervisor: epoch-level gossip subsystem integration snapshot (T2)
// MeshSupervisionRecord: fanout+drops+spread+quorum+reputation+queue in one tamper-evident hash.
// MeshSupervisionLog: hash-chained; min_reach_pct(), max_drop_count(), quorum_loss_epochs().
pub mod mesh_supervisor;

// Gate 280 — Gossip Epoch Finalizer: terminal gossip state seal at epoch close (T2)
// GossipEpochSeal: supervision+scheduler+spread hashes + peer counts in SHA-256 chain.
// GossipEpochChain: append(), terminal_hash(), seal_count(), verify_chain().
pub mod gossip_epoch_finalizer;

// Gate 281 — Mesh Convergence Certifier: multi-epoch gossip stability proof (T2)
// CONVERGENCE_WINDOW_SIZE=3 epochs. EpochSnapshot::satisfies_convergence() checks 4 conditions.
// ConvergenceCertifier: sliding window → ConvergenceCertificate per full window.
// consecutive_converged_count(), verify_chain(). Chain via SHA-256(prev‖fields).
pub mod convergence_certifier;

// Gate 282 — Gossip Topology Prober: active mesh connectivity probing (T2)
// ProbeResult: Success{rtt_ms}/Timeout/Refused/NoRoute. ProbeLog: hash-chained per (prober,target).
// ProbeMatrix: BTreeMap<(prober_id,target_id), ProbeLog>; reachable_from(), avg_mesh_rtt().
pub mod gossip_prober;

// Gate 283 — Mesh Partition Detector: network partition classification from probe evidence (T2)
// PartitionClass: Unified/Asymmetric/Clustered/Isolated(u32)/Unknown.
// detect_partition(): BFS component analysis + symmetry check, integer arithmetic.
// PartitionLog: hash-chained PartitionReports; longest_non_unified_run(), unified_count().
pub mod partition_detector;

// Gate 284 — Gossip Bandwidth Tracker: per-peer byte budget enforcement (T2)
// BandwidthDecision: Allow/Throttle/Deny based on bytes_used vs budget_bytes per epoch.
// PeerBandwidthLog: hash-chained epoch records; utilization_pct, over_budget_epochs().
// BandwidthRegistry: BTreeMap<peer_id>; request_bytes(), seal_epoch() persists to log.
pub mod bandwidth_tracker;

// Gate 285 — Gossip Flood Guard: per-source message rate limiting with penalty escalation (T2)
// FloodLevel: Clean(≤50)/Warning(≤100)/Blocking(≤500)/Banned(>500). should_drop() for Banned/Blocking.
// FloodLog: hash-chained FloodRecords; worst_level(), banned_epoch_count(), total_dropped().
// FloodGuard: BTreeMap<source_id>; observe_message(), seal_epoch(), sources_at_level().
pub mod flood_guard;

// Gate 286 — Gossip TTL Enforcer: per-message hop-count enforcement with inflation detection (T2)
// TtlDecision: Forward{remaining_ttl}/Drop{Expired|Inflated|TooHigh}. MAX_INITIAL_TTL=15.
// TtlEnforcer: BTreeMap<message_id>; register_origin(), forward() chains hash-linked records.
// Inflation detected when claimed_ttl > (current_ttl - 1). expired_count(), inflated_count().
pub mod ttl_enforcer;

// Gate 287 — Gossip Epoch Auditor: cross-module epoch consistency verification (T2)
// AuditFinding: Consistent/Lagging{by}/Leading{by}/Diverged. MAX_LAG_ALLOWED=3.
// audit_epoch() checks [supervisor, finalizer, scheduler, prober, bandwidth] in order.
// EpochAuditLog: hash-chained records; consistent_epoch_count(), diverged_epoch_count(), verify_chain().
pub mod epoch_auditor;

// Gate 288 — Gossip Reputation Decay: epoch-based reputation erosion for inactive peers (T2)
// DecayReason: Inactive(−3)/Overdue(−5)/Unreachable(−8). Saturating score 0–100. Initial=50.
// PeerDecayLog: hash-chained per-peer decay records; total_decayed(), min_score(), verify_chain().
// DecayEngine: BTreeMap<peer_id>; apply_decay(), bulk_decay(), peers_below(threshold).
pub mod reputation_decay;

// Gate 289 — Gossip Message Authenticator: epoch-keyed message integrity tagging (T2)
// AuthTag = first 16 bytes of SHA-256(peer_be4‖epoch_be8‖session_key[16]‖msg_id_be8‖payload_hash[32]).
// AuthLog: hash-chained valid/forgery records per peer; valid_count(), forgery_count(), verify_chain().
// MessageAuthenticator: BTreeMap<peer_id>; tag_message(), verify_message(), total_forgeries().
pub mod message_authenticator;

// Gate 290 — Gossip Epoch Rate Limiter: token-bucket rate limiting per source per epoch (T2)
// BUCKET_CAPACITY=200 tokens/source/epoch. Allowed/RateLimited. Refill at epoch boundary.
// BucketLog: hash-chained per-source epoch records; total_allowed(), drop_rate_pct(), verify_chain().
// EpochRateLimiter: BTreeMap<source_id>; consume(), seal_epoch(), sources_over_limit().
pub mod epoch_rate_limiter;

// Gate 291 — Gossip Peer Selector: topology-aware peer selection for gossip forwarding (T2)
// SelectionCriteria: sender_id, max_fanout, min_score, max_latency_tier. Deterministic (no RNG).
// select_peers(): score-descending sort, ties broken by peer_id asc; result sorted ascending.
// SelectionLog: hash-chained records; avg_selected_count(), zero_selection_count(), verify_chain().
pub mod peer_selector;

// Gate 292 — Gossip Epoch Integrator: cross-subsystem epoch close coordination (T2)
// EpochIntegrationInput: flood/ttl/bandwidth/audit/rate-limiter/decay summaries in one struct.
// health_score = 100 - penalties (flood_banned:−20, ttl_inflated:−15, !audit:−30, bw_denied>3:−15).
// IntegrationChain: hash-chained records; healthy_epoch_count(), avg_health_score(), verify_chain().
pub mod epoch_integrator;

// Gate 293 — Gossip Session Tracker: per-peer session lifecycle management (T2)
// SessionState: Open→Active→Suspended→Closed. Illegal transitions rejected with InvalidTransition.
// SessionRecord: hash-chained (peer_id, session_id, epoch, from_state, to_state).
// SessionHistory: transition(), current_state(), suspended_count(), verify_chain().
// SessionRegistry: BTreeMap<(peer_id, session_id)>; open_session(), active_sessions(), closed_session_count().
pub mod session_tracker;

// Gate 294 — Gossip Backpressure Controller: downstream-load-aware injection throttling (T2)
// PressureLevel: Normal (≤100), Moderate (≤500), Severe (>500). Allowance fractions: 100/50/10%.
// BackpressureLog: hash-chained events per peer; severe_count(), moderate_count(), verify_chain().
// BackpressureController: update(queue_depth)→(level, granted); tick_recovery(); peers_under_pressure().
pub mod backpressure_controller;

// Gate 295 — Gossip Message Deduplicator: epoch-scoped duplicate suppression (T2)
// DedupDecision: Fresh / Duplicate. Seen-set keyed by (peer_id, message_id) per epoch.
// Epoch rollover clears seen-set. DedupLog: hash-chained; total_seen(), dup_rate_pct().
// MessageDeduplicator: observe(), seal_epoch(), dup_rate_current().
pub mod message_deduplicator;

// Gate 296 — Gossip Adaptive Fanout Controller: delivery-rate-aware fanout tuning (T2)
// Distinct from fanout_controller (Gate 273): this one uses delivery success rate (delivered/attempted).
// Thresholds: <60%→Increase, >90%→Decrease; clamped [MIN=2, MAX=16], STEP=1.
// FanoutLog: hash-chained; increase_count(), decrease_count(), avg_fanout(), verify_chain().
pub mod adaptive_fanout_controller;

// Gate 297 — Gossip Epoch Boundary Detector: network-wide epoch transition coordination (T2)
// BoundaryPhase: Stable / Transitioning (≥67% peers advanced) / Committed (all advanced).
// BoundaryLog: hash-chained events; transition_count(), committed_count(), verify_chain().
// EpochBoundaryDetector: report_peer_epoch(), evaluate(current_epoch), trigger_boundary().
pub mod epoch_boundary_detector;

// Gate 298 — Gossip Link Quality Monitor: per-peer EMA latency tracking and tier classification (T2)
// LatencyTier: Excellent(≤10)/Good(≤30)/Fair(≤100)/Poor/Timeout. EMA α=1/4 (integer).
// LinkQualityLog: hash-chained; timeout_count(), tier_count(), verify_chain().
// LinkQualityMonitor: sample(), sample_timeout(), current_tier(), peers_at_tier().
pub mod link_quality_monitor;

// Gate 299 — Gossip Message Priority Queue: urgency-ordered message scheduling (T2)
// PriorityClass: Critical(0)/High(1)/Normal(2)/Low(3). Capacity=64, CriticalReserve=8.
// VecDeque sorted by (priority ASC, enqueue_seq ASC). Evicts lowest-priority non-Critical on overflow.
// QueueRecord: hash-chained; enqueue/dequeue/evict operations tracked.
// MessagePriorityQueue: enqueue(), dequeue(), verify_chain(), stats.
pub mod message_priority_queue;

// Gate 300 — Gossip Peer Scoring Engine: composite peer quality scoring for selection decisions (T2)
// Sub-scores: latency_tier→[0..25], reputation_pct→[0..25], delivery_pct→[0..25], uptime→[0..25].
// composite = sum of four sub-scores, saturating at 100.
// ScoreLog: hash-chained per peer; avg/min/max/verify_chain.
// PeerScoringEngine: update_score(), composite_score(), top_peers(n), all_scores().
pub mod peer_scoring_engine;

// Gate 301 — Gossip Routing Table: per-peer next-hop route management with hash-chained audit (T2)
// RouteOperation: Insert/Update/Remove. Stores (destination→(next_hop, metric)) in BTreeMap.
// MAX_ROUTES=256. RouteLog: hash-chained; insert/update/remove counts, verify_chain.
// RoutingTable: insert(), remove(), lookup(), all_routes(). Log embedded.
pub mod routing_table;

// Gate 302 — Gossip Heartbeat Tracker: per-peer liveness via periodic beat monitoring (T2)
// PeerStatus: Alive/Suspect(≥3 misses)/Dead(≥6 misses). HeartbeatEvent: Beat/Miss.
// HeartbeatLog: hash-chained per peer; beat_count, miss_count_total, verify_chain.
// HeartbeatTracker: beat(), tick_miss(), status(), suspect_peers(), dead_peers(), alive_peers().
pub mod heartbeat_tracker;

// Gate 303 — Gossip Token Bucket: integer token bucket rate-limiting per peer (T2)
// BucketDecision: Allow/RateLimited. DEFAULT_CAPACITY=100, DEFAULT_REFILL_RATE=10.
// TokenBucket: consume(), tick_refill(), tokens(), is_full(). Integer only, no f64.
// BucketLog: hash-chained; allow_count, rate_limited_count, verify_chain.
// TokenBucketRegistry: consume(peer, epoch), tick_refill_all(), tokens(), get_log().
pub mod token_bucket;

// Gate 304 — Gossip Message Fragmenter: split/reassemble large messages into fixed-size fragments (T2)
// FRAGMENT_SIZE=256, MAX_FRAGMENTS=64. Fragment: message_id, fragment_index, total_fragments, payload_hash.
// fragment_message() splits data into fragments. FragmentError: MessageTooLarge/EmptyPayload/etc.
// ReassemblyBuffer: insert() returns Ok(Some(data)) when complete, Ok(None) when waiting.
pub mod message_fragmenter;

// Gate 305 — Gossip Topic Subscription Registry: peer topic interest tracking (T2)
// SubEvent: Subscribe/Unsubscribe. MAX_TOPICS_PER_PEER=64.
// SubLog: hash-chained per peer; subscribe_count, unsubscribe_count, verify_chain.
// TopicSubscriptionRegistry: subscribe(), unsubscribe(), is_subscribed(),
//   topics_for(peer) sorted, peers_for_topic(topic) sorted.
pub mod topic_subscription;

// Gate 306 — Gossip Nonce Cache: replay-attack prevention via sliding window nonce tracking (T2)
// NonceDecision: Fresh/Replay. WINDOW_EPOCHS=8. BTreeMap<epoch, BTreeSet<(peer, nonce)>>.
// Evicts epochs older than current - WINDOW_EPOCHS on advance.
// NonceLog: hash-chained; fresh_count, replay_count, verify_chain.
// NonceCache: check(peer, epoch, nonce), advance_epoch(), window_size().
pub mod nonce_cache;

// Gate 307 — Gossip Peer Blocklist: temporary and permanent peer banning (T2)
// BanReason: ManualBan/ExcessiveMisses/ReplayAttack/RateLimitViolation/PermanentBan.
// BanAction: Ban/Unban/Expire. DEFAULT_BAN_DURATION_EPOCHS=10, MAX_BLOCKLIST_SIZE=256.
// BanLog: hash-chained (global); ban_count, unban_count, verify_chain.
// PeerBlocklist: ban(duration=None→permanent), unban(), is_banned(epoch),
//   expire_bans(epoch), banned_peers(epoch) sorted, blocklist_size().
pub mod peer_blocklist;

// Gate 308 — Gossip Message Acknowledgment Tracker: per-message delivery confirmation (T2)
// AckStatus: Pending/Acked/TimedOut. ACK_TIMEOUT_EPOCHS=5, MAX_PENDING_PER_PEER=128.
// AckLog: global hash-chained; acked_count, timed_out_count, verify_chain.
// MessageAckTracker: send(), ack() → bool, expire_timeouts(epoch),
//   pending_count(peer), delivery_rate_pct(peer) = acked*100/(acked+timed_out).
pub mod message_ack_tracker;

// Gate 309 — Gossip Peer Connection Pool: connection lifecycle management (T2)
// ConnectionState: Idle/Active/Draining/Closed. MAX_POOL_SIZE=64, MAX_IDLE_EPOCHS=20.
// PoolLog: global hash-chained; transition_count_to(state), verify_chain.
// PeerConnectionPool: connect(), release() Active→Idle, drain() →Draining,
//   close() removes entry, evict_idle(epoch), active_count(), idle_count().
pub mod peer_connection_pool;

// Gate 310 — Gossip Epoch Watermark: high-water-mark epoch tracking per peer (T2)
// WatermarkEvent: Advance/Stale. MAX_TRACKED_PEERS=256.
// WatermarkLog: global hash-chained; advance_count, stale_count, verify_chain.
// EpochWatermark: update(peer, epoch) → Advance|Stale (monotone, never decreases),
//   watermark(peer), global_floor() = min across all peers,
//   peers_at_or_above(epoch) count.
pub mod epoch_watermark;

// Gate 311 — Gossip Message Retry Scheduler: exponential-backoff retry tracking (T2)
// RetryStatus: Scheduled/Retried/Abandoned/Succeeded. BASE_RETRY_EPOCHS=2, MAX_RETRY_EPOCHS=32, MAX_RETRIES=5.
// Backoff: interval = min(BASE * 2^attempt, MAX_RETRY_EPOCHS). Capped at 32 epochs.
// RetryLog: global hash-chained; retried_count, abandoned_count, succeeded_count, verify_chain.
// MessageRetryScheduler: schedule(), succeed() → bool, tick(epoch) → Vec<(peer,msg)> due for retry.
pub mod message_retry_scheduler;

// Gate 312 — Gossip Peer Capability Tracker: per-peer capability bitmask management (T2)
// CAP_GOSSIP=0x01, CAP_CONSENSUS=0x02, CAP_RELAY=0x04, CAP_AUDIT=0x08, CAP_STORAGE=0x10, CAP_EDGE=0x20.
// Updates monotone by epoch (StaleEpoch error if not advancing).
// CapabilityLog: global hash-chained; update_count (changed caps), verify_chain.
// PeerCapabilityTracker: update() → Ok(changed?), has_capability(), peers_with_capability() sorted, remove().
pub mod peer_capability_tracker;

// Gate 313 — Gossip Message Cache: epoch-scoped content-addressed message store (T2)
// CacheDecision: Inserted/AlreadyPresent/EpochFull. CACHE_WINDOW_EPOCHS=6, MAX_ENTRIES_PER_EPOCH=512.
// BTreeMap<epoch, BTreeSet<[u8;32]>> sliding window; insert() checks entire window for duplicates.
// advance_epoch() evicts epochs older than current − CACHE_WINDOW_EPOCHS.
// CacheLog: global hash-chained; inserted_count, already_present_count, verify_chain.
// GossipMessageCache: insert(), contains(), advance_epoch(), window_entry_count().
pub mod gossip_message_cache;

// Gate 314 — Gossip Subscription Filter: topic-based message forwarding decisions (T2)
// FilterDecision: Forward/Drop/NoSubscriptions. MAX_FILTER_TOPICS=64.
// BTreeSet<topic_hash[32]> per peer; evaluate() checks membership and records decision.
// FilterLog: per-peer SHA-256 hash-chained; forward_count, drop_count, verify_chain.
// SubscriptionFilter: register_topics() (truncates at MAX), evaluate(), clear_peer(), topics_for().
pub mod subscription_filter;

// Gate 315 — Gossip Peer Address Book: peer endpoint registry with epoch-monotone updates (T2)
// AddressOp: Register/Update/Remove. MAX_ADDRESS_LEN=128, MAX_BOOK_SIZE=256.
// Epochs strictly monotone per peer (StaleEpoch). SHA-256 content-hash of address string in log.
// AddressLog: global hash-chained; register_count, update_count, remove_count, verify_chain.
// PeerAddressBook: register() → Ok(Register|Update)|Err, remove() → bool, lookup(), all_peers() sorted.
pub mod peer_address_book;

// Gate 316 — Gossip Epoch Rate Ledger: per-epoch sent/received/dropped throughput accounting (T2)
// EpochRateStatus: Normal/Exceeded (when sent+received > MAX_MESSAGES_PER_EPOCH=10_000).
// Epochs strictly monotone (StaleEpoch). SHA-256 hash chain over all epoch summaries.
// EpochRateLedger: seal_epoch() → Ok(status)|Err, total_sent/received/dropped, exceeded_epoch_count, verify_chain.
pub mod epoch_rate_ledger;

// Gate 317 — Gossip Peer Liveness Oracle: composite liveness classification from miss/latency/reputation (T2)
// LivenessVerdict: Live/Degraded/Suspect/Dead. Deterministic rule hierarchy (Dead > Suspect > Degraded > Live).
// classify_liveness() is stateless. LivenessLog: per-peer SHA-256 hash-chained records.
// PeerLivenessOracle: assess(), latest_verdict(), dead/suspect/live_peers() sorted, get_log().
pub mod peer_liveness_oracle;

// Gate 318 — Gossip Message Sequence Tracker: per-peer monotone sequence enforcement (T2)
// SequenceEvent: InOrder/Gap/Duplicate/Reset. MAX_TRACKED_PEERS=512.
// Gap: seq > expected (advances). Duplicate: seq < expected (no advance). Reset: seq==0 and expected>0.
// SequenceLog: per-peer SHA-256 hash-chained; in_order/gap/duplicate counts, verify_chain.
// MessageSequenceTracker: observe() → SequenceEvent|TooManyPeers, expected_sequence(), gap/dup/reset totals.
pub mod message_sequence_tracker;

// Gate 319 — Gossip Epoch Snapshot Archive: rolling epoch-boundary state archive (T2)
// MAX_ARCHIVE_SIZE=128 rolling window; oldest epochs evicted when archive exceeds capacity.
// content_hash = SHA-256(epoch_be8‖peers_be4‖sent_be8‖recv_be8‖dropped_be8).
// record_hash = SHA-256(prev_hash‖content_hash[32]). Epochs strictly monotone (StaleEpoch).
// EpochSnapshotArchive: archive(), get(epoch), latest(), total_messages_sent/dropped, verify_chain.
// verify_chain() → (bool, Option<u64>) — epoch of first invalid record.
pub mod epoch_snapshot_archive;
// Gate 320 — Gossip Network Health Report: constitutional health synthesis (T2)
// Aggregates liveness (dead/suspect/degraded/live peer counts), rate accounting
// (total_dropped, exceeded_epochs), and sequence integrity (gaps, duplicates) into
// a single GossipHealthReport with NetworkHealthClass verdict (Green/Yellow/Red).
// Red:    dead_peers≥1 OR exceeded_epochs≥3 OR sequence_gaps≥10.
// Yellow: degraded/suspect≥1 OR total_dropped≥100 OR sequence_gaps≥1.
// report_hash = SHA-256(prev‖epoch_be8‖live_be4‖degraded_be4‖suspect_be4‖dead_be4
//               ‖dropped_be8‖exceeded_be4‖gaps_be8‖dups_be8‖class_byte).
// GossipHealthMonitor: record(), latest(), health_class(), verify_chain().
pub mod gossip_health_report;

// Gate 321 — Resonance Anchor: hash-chained constitutional resonance ledger (T2)
// Wraps Gate 222 check_resonance to add report_hash (SHA-256 chain), vortex_is_triadic,
// ring_depth (center_index from ring_composition), certified_constitutional bool, and
// a ResonanceChain monitor with verify_chain() → (bool, Option<usize>) audit replay.
// Hash input: prev[32]‖is_resonant‖phi_convergent‖ring_valid‖sequence_monotone
//             ‖vortex_is_triadic‖certified‖resonance_depth‖ring_depth_be8
//             ‖coefficient_bits_be8‖phi_headroom_bits_be8‖sequence_id_be8
pub mod resonance_anchor;

// Gate 327 — Synthesis Resilience Monitor (T2)
// Rolling-window (size=8) health tracker for the synthesis arc under network stress.
// Detects: T0Oscillation (≥3 flips/window), QuorumLoss (≥3 non-quorum/window),
// EpochGap (missing >2 consecutive epochs). Degraded = 2+ signatures simultaneously.
// ResilienceRecord: hash-chained per-epoch snapshot. verify_chain(), healthy_count().
pub mod synthesis_resilience;

// Gate 326 — Peer Frame Validator (T2)
// Validates received StateFrame (Gate 325) against local constitutional state.
// Verdicts: Accepted/Degraded/Diverged/Rejected/EpochStale (score 0–4).
// MAX_EPOCH_LAG=5. Diverged: local quorum=true AND remote T0=false.
// ValidationRegistry: BTreeMap<peer_id, PeerValidationLog>; quorum_converged() at 1/φ.
pub mod peer_frame_validator;

// Gate 325 — Constitutional State Broadcaster (T2)
// Encodes epoch synthesis seal (Gate 324) as a 40-byte network frame for peer broadcast.
// Frame: epoch(8)‖seal_prefix(8)‖gossip_prefix(8)‖resonance_prefix(8)‖flags(1)‖checksum(7).
// Checksum = SHA-256(epoch‖seal_prefix‖flags)[0..7]. BroadcastLog: hash-chained send/recv log.
pub mod state_broadcaster;

// Gate 324 — Epoch Synthesis Seal (T2)
// Closes each epoch with a tamper-evident seal over all three synthesis layers
// (Gates 320–323): gossip_health_hash ‖ resonance_hash ‖ verdict_hash
// (SHA-256 over BTreeMap-ordered per-node terminal hashes) ‖ t0_consensus ‖ quorum_t0.
// SynthesisSealChain: append(), terminal_hash(), consensus_count(), verify_chain().
pub mod epoch_synthesis_seal;

// Gate 323 — Constitutional Verdict Ledger (T2)
// Per-node T0 verdict tracking with tamper-evident SHA-256 hash chain.
// NodeVerdictLedger: per-node append-only chain of VerdictEntry records.
// SwarmVerdictRegistry: BTreeMap<node_id, NodeVerdictLedger> — deterministic.
// consensus_t0(): all nodes certified. quorum_t0(): integer 1/φ quorum.
// verify_all() → (bool, BTreeMap<node_id, first_invalid_idx>).
pub mod verdict_ledger;

// Gate 322 — Constitutional Synthesis Monitor (T2)
// Synthesises Gate 320 gossip health verdict + Gate 321 resonance certification
// into a single T0 constitutional verdict with SHA-256 hash chain.
// T0: false if Red health OR not certified; true if non-Red AND certified.
// report_hash = SHA-256(prev[32]‖epoch_be8‖health_class_byte‖certified_byte‖t0_byte).
// ConstitutionalSynthesisMonitor: record(), latest(), t0_verdict(), health_class(), verify_chain().
pub mod constitutional_synthesis;

// Gate 328 — SPSF Epoch Compactor (T2)
// Truncates SPSF entries older than a configurable retention window while preserving
// the terminal hash as a cryptographic anchor. Proof-of-history is never destroyed:
// the CompactionAnchor seals the pruned prefix with a sequential SHA-256 hash chain.
// certificate_hash = SHA-256(epoch‖pruned_be8‖retained_be8‖anchor.terminal_hash‖anchor_seq_be8‖entry_count_be8).
// CompactionLog: hash-chained audit trail. verify_chain(), total_pruned(), latest().
pub mod spsf_compactor;

// Gate 329 — SPSF Compaction Verifier (T2)
// Verifies that a post-compaction SPSF suffix chain is validly anchored to a
// CompactionAnchor. Enables independent auditors who hold only the anchor + retained
// entries to certify proof-of-history without the pruned prefix.
// Verdicts: Verified / AnchorGap / EmptySuffix / NonMonotone / Fail.
// VerificationLog: hash-chained audit trail. verify_chain(), verified_count(), failed_count().
pub mod spsf_verifier;

// Gate 330 — SPSF Compaction Scheduler (T2)
// Policy layer determining WHEN to compact the SPSF entry log.
// Entry trigger: total_entries ≥ 1000. Epoch trigger: current - last_compact ≥ 50.
// recommended_retain = max(MIN_RETAIN=10, total - PRUNE_TARGET=200), clamped to total.
// SchedulerLog: hash-chained audit trail. triggered_count(), verify_chain().
pub mod spsf_scheduler;

// Gate 331 — SPSF Integrated Manager (T2)
// Unified facade wiring the SPSF compaction trilogy: scheduler → compact → verify.
// tick(epoch): evaluates schedule, compacts if advised, verifies the retained suffix.
// manager_hash(): SHA-256 over sub-log terminal hashes — cross-module tamper-evident seal.
// ManagementLog: hash-chained per-tick records. total_compacted_entries(), verify_chain().
pub mod spsf_manager;

// Gate 332 — Gossip Health Compactor (T2)
// Applies proof-preserving compaction (Gate 328 pattern) to the GossipHealthMonitor chain
// (Gate 320). HealthAnchor seals pruned health reports with terminal_hash + peak_class.
// certificate_hash = SHA-256(epoch‖pruned_be8‖retained_be8‖terminal_hash‖anchor_epoch_be8‖peak_byte).
// HealthCompactionLog: hash-chained audit trail. total_pruned(), verify_chain().
pub mod gossip_health_compactor;

// Gate 333 — Resonance Chain Compactor (T2)
// Applies proof-preserving compaction (Gate 328 pattern) to the ResonanceChain (Gate 321).
// ResonanceAnchor seals pruned resonance records with terminal_hash + certified_count + any_resonant.
// certificate_hash = SHA-256(epoch_be8‖pruned_be8‖retained_be8‖terminal_hash‖anchor_seq_be8‖certified_be8‖any_resonant_byte).
// ResonanceCompactionLog: hash-chained audit trail. total_pruned(), verify_chain().
pub mod resonance_compactor;

// Gate 334 — Unified Compaction Manager (T2)
// Single per-epoch orchestrator coordinating all three proof-preserving compactors:
// SPSF (Gate 328) + GossipHealth (Gate 332) + Resonance (Gate 333) in one tick().
// unified_hash = SHA-256(prev‖epoch_be8‖spsf_cert[32]‖health_cert[32]‖resonance_cert[32]
//                         ‖spsf_pruned_be8‖health_pruned_be8‖resonance_pruned_be8).
// UnifiedCompactionLog: hash-chained audit trail. total_pruned(), verify_chain(),
// spsf_total_pruned(), health_total_pruned(), resonance_total_pruned().
pub mod unified_compaction_manager;

// Gate 335 — Compaction Epoch Seal (T2)
// Closes each epoch with a tamper-evident seal binding the Unified Compaction Manager
// terminal hash + per-compactor running totals into a hash-chained CompactionSealChain.
// seal_hash = SHA-256(prev[32]‖epoch_be8‖unified_hash[32]
//                      ‖spsf_pruned_be8‖health_pruned_be8‖resonance_pruned_be8‖total_pruned_be8).
// CompactionSealChain: append(), terminal_hash(), seal_count(), verify_chain().
pub mod compaction_epoch_seal;

// Gate 336 — Compaction Audit Certifier (T2)
// Certifies a CompactionSealChain over an epoch window, producing a tamper-evident
// CompactionAuditCertificate. Analogous to Gate 253 for the compaction subsystem.
// certificate_hash = SHA-256(epoch_start_be8‖epoch_end_be8‖epoch_count_be8‖chains_valid_byte
//                             ‖total_pruned_be8‖spsf_be8‖health_be8‖resonance_be8‖terminal_hash[32]).
// CertifierLog: hash-chained certificates. all_valid(), verify_chain().
pub mod compaction_audit_certifier;

// Gate 337 — Compaction Telemetry Encoder (T2)
// Encodes a CompactionAuditCertificate into a compact 24-byte gossip frame.
// Frame: epoch_end(8)‖total_pruned(8)‖chains_valid(1)‖spsf/health/res_pct(3)‖cert_prefix(4).
// CompactionTelemetryLog: hash-chained record_hash = SHA-256(prev‖frame[24]‖epoch_end_be8).
// encode(), decode(), verify_chain(), frame_count(). Mirrors Gate 254.
pub mod compaction_telemetry_encoder;

// Gate 338 — Compaction Health Aggregator (T2)
// Combines compaction telemetry validity (chains_valid, total_pruned) with constitutional
// OverallCondition (Gate 247) into a per-epoch CompactionHealthVector.
// CompactionHealthGrade: Healthy/Nominal/Elevated/Critical from (chains_valid, prune_threshold).
// JointCondition: Optimal/Nominal/Degraded/Critical — worst of both axes.
// vector_hash = SHA-256(prev‖epoch_be8‖grade‖cond‖joint‖total_pruned_be8‖chains_valid).
// CompactionHealthLog: critical_count(), optimal_count(), joint_condition_count(), verify_chain().
pub mod compaction_health_aggregator;

// Gate 339 — Compaction Momentum Tracker (T2)
// Rolling directional trend signal for JointCondition (Gate 338) across MOMENTUM_WINDOW=4 observations.
// CompactionMomentumDir: Improving/Stable/Declining from signed score delta (latest − earliest).
// record_hash = SHA-256(prev[32]‖epoch_be8‖score_byte‖dir_byte‖momentum_int_be2‖window_size_be2).
// CompactionMomentumLog: direction_count(), improving_epochs(), declining_epochs(), verify_chain().
pub mod compaction_momentum_tracker;

// Gate 340 — Compaction Epoch Report (T2)
// Per-epoch summary unifying CompactionHealthVector (338) + CompactionMomentumRecord (339)
// + telemetry percentages (337) into one hash-chained report per epoch.
// report_hash = SHA-256(prev[32]‖epoch_be8‖joint‖grade‖total_pruned_be8‖chains_valid
//                        ‖dir‖momentum_int_be2‖window_size_be2‖spsf_pct‖health_pct‖res_pct).
// CompactionEpochReportLog: critical_epochs(), optimal_epochs(), declining_epochs(), verify_chain().
pub mod compaction_epoch_report;

// Gate 341 — Compaction Alert Classifier (T2)
// Translates CompactionEpochReport signals into Green/Amber/Red alert levels with
// hysteresis: Amber at consecutive_declining≥2, Red at critical condition or streak≥3.
// alert_hash = SHA-256(prev[32]‖epoch_be8‖alert_byte‖joint_byte‖dir_byte‖consecutive_be4).
// CompactionAlertLog: red_count(), amber_count(), green_count(), max_consecutive_declining(), verify_chain().
pub mod compaction_alert_classifier;

// Gate 342 — Compaction Recovery Advisor (T2)
// Produces prioritized recovery recommendations from alert + epoch report signals.
// Priorities (highest first): ChainRepair → PruneReduction → MomentumStabilize → MonitorOnly.
// reason_code bit-field: bit0=!chains_valid, bit1=high_prune(≥500), bit2=declining_streak≥2.
// action_hash = SHA-256(prev[32]‖epoch_be8‖alert_byte‖priority_byte‖reason_code‖recommendation_byte).
// RecoveryAdvisorLog: action_count_by(priority), chain_repair_count(), verify_chain().
pub mod compaction_recovery_advisor;

// Gate 343 — Compaction SLA Tracker (T2)
// Per-epoch SLA compliance: joint_condition≤Nominal AND alert_level≤Amber AND chains_valid.
// violation_mask bit-field: bit0=!joint_ok, bit1=!alert_ok, bit2=!chains_ok.
// sla_hash = SHA-256(prev[32]‖epoch_be8‖compliant_byte‖violation_mask).
// SlaTrackerLog: compliance_rate() per-mille, streak_compliant(), verify_chain().
pub mod compaction_sla_tracker;

// Gate 344 — Compaction Capacity Planner (T2)
// Linear extrapolation over CAPACITY_WINDOW=4 epoch total_pruned values to project
// epochs-to-CAPACITY_CEILING(10_000). Integer arithmetic only: mean_delta = (last-first)/(n-1).
// epochs_to_ceiling = remaining/mean_delta; u32::MAX if delta≤0 ("no foreseeable risk").
// projection_hash = SHA-256(prev‖epoch_be8‖current_total_be8‖mean_delta_be8‖window_len_be4‖epochs_be4‖at_cap).
// CapacityPlannerLog: critical_projections() (≤5 epochs), verify_chain().
pub mod compaction_capacity_planner;

// Gate 345 — Compaction Epoch Comparator (T2)
// Compares consecutive CompactionEpochReports producing signed EpochDeltaRecords.
// flags_byte: bit0=joint_improved, bit1=joint_worsened, bit2=chains_recovered,
//             bit3=chains_degraded, bit4=direction_changed.
// delta_hash = SHA-256(prev[32]‖epoch_be8‖prev_epoch_be8‖flags_byte‖pruned_delta_be8‖momentum_delta_be2).
// EpochComparatorLog: compare(prev, curr), improvement_count(), degradation_count(), verify_chain().
pub mod compaction_epoch_comparator;

// Gate 346 — Compaction Trend Analyzer (T2)
// Classifies multi-epoch trends from a rolling window (TREND_WINDOW=4) of EpochDeltaRecords.
// TrendClass: Improving(≥3 net-positive in window) / Degrading(≥3 net-negative) / Volatile(mixed) / Stable.
// trend_hash = SHA-256(prev[32]‖epoch_be8‖trend_byte‖window_size_be2‖improvement_be4‖degradation_be4‖net_pruned_delta_be8).
// TrendAnalyzerLog: append(delta), improving/degrading/volatile/stable_trend_count(), verify_chain().
pub mod compaction_trend_analyzer;

// Gate 347 — Compaction Dashboard Aggregator (T2)
// Unifies alert + trend + SLA signals into a per-epoch DashboardFrame.
// DashboardCondition: Thriving / Stable / Concerning / Critical.
// Critical: Red alert OR Degrading trend. Thriving: Green + Improving + SLA-compliant.
// frame_hash = SHA-256(prev[32]‖epoch_be8‖condition‖alert‖trend‖sla‖compliance_rate_be4‖imp_be4‖deg_be4).
// CompactionDashboard: record(), thriving/stable/concerning/critical_count(), verify_chain().
pub mod compaction_dashboard;

// Gate 348 — Compaction Epoch Ledger (T2)
// Tamper-evident LedgerEntry per epoch binding all compaction subsystem terminal hashes.
// entry_hash = SHA-256(prev[32]‖epoch_be8‖report_hash‖alert_hash‖sla_hash
//                       ‖capacity_hash‖delta_hash‖trend_hash‖dashboard_hash).
// CompactionEpochLedger: append(), terminal_hash(), entry_count(), verify_chain().
pub mod compaction_epoch_ledger;

// Gate 349 — Compaction Audit Seal (T2)
// Certifies a window of CompactionEpochLedger entries into a tamper-evident CompactionAuditSeal.
// seal_hash = SHA-256(prev[32]‖epoch_start_be8‖epoch_end_be8‖epoch_count_be8‖chains_valid_byte‖terminal_hash[32]).
// CompactionAuditSealLog: certify(), certify_ledger(), all_valid(), seal_count(), verify_chain().
pub mod compaction_audit_seal;

// Gate 350 — Compaction Broadcaster (T2)
// Encodes CompactionAuditSeal into a compact 32-byte BroadcastFrame for peer broadcast.
// Frame: epoch_end(8)‖epoch_count(8)‖chains_valid(1)‖seal_prefix(4)‖terminal_prefix(4)‖checksum(7).
// record_hash = SHA-256(prev[32]‖frame[32]‖epoch_end_be8).
// CompactionBroadcaster: encode(), decode() with checksum verification, verify_chain().
pub mod compaction_broadcaster;

// Gate 351 — Compaction Broadcast Validator (T2)
// Validates incoming BroadcastFrames: checksum integrity, epoch monotonicity.
// ValidationVerdict: Valid/ChecksumFail/EpochRegressed/ChecksumAndEpoch (u8 flags).
// record_hash = SHA-256(prev[32]‖frame_epoch_end_be8‖verdict_byte‖frame[32]).
// CompactionBroadcastValidator: validate(frame), count_verdict(), verify_chain().
pub mod compaction_broadcast_validator;

// Gate 352 — Compaction Sync State Machine (T2)
// Tracks per-peer sync state: Unsynced/Synced/Lagging/Diverged.
// SyncEntry: peer_id, last_acked_epoch, current_epoch, state, lag.
// event_hash = SHA-256(prev[32]‖peer_id_be8‖state_byte‖acked_be8‖current_be8).
// CompactionSyncTracker: update(), get(), synced/lagging/diverged_count(), verify_chain().
pub mod compaction_sync_state;

// Gate 353 — Compaction Peer Registry (T2)
// Canonical set of known broadcast peers with admit/evict lifecycle.
// PeerRecord: peer_id, fingerprint[32], admitted_at epoch.
// event_hash = SHA-256(prev[32]‖kind_byte‖peer_id_be8‖epoch_be8‖fingerprint[32]).
// CompactionPeerRegistry: admit(), evict(), contains(), get(), verify_chain().
pub mod compaction_peer_registry;

// Gate 354 — Compaction Gossip Dispatcher (T2)
// Dispatches BroadcastFrames to all registered peers; rejects corrupt frames.
// DispatchRecord: epoch_end, peer_count, delivered_count.
// record_hash = SHA-256(prev[32]‖epoch_end_be8‖peer_count_be4‖delivered_be4).
// CompactionGossipDispatcher: dispatch(frame, registry), total_delivered(), verify_chain().
pub mod compaction_gossip_dispatcher;

// Gate 355 — Compaction Gossip Health Report (T2)
// Synthesises the compaction broadcast layer (Gates 350–354) into a single
// per-epoch health verdict: Green / Yellow / Red.
// Red: diverged_peers≥1 OR checksum_fails≥3 OR (admitted_peers>0 AND delivered_count==0).
// Yellow: lagging_peers≥1 OR epoch_regressions≥1 OR missed_count≥1.
// report_hash = SHA-256(prev[32]‖epoch_be8‖class_byte‖checksum_fails_be4‖epoch_regressions_be4
//                        ‖delivered_be8‖missed_be8‖lagging_be4‖diverged_be4‖admitted_be4).
// CompactionGossipHealthMonitor: record(), verify_chain(), red_count(), yellow_count(), green_count().
pub mod compaction_gossip_health;

// Gate 356 — Compaction Gossip Health Compactor (T2)
// Applies proof-preserving compaction (Gate 328 pattern) to the Gate 355 health chain.
// GossipHealthAnchor: anchor_epoch, terminal_hash, entry_count, peak_class.
// terminal_hash chain: SHA-256(acc‖epoch_be8‖report_hash‖class_byte).
// certificate_hash = SHA-256(compaction_epoch_be8‖pruned_be8‖retained_be8
//                             ‖anchor.terminal_hash‖anchor_epoch_be8‖peak_class_byte).
// GossipHealthCompactionLog: append(), verify_chain(), total_pruned().
pub mod compaction_gossip_health_compactor;

// Gate 357 — Compaction Gossip Epoch Seal (T2)
// Closes each gossip epoch with a tamper-evident seal binding the Gate 355 health
// terminal hash + Gate 356 compaction terminal hash + aggregate counters.
// seal_hash = SHA-256(prev[32]‖epoch_be8‖health_terminal[32]‖compaction_terminal[32]
//                     ‖total_delivered_be8‖total_missed_be8
//                     ‖red_epochs_be4‖yellow_epochs_be4‖green_epochs_be4).
// GossipEpochSealChain: append(), terminal_hash(), seal_count(), verify_chain().
pub mod compaction_gossip_epoch_seal;

// Gate 358 — Compaction Gossip Audit Certifier (T2)
// Certifies a GossipEpochSealChain (Gate 357) over an epoch window into a
// tamper-evident GossipAuditCertificate. Mirrors Gate 336 for gossip subsystem.
// certificate_hash = SHA-256(epoch_start_be8‖epoch_end_be8‖epoch_count_be8
//                             ‖chains_valid_byte‖total_delivered_be8‖total_missed_be8
//                             ‖red_be4‖yellow_be4‖green_be4‖terminal_hash[32]).
// GossipCertifierLog: certify_window(), all_valid(), verify_chain().
pub mod compaction_gossip_audit_certifier;

// Gate 359 — Compaction Gossip Telemetry Encoder (T2)
// Encodes a GossipAuditCertificate (Gate 358) into a compact 24-byte gossip frame.
// Frame: epoch_end(8)‖total_delivered(8)‖chains_valid(1)‖red/yellow/green_pct(3)‖cert_prefix(4).
// record_hash = SHA-256(prev[32]‖frame[24]‖epoch_end_be8).
// GossipTelemetryLog: push(), verify_chain(), frame_count(). Mirrors Gate 337.
pub mod compaction_gossip_telemetry_encoder;

// Gate 360 — Compaction Gossip Health Aggregator (T2)
// Combines gossip telemetry (chains_valid, missed rate) with Gate 355 health class into
// a GossipHealthVector. GossipHealthGrade: Healthy/Nominal/Elevated/Critical.
// GossipJointCondition: Optimal/Nominal/Degraded/Critical — worst of both axes.
// vector_hash = SHA-256(prev‖epoch_be8‖grade‖class‖joint‖delivered_be8‖missed_be8‖chains_valid).
// GossipHealthLog: critical_count(), optimal_count(), joint_condition_count(), verify_chain().
pub mod compaction_gossip_health_aggregator;

// Gate 361 — Compaction Gossip Momentum Tracker (T2)
// Rolling directional trend for GossipJointCondition (Gate 360) across GOSSIP_MOMENTUM_WINDOW=4.
// GossipMomentumDir: Improving/Stable/Declining from signed score delta (latest − earliest).
// record_hash = SHA-256(prev[32]‖epoch_be8‖score_byte‖dir_byte‖momentum_int_be2‖window_size_be2).
// GossipMomentumLog: direction_count(), improving_epochs(), declining_epochs(), verify_chain().
pub mod compaction_gossip_momentum_tracker;

// Gate 362 — Compaction Gossip Epoch Report (T2)
// Per-epoch summary unifying GossipHealthVector (Gate 360) + GossipMomentumRecord (Gate 361)
// + telemetry percentages (Gate 359). Mirrors Gate 340 for the gossip subsystem.
// report_hash = SHA-256(prev[32]‖epoch_be8‖joint_byte‖grade_byte‖total_delivered_be8
//               ‖chains_valid_byte‖dir_byte‖momentum_int_be2‖window_size_be2‖red‖yellow‖green).
// GossipEpochReportLog: critical_epochs(), optimal_epochs(), declining_epochs(), verify_chain().
pub mod compaction_gossip_epoch_report;

// Gate 363 — Compaction Gossip Alert Classifier (T2)
// Translates GossipEpochReport (Gate 362) into GossipAlertLevel (Green/Amber/Red) with
// hysteresis. Mirrors Gate 341. GOSSIP_ALERT_DECLINING_THRESHOLD=3.
// alert_hash = SHA-256(prev[32]‖epoch_be8‖alert_byte‖joint_byte‖dir_byte‖consecutive_be4).
// GossipAlertLog: red_count(), amber_count(), green_count(), max_consecutive_declining().
pub mod compaction_gossip_alert_classifier;

// Gate 364 — Compaction Gossip Recovery Advisor (T2)
// Produces GossipRecoveryAction from GossipAlertRecord (363) + GossipEpochReport (362).
// Mirrors Gate 342. Priorities: ChainRepair > DeliveryRecovery (red_pct≥50%) >
// MomentumStabilize > MonitorOnly. reason_code bit-field tracks concurrent conditions.
// action_hash = SHA-256(prev[32]‖epoch_be8‖alert_byte‖priority_byte‖reason_code‖rec_byte).
pub mod compaction_gossip_recovery_advisor;

// Gate 365 — Compaction Gossip SLA Tracker (T2)
// Per-epoch SLA compliance: joint≤Nominal AND alert≤Amber AND chains_valid.
// Mirrors Gate 343. violation_mask bits: bit0=joint, bit1=alert, bit2=chains.
// sla_hash = SHA-256(prev[32]‖epoch_be8‖compliant_byte‖violation_mask).
// GossipSlaTrackerLog: compliance_rate() per-mille, streak_compliant(), verify_chain().
pub mod compaction_gossip_sla_tracker;

// Gate 366 — Compaction Gossip Capacity Planner (T2)
// Projects epochs-to-delivery-ceiling from total_delivered trend. Mirrors Gate 344.
// GOSSIP_CAPACITY_WINDOW=4, GOSSIP_DELIVERY_CEILING=1_000_000.
// Linear extrapolation (integer arithmetic): mean_delta=(last-first)/(window_len-1).
// projection_hash = SHA-256(prev[32]‖epoch_be8‖current_total_be8‖mean_delta_be8‖window_len_be4‖epochs_to_ceiling_be4‖at_capacity_byte).
// GossipCapacityPlannerLog: critical_projections() (epochs_to_ceiling≤5), verify_chain().
pub mod compaction_gossip_capacity_planner;

// Gate 367 — Compaction Gossip Epoch Comparator (T2)
// Compares consecutive GossipEpochReports; records signed delta as hash-chained record.
// Mirrors Gate 345. flags_byte: bit0=joint_improved, bit1=joint_worsened, bit2=chains_recovered,
// bit3=chains_degraded, bit4=direction_changed. delivered_delta = i64 signed delivery diff.
// delta_hash = SHA-256(prev[32]‖epoch_be8‖prev_epoch_be8‖flags_byte‖delivered_delta_be8‖momentum_delta_be2).
// GossipEpochComparatorLog: improvement_count(), degradation_count(), verify_chain().
pub mod compaction_gossip_epoch_comparator;

// Gate 368 — Compaction Gossip Trend Analyzer (T2)
// Rolling 4-entry window over GossipEpochDeltaRecords; classifies trend as Stable/Improving/Degrading/Volatile.
// Mirrors Gate 346. Improving: ≥3 improvements AND 0 degradations. Degrading: ≥3 degradations AND 0 improvements.
// Volatile: ≥1 improvement AND ≥1 degradation. trend_hash = SHA-256(prev‖epoch_be8‖trend_byte‖
// window_size_be2‖improvement_be4‖degradation_be4‖net_delivered_delta_be8).
// GossipTrendAnalyzerLog: append(delta), improving_trend_count(), degrading_trend_count(), verify_chain().
pub mod compaction_gossip_trend_analyzer;

// Gate 369 — Compaction Gossip Dashboard Aggregator (T2)
// Unifies gossip signals into GossipDashboardFrame: condition = Thriving/Stable/Concerning/Critical.
// Mirrors Gate 347. Critical: Red alert OR Degrading trend. Concerning: SLA violation OR Volatile OR Amber.
// Thriving: SLA compliant AND Improving AND Green. frame_hash = SHA-256(prev‖epoch_be8‖condition_byte‖
// alert_byte‖trend_byte‖sla_byte‖compliance_rate_be4‖improvement_be4‖degradation_be4).
// GossipDashboard: record(), thriving/stable/concerning/critical_count(), verify_chain().
pub mod compaction_gossip_dashboard_aggregator;

// Gate 370 — Compaction Gossip Epoch Ledger (T2)
// Tamper-evident per-epoch ledger binding all gossip subsystem terminal hashes.
// Mirrors Gate 348. entry_hash = SHA-256(prev‖epoch_be8‖report‖alert‖sla‖capacity‖delta‖trend‖dashboard).
// GossipEpochLedger: append(), terminal_hash(), entry_count(), latest(), verify_chain().
pub mod compaction_gossip_epoch_ledger;

// Gate 371 — Compaction Gossip Audit Seal (T2)
// Certifies GossipEpochLedger windows into tamper-evident GossipAuditSeal chains.
// Mirrors Gate 349. seal_hash = SHA-256(prev‖epoch_start_be8‖epoch_end_be8‖epoch_count_be8‖
// chains_valid_byte‖terminal_hash[32]). GossipAuditSealLog: certify(), certify_ledger(),
// all_valid(), seal_count(), verify_chain().
pub mod compaction_gossip_audit_seal;

// Gate 372 — Compaction Gossip Broadcaster (T2)
// Encodes GossipAuditSeal into 32-byte network frame. Mirrors Gate 350.
// Frame: [0..8]=epoch_end_be8, [8..16]=epoch_count_be8, [16]=chains_valid,
// [17..21]=seal_hash_prefix4, [21..25]=terminal_hash_prefix4, [25..32]=checksum7.
// record_hash = SHA-256(prev‖frame[32]‖epoch_end_be8). GossipBroadcaster: encode(),
// decode(), frame_count(), verify_chain().
pub mod compaction_gossip_broadcaster;

// Gate 373 — Compaction Gossip Broadcast Validator (T2)
// Validates incoming GossipBroadcastFrames: checksum integrity + epoch monotonicity.
// Mirrors Gate 351. Verdicts: Valid / ChecksumFail / EpochRegressed / ChecksumAndEpoch.
// record_hash = SHA-256(prev‖frame_epoch_end_be8‖verdict_byte‖frame[32]).
// GossipBroadcastValidator: validate(), count_verdict(), verify_chain().
pub mod compaction_gossip_broadcast_validator;

// Gate 374 — Compaction Gossip Sync State Machine (T2)
// Tracks per-peer gossip sync state: Unsynced/Synced/Lagging/Diverged.
// Mirrors Gate 352. event_hash = SHA-256(prev[32]‖peer_id_be8‖state_byte‖acked_be8‖current_be8).
// GossipSyncTracker: update(), get(), synced/lagging/diverged_count(), verify_chain().
pub mod compaction_gossip_sync_state_machine;

// Gate 375 — Compaction Gossip Peer Registry (T2)
// Canonical set of known broadcast peers for the gossip subsystem.
// Mirrors Gate 353. event_hash = SHA-256(prev[32]‖kind_byte‖peer_id_be8‖epoch_be8‖fingerprint[32]).
// GossipPeerRegistry: admit(), evict(), contains(), get(), peer_count(), verify_chain().
pub mod compaction_gossip_peer_registry;

// Gate 376 — Gossip Peer Dispatcher (T2)
// Dispatches GossipBroadcastFrames to all registered gossip peers.
// Mirrors Gate 354. record_hash = SHA-256(prev[32]‖epoch_end_be8‖peer_count_be4‖delivered_count_be4).
// GossipPeerDispatcher: dispatch(), total_delivered(), total_missed(), verify_chain().
pub mod gossip_peer_dispatcher;

// Gate 377 — Gossip Broadcast Summary (T2)
// Per-epoch summary combining dispatch stats + validator verdicts into a hash-chained record.
// summary_hash = SHA-256(prev‖epoch_end_be8‖dispatched_be4‖delivered_be4‖valid_be4
//                          ‖checksum_fail_be4‖epoch_regressed_be4‖checksum_and_epoch_be4).
// GossipBroadcastSummaryLog: record(), total_valid(), total_failed(), verify_chain().
pub mod gossip_broadcast_summary;

// Gate 378 — Gossip Fanout Tracker (T2)
// Per-epoch fanout metrics: total_peers, reached_peers, coverage_pct (floor integer).
// entry_hash = SHA-256(prev‖epoch_end_be8‖total_peers_be4‖reached_peers_be4‖coverage_pct_be4).
// GossipFanoutLog: record(), full_coverage_count(), average_coverage_pct(), verify_chain().
pub mod gossip_fanout_tracker;

// Gate 379 — Gossip Latency Tracker (T2)
// Per-peer epoch-delta latency: latency_epochs = ack_epoch.saturating_sub(dispatch_epoch).
// record_hash = SHA-256(prev‖peer_id_be8‖dispatch_epoch_be8‖ack_epoch_be8‖latency_epochs_be8).
// GossipLatencyLog: record(), max/min/avg_latency(), verify_chain().
pub mod gossip_latency_tracker;

// Gate 380 — Gossip Epoch Window (T2)
// Sliding window (size 4) over epoch coverage_pct; classifies as Healthy/Degraded/Critical.
// entry_hash = SHA-256(prev‖epoch_end_be8‖coverage_pct_be4‖window_avg_pct_be4‖state_byte).
// GossipEpochWindow: push(), healthy/degraded/critical_count(), verify_chain().
pub mod gossip_epoch_window;

// Gate 381 — Gossip Health Snapshot (T2)
// Aggregates fanout coverage, avg latency, and window state into a hash-chained snapshot.
// snapshot_hash = SHA-256(prev[32]‖epoch_end_be8‖coverage_pct_be4‖avg_latency_be8
//                          ‖window_avg_pct_be4‖window_state_byte).
// GossipHealthLog: record(), healthy/degraded/critical_count(), verify_chain().
pub mod gossip_health_snapshot;

// Gate 382 — Gossip Peer Score Tracker (T2)
// Per-peer delivery reliability score: score_pct = floor(hits * 100 / max(total,1)).
// event_hash = SHA-256(prev[32]‖peer_id_be8‖epoch_be8‖is_hit_byte‖hits_be8‖total_be8‖score_pct_be4).
// GossipPeerScoreLog: record_hit(), record_miss(), score_for(), verify_chain().
pub mod gossip_peer_score;

// Gate 383 — Gossip Epoch Seal (T2)
// Final immutable seal committing all gossip epoch signals into one hash-chained record.
// seal_hash = SHA-256(prev[32]‖epoch_end_be8‖coverage_pct_be4‖avg_latency_be8
//                      ‖window_avg_pct_be4‖window_state_byte‖peer_score_pct_be4).
// GossipEpochSealChain: seal(), latest(), seal_count(), verify_chain().
pub mod gossip_epoch_seal;

// Gate 384 — Gossip Frame Rate Monitor (T2)
// Tracks frames-per-epoch throughput with spike detection (spike if count > rolling_avg * 2).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖frame_count_be4‖rolling_avg_be4‖is_spike_byte).
// GossipFrameRateLog: record(), spike_count(), verify_chain().
pub mod gossip_frame_rate;

// Gate 385 — Gossip Drop Rate Tracker (T2)
// Per-epoch frame drop rate: drop_pct = floor(dropped*100/max(dispatched,1)).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖dispatched_be4‖dropped_be4‖drop_pct_be4).
// GossipDropRateLog: record(), high_drop_count(threshold), average_drop_pct(), verify_chain().
pub mod gossip_drop_rate;

// Gate 386 — Gossip Jitter Tracker (T2)
// Epoch-to-epoch delivery jitter: jitter = |frame_count - prev_frame_count|.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖frame_count_be4‖jitter_be4).
// GossipJitterLog: record(), max_jitter(), avg_jitter(), verify_chain().
pub mod gossip_jitter;

// Gate 387 — Gossip Reachability Map (T2)
// Per-peer reachable/unreachable status tracker with BTreeMap for current state.
// event_hash = SHA-256(prev[32]‖peer_id_be8‖epoch_be8‖reachable_byte).
// GossipReachabilityLog: mark_reachable(), mark_unreachable(), is_reachable(),
//   reachable_count(), unreachable_count(), verify_chain().
pub mod gossip_reachability;

// Gate 388 — Gossip Backpressure Signal (T2)
// Per-epoch queue depth with backpressure detection (under_pressure = queue_depth > threshold).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖queue_depth_be4‖threshold_be4‖under_pressure_byte).
// GossipBackpressureLog: record(), pressure_epoch_count(), max_queue_depth(), verify_chain().
pub mod gossip_backpressure;

// Gate 389 — Gossip Topology Change Detector (T2)
// Detects peer count changes between epochs; delta = peer_count - prev_peer_count (i32).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖peer_count_be4‖delta_be4‖changed_byte).
// GossipTopologyChangeLog: record(), change_count(), max_peer_count(), verify_chain().
pub mod gossip_topology_change;

// Gate 390 — Gossip Retransmit Counter (T2)
// Per-epoch per-peer retransmit attempt counter. BTreeMap for cumulative peer totals.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖peer_id_be8‖retransmit_count_be4).
// GossipRetransmitLog: record(), total_retransmits(), max_retransmits(), peer_total(), verify_chain().
pub mod gossip_retransmit;

// Gate 391 — Gossip Ack Latency Tracker (T2)
// Per-peer acknowledgment latency in epochs with rolling window average (size 4).
// entry_hash = SHA-256(prev[32]‖peer_id_be8‖epoch_be8‖latency_epochs_be8‖rolling_avg_be8).
// GossipAckLatencyLog: record(), avg_latency_for(), max_latency(), overall_avg(), verify_chain().
pub mod gossip_ack_latency;

// Gate 392 — Gossip Delivery Ratio Tracker (T2)
// delivery_ratio_pct = floor(delivered*100/max(dispatched,1)). Full/Partial/Poor classification.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖dispatched_be4‖delivered_be4‖ratio_pct_be4‖class_byte).
// GossipDeliveryRatioLog: record(), full_count(), partial_count(), poor_count(), average_ratio_pct(), verify_chain().
pub mod gossip_delivery_ratio;

// Gate 393 — Gossip Peer Churn Tracker (T2)
// churn_count = joins.saturating_add(leaves) per epoch. High churn = unstable mesh.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖joins_be4‖leaves_be4‖churn_count_be4).
// GossipPeerChurnLog: record(), total_joins(), total_leaves(), max_churn(), average_churn(), verify_chain().
pub mod gossip_peer_churn;

// Gate 394 — Gossip Epoch Health Verdict (T2)
// Synthesises delivery_ratio, drop_pct, churn_count, backpressure into Healthy/Degraded/Critical.
// Critical: ratio<50 OR drop>50 OR churn>20. Degraded: ratio<80 OR drop>10 OR pressure OR churn>5.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖ratio_be4‖drop_be4‖churn_be4‖pressure_byte‖verdict_byte).
// GossipEpochHealthLog: record(), healthy_count(), degraded_count(), critical_count(), verify_chain().
pub mod gossip_epoch_health;

// Gate 395 — Gossip Pipeline Summary Seal (T2)
// Per-epoch seal aggregating signals from Gates 390–394 into one hash-chained record.
// Fields: retransmit_count(u32), mean_ack_latency(u64), delivery_ratio_pct(u32), churn_count(u32), health_verdict.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖retransmit_be4‖latency_be8‖ratio_be4‖churn_be4‖verdict_byte).
// GossipPipelineSummaryLog: record(), healthy_epochs(), degraded_epochs(), critical_epochs(), verify_chain().
pub mod gossip_pipeline_summary;

// Gate 396 — Gossip Backpressure Epoch Log (T2)
// Per-epoch backpressure event counter. high_pressure = pressure_events >= SATURATION_THRESHOLD(10).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖pressure_events_be4‖high_pressure_byte).
// GossipBackpressureEpochLog: record(), total_pressure_events(), high_pressure_count(), max_pressure_events(), verify_chain().
pub mod gossip_backpressure_epoch;

// Gate 397 — Gossip Frame Size Histogram (T2)
// Per-epoch bucket counts: small(<256B), medium(256..1024B), large(>=1024B). Dominant bucket query.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖small_be4‖medium_be4‖large_be4‖total_be4).
// GossipFrameSizeHistogramLog: record(), total_small(), total_medium(), total_large(), dominant_bucket(), verify_chain().
pub mod gossip_frame_size_histogram;

// Gate 398 — Gossip Peer Reputation Log (T2)
// Per-peer score [0,100]: delivered+5, missed-10, churned-3. Trusted>=80, Neutral>=40, Untrusted<40.
// entry_hash = SHA-256(prev[32]‖peer_id_be8‖epoch_end_be8‖score_be4‖class_byte‖delivered_byte‖churned_byte).
// GossipPeerReputationLog: record(), score_for(), trusted_count(), untrusted_count(), verify_chain().
pub mod gossip_peer_reputation;

// Gate 399 — Gossip Deduplication Window Log (T2)
// Per-epoch duplicate-message tracking. dup_ratio_pct = dup_count*100/(seen+dup).
// high_dup = dup_ratio_pct >= DUP_SATURATION_THRESHOLD (25%).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖seen_count_be4‖dup_count_be4‖dup_ratio_pct_be4‖high_dup_byte).
// GossipDedupWindowLog: record(), total_seen(), total_dup(), high_dup_count(), max_dup_ratio_pct(), verify_chain().
pub mod gossip_dedup_window;

// Gate 400 — Gossip Neighbor Score Log (T2)
// Per-peer composite score from latency(0/50/100) + reliability[0,100] + stability(0 or 100).
// composite = (latency + reliability + stability) / 3 (integer div).
// NeighborTier: Elite(>=85), Active(>=50), Weak(<50).
// entry_hash = SHA-256(prev[32]‖peer_id_be8‖epoch_end_be8‖latency_be4‖reliability_be4‖stability_be4‖composite_be4‖tier_byte).
// GossipNeighborScoreLog: record(), score_for(), elite_count(), weak_count(), verify_chain().
pub mod gossip_neighbor_score;

// Gate 401 — Gossip Fanout Epoch Log (T2)
// Per-epoch mean fanout scaled x100 (integer). high_fanout: mean_x100>=600; low_fanout: <200.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖total_forwards_be4‖total_messages_be4‖mean_fanout_x100_be4‖high_byte‖low_byte).
// GossipFanoutEpochLog: record(), total_forwards_all(), total_messages_all(),
//   high_fanout_count(), low_fanout_count(), max_mean_fanout_x100(), verify_chain().
pub mod gossip_fanout_epoch;

// Gate 402 — Gossip Epoch Bandwidth Log (T2)
// Per-epoch byte-level accounting: sent, received, overhead bytes.
// overhead_pct = bytes_overhead*100/(sent+received); high_overhead when >=20%.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖bytes_sent_be8‖bytes_received_be8‖bytes_overhead_be8‖overhead_pct_be4‖high_overhead_byte).
// GossipEpochBandwidthLog: record(), total_sent(), total_received(), total_overhead(),
//   high_overhead_count(), max_overhead_pct(), verify_chain().
pub mod gossip_epoch_bandwidth;

// Gate 403 — Gossip TTL Tracker Log (T2)
// Per-epoch message TTL hop accounting. mean_hops_x10 = total_hops*10/max(delivered,1).
// ttl_efficiency_pct = delivered*100/(expired+delivered); low_efficiency when <70%.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖expired_be4‖delivered_be4‖mean_hops_x10_be4‖eff_pct_be4‖low_byte).
// GossipTtlTrackerLog: record(), total_expired(), total_delivered(),
//   low_efficiency_count(), min_efficiency_pct(), verify_chain().
pub mod gossip_ttl_tracker;

// Gate 404 — Gossip Queue Depth Log (T2)
// Per-epoch send-queue depth (min/max/mean). mean=(min+max)/2 (integer).
// queue_full: max_depth >= QUEUE_FULL_THRESHOLD (1000).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖min_be4‖max_be4‖mean_be4‖queue_full_byte).
// GossipQueueDepthLog: record(), queue_full_count(), max_ever_depth(),
//   mean_of_means(), verify_chain().
pub mod gossip_queue_depth;

// Gate 405 — Gossip Peer Uptime Log (T2)
// Per-epoch peer uptime: connected_ticks / total_ticks → uptime_pct.
// low_uptime: uptime_pct < UPTIME_FLOOR (80%).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖connected_ticks_be4‖total_ticks_be4‖uptime_pct_be4‖low_uptime_byte).
// GossipPeerUptimeLog: record(), total_connected(), total_ticks_all(),
//   low_uptime_count(), min_uptime_pct(), verify_chain().
pub mod gossip_peer_uptime;

// Gate 406 — Gossip Message Size Log (T2)
// Per-epoch message payload size tracking (min/max/mean). mean=(min+max)/2.
// oversized: max_size >= OVERSIZE_THRESHOLD (65536 bytes).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖min_be4‖max_be4‖mean_be4‖oversized_byte).
// GossipMessageSizeLog: record(), oversized_count(), max_ever_size(),
//   mean_of_means(), verify_chain().
pub mod gossip_message_size;

// Gate 407 — Gossip Peer Timeout Log (T2)
// Per-epoch peer timeout tracking: timeout_count / active_peers → timeout_rate_pct.
// high_timeout: timeout_rate_pct >= TIMEOUT_RATE_THRESHOLD (10%).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖timeout_count_be4‖active_peers_be4‖timeout_rate_pct_be4‖high_timeout_byte).
// GossipPeerTimeoutLog: record(), total_timeouts(), high_timeout_count(),
//   max_timeout_rate_pct(), verify_chain().
pub mod gossip_peer_timeout;

// Gate 408 — Gossip Latency Histogram Log (T2)
// Per-epoch 4-bucket latency histogram: fast(<10ms)/normal(10-99ms)/slow(100-499ms)/stall(≥500ms).
// stall_pct = stall*100/total; degraded: stall_pct >= STALL_DEGRADED_THRESHOLD (5%).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖fast_be4‖normal_be4‖slow_be4‖stall_be4‖stall_pct_be4‖degraded_byte).
// GossipLatencyHistogramLog: record(), total_fast(), total_stall(),
//   degraded_count(), max_stall_pct(), verify_chain().
pub mod gossip_latency_histogram;

// Gate 409 — Gossip Connection Pool Log (T2)
// Per-epoch pool state: pool_size / active_count / idle_count → utilization_pct.
// underutilized: utilization_pct < POOL_UTILIZATION_FLOOR (30%).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖pool_size_be4‖active_be4‖idle_be4‖util_pct_be4‖underutilized_byte).
// GossipConnectionPoolLog: record(), max_pool_size(), underutilized_count(),
//   min_utilization_pct(), verify_chain().
pub mod gossip_connection_pool;

// Gate 410 — Gossip Epoch Error Log (T2)
// Per-epoch error/warning accounting: error_count / total_events → error_rate_pct.
// error_burst: error_rate_pct >= ERROR_BURST_THRESHOLD (2%).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖error_be4‖warning_be4‖total_be4‖rate_pct_be4‖burst_byte).
// GossipEpochErrorLog: record(), total_errors(), total_warnings(),
//   burst_count(), max_error_rate_pct(), verify_chain().
pub mod gossip_epoch_error;

// Gate 411 — Gossip Round-Trip Time Log (T2)
// Per-epoch RTT tracking (min/max/mean in ms). mean=(min+max)/2.
// high_rtt: max_rtt_ms >= RTT_HIGH_THRESHOLD (500 ms).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖min_rtt_be4‖max_rtt_be4‖mean_rtt_be4‖high_rtt_byte).
// GossipRoundTripTimeLog: record(), high_rtt_count(), max_ever_rtt(),
//   mean_of_means(), verify_chain().
pub mod gossip_round_trip_time;

// Gate 412 — Gossip Window Fill Log (T2)
// Per-epoch sliding window fill ratio: slots_used/slots_total → fill_pct.
// window_full: fill_pct >= WINDOW_FULL_THRESHOLD (90%); window_empty: fill_pct==0.
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖slots_used_be4‖slots_total_be4‖fill_pct_be4‖full_byte‖empty_byte).
// GossipWindowFillLog: record(), full_count(), empty_count(),
//   max_fill_pct(), verify_chain().
pub mod gossip_window_fill;

// Gate 413 — Gossip Epoch Convergence Log (T2)
// Per-epoch peer convergence: peers_converged/peers_total → convergence_pct.
// not_converged: convergence_pct < CONVERGENCE_FLOOR (75%).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖peers_total_be4‖peers_converged_be4‖conv_pct_be4‖not_conv_byte).
// GossipEpochConvergenceLog: record(), not_converged_count(), min_convergence_pct(),
//   mean_convergence_pct(), verify_chain().
pub mod gossip_epoch_convergence;

// Gate 414 — Gossip Peer Diversity Log (T2)
// Per-epoch peer zone diversity: distinct_zones/total_peers → diversity_score (capped at 100).
// low_diversity: diversity_score < DIVERSITY_FLOOR (20%).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖zones_be4‖peers_be4‖score_be4‖low_byte).
// GossipPeerDiversityLog: record(), low_diversity_count(), max_diversity_score(),
//   mean_diversity_score(), verify_chain().
pub mod gossip_peer_diversity;

// Gate 415 — Gossip Broadcast Fanout Log (T2)
// Per-epoch broadcast fanout: min_fanout, max_fanout, mean_fanout = (min+max)/2.
// low_fanout: mean_fanout < FANOUT_FLOOR (3).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖min_fanout_be4‖max_fanout_be4‖mean_fanout_be4‖low_byte).
// GossipBroadcastFanoutLog: record(), low_fanout_count(), max_ever_fanout(),
//   mean_of_means(), verify_chain().
pub mod gossip_broadcast_fanout;

// Gate 416 — Gossip Broadcast Retry Log (T2)
// Per-epoch retry tracking: retry_count, total_sent, retry_rate_pct = (retry*100)/max(sent,1) capped 100.
// high_retry: retry_rate_pct > RETRY_CEILING (25).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖retry_count_be4‖total_sent_be4‖retry_rate_pct_be4‖high_byte).
// GossipBroadcastRetryLog: record(), high_retry_count(), total_retries(),
//   mean_retry_rate_pct(), verify_chain().
pub mod gossip_broadcast_retry;

// Gate 417 — Gossip Broadcast Drop Log (T2)
// Per-epoch message drop tracking: drop_count, total_sent, drop_rate_pct = (drop*100)/max(sent,1) capped 100.
// critical_drop: drop_rate_pct > DROP_THRESHOLD (10).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖drop_count_be4‖total_sent_be4‖drop_rate_pct_be4‖critical_byte).
// GossipBroadcastDropLog: record(), critical_drop_count(), total_drops(),
//   mean_drop_rate_pct(), verify_chain().
pub mod gossip_broadcast_drop;

// Gate 418 — Gossip Broadcast Acknowledgement Log (T2)
// Per-epoch ack tracking: ack_count, expected, ack_rate_pct = (ack*100)/max(expected,1) capped 100.
// under_ack: ack_rate_pct < ACK_FLOOR (80).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖ack_count_be4‖expected_be4‖ack_rate_pct_be4‖under_byte).
// GossipBroadcastAckLog: record(), under_ack_count(), mean_ack_rate_pct(),
//   min_ack_rate_pct(), verify_chain().
pub mod gossip_broadcast_ack;

// Gate 419 — Gossip Broadcast Timeout Log (T2)
// Per-epoch timeout tracking: timeout_count, total_sent, timeout_rate_pct = (timeout*100)/max(sent,1) capped 100.
// excessive_timeout: timeout_rate_pct > TIMEOUT_THRESHOLD (5).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖timeout_count_be4‖total_sent_be4‖timeout_rate_pct_be4‖excessive_byte).
// GossipBroadcastTimeoutLog: record(), excessive_timeout_count(), total_timeouts(),
//   mean_timeout_rate_pct(), verify_chain().
pub mod gossip_broadcast_timeout;

// Gate 420 — Gossip Broadcast Sequence Disorder Log (T2)
// Per-epoch out-of-order tracking: out_of_order_count, total_received,
// disorder_rate_pct = (ooo*100)/max(received,1) capped 100.
// disordered: disorder_rate_pct > DISORDER_THRESHOLD (15).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖out_of_order_count_be4‖total_received_be4‖disorder_rate_pct_be4‖disordered_byte).
// GossipBroadcastSequenceLog: record(), disordered_count(), total_out_of_order(),
//   mean_disorder_rate_pct(), verify_chain().
pub mod gossip_broadcast_sequence;

// Gate 421 — Gossip Broadcast Batch Fill Monitor (T2)
// Per-epoch batch fill efficiency: messages_in_batch, batch_capacity,
// fill_rate_pct = (messages_in_batch*100)/max(batch_capacity,1) capped 100.
// under_filled: fill_rate_pct < UNDERFILL_THRESHOLD (50).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖messages_in_batch_be4‖batch_capacity_be4‖fill_rate_pct_be4‖under_filled_byte).
// GossipBroadcastBatchLog: record(), under_filled_count(), total_messages(),
//   mean_fill_rate_pct(), verify_chain().
pub mod gossip_broadcast_batch;

// Gate 422 — Gossip Broadcast Duplicate Detection Monitor (T2)
// Per-epoch duplicate message rate: duplicate_count, total_received,
// dup_rate_pct = (duplicate_count*100)/max(total_received,1) capped 100.
// high_duplication: dup_rate_pct > DUPLICATION_THRESHOLD (10).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖duplicate_count_be4‖total_received_be4‖dup_rate_pct_be4‖high_duplication_byte).
// GossipBroadcastDuplicateLog: record(), high_duplication_count(), total_duplicates(),
//   mean_dup_rate_pct(), verify_chain().
pub mod gossip_broadcast_duplicate;

// Gate 423 — Gossip Broadcast Peer Latency Monitor (T2)
// Per-epoch high-latency peer rate: high_latency_peers, total_peers,
// latency_rate_pct = (high_latency_peers*100)/max(total_peers,1) capped 100.
// excessive_latency: latency_rate_pct > LATENCY_THRESHOLD (20).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖high_latency_peers_be4‖total_peers_be4‖latency_rate_pct_be4‖excessive_latency_byte).
// GossipBroadcastPeerLatencyLog: record(), excessive_latency_count(), total_high_latency_peers(),
//   mean_latency_rate_pct(), verify_chain().
pub mod gossip_broadcast_peer_latency;

pub use sgm_gate::SGMGate;
pub use lut_kan::LUTKANRouter;
pub use rwkv_state::RWKVStateCache;
pub use lyapunov::LyapunovMonitor;
pub use audit::AuditLogger;
pub use orchestrator::Phase1Orchestrator;

// Gate 425 — Gossip Broadcast Fragmentation Monitor (T2)
pub mod gossip_broadcast_fragmentation;
// Gate 426 — Gossip Broadcast Loss Monitor (T2)
pub mod gossip_broadcast_loss;
// Gate 427 — Gossip Broadcast Congestion Monitor (T2)
pub mod gossip_broadcast_congestion;
// Gate 429 — Gossip Broadcast Propagation Monitor (T2)
pub mod gossip_broadcast_propagation;
// Gate 430 — Gossip Broadcast Collision Monitor (T2)
pub mod gossip_broadcast_collision;
// Gate 437 — Gossip Broadcast Epoch Gap Monitor (T2)
pub mod gossip_broadcast_epoch_gap;
// Gate 438 — Gossip Broadcast Ack Timeout Monitor (T2)
pub mod gossip_broadcast_ack_timeout;
// Gate 439 — Gossip Broadcast Peer Churn Monitor (T2)
pub mod gossip_broadcast_peer_churn;
// Gate 440 — Gossip Broadcast Broadcast Drop Monitor (T2)
pub mod gossip_broadcast_broadcast_drop;
// Gate 441 — Gossip Broadcast Queue Overflow Monitor (T2)
pub mod gossip_broadcast_queue_overflow;
// Gate 442 — Gossip Broadcast Sync Lag Monitor (T2)
pub mod gossip_broadcast_sync_lag;
// Gate 443 — Gossip Broadcast Nack Rate Monitor (T2)
pub mod gossip_broadcast_nack_rate;
// Gate 444 — Gossip Broadcast Bandwidth Exceed Monitor (T2)
pub mod gossip_broadcast_bandwidth_exceed;
// Gate 445 — Gossip Broadcast Peer Drift Monitor (T2)
pub mod gossip_broadcast_peer_drift;
// Gate 446 — Gossip Broadcast Epoch Stall Monitor (T2)
pub mod gossip_broadcast_epoch_stall;
// Gate 447 — Gossip Broadcast Rebroadcast Monitor (T2)
pub mod gossip_broadcast_rebroadcast;
// Gate 448 — Gossip Broadcast Partial Delivery Monitor (T2)
pub mod gossip_broadcast_partial_delivery;
// Gate 449 — Gossip Broadcast Peer Rejection Monitor (T2)
pub mod gossip_broadcast_peer_rejection;
// Gate 450 — Gossip Broadcast Msg Ordering Monitor (T2)
pub mod gossip_broadcast_msg_ordering;
// Gate 451 — Gossip Broadcast Epoch Overlap Monitor (T2)
pub mod gossip_broadcast_epoch_overlap;
// Gate 452 — Gossip Broadcast Peer Isolation Monitor (T2)
pub mod gossip_broadcast_peer_isolation;
// Gate 453 — Gossip Broadcast Ttl Exceeded Monitor (T2)
pub mod gossip_broadcast_ttl_exceeded;
// Gate 454 — Gossip Broadcast Flood Rate Monitor (T2)
pub mod gossip_broadcast_flood_rate;
// Gate 455 — Gossip Broadcast Dedup Miss Monitor (T2)
pub mod gossip_broadcast_dedup_miss;
// Gate 456 — Gossip Broadcast Capacity Breach Monitor (T2)
pub mod gossip_broadcast_capacity_breach;
// Gate 457 — Gossip Broadcast Peer Timeout Monitor (T2)
pub mod gossip_broadcast_peer_timeout;
// Gate 458 — Gossip Broadcast Batch E3 Monitor (T2)
pub mod gossip_broadcast_batch_e3;
// Gate 459 — Gossip Broadcast Duplicate E3 Monitor (T2)
pub mod gossip_broadcast_duplicate_e3;
// Gate 460 — Gossip Broadcast Peer Latency E3 Monitor (T2)
pub mod gossip_broadcast_peer_latency_e3;
// Gate 461 — Gossip Broadcast Retry E3 Monitor (T2)
pub mod gossip_broadcast_retry_e3;
// Gate 462 — Gossip Broadcast Fragmentation E3 Monitor (T2)
pub mod gossip_broadcast_fragmentation_e3;
// Gate 463 — Gossip Broadcast Loss E3 Monitor (T2)
pub mod gossip_broadcast_loss_e3;
// Gate 464 — Gossip Broadcast Congestion E3 Monitor (T2)
pub mod gossip_broadcast_congestion_e3;
// Gate 465 — Gossip Broadcast Fanout E3 Monitor (T2)
pub mod gossip_broadcast_fanout_e3;
// Gate 466 — Gossip Broadcast Propagation E3 Monitor (T2)
pub mod gossip_broadcast_propagation_e3;
// Gate 467 — Gossip Broadcast Collision E3 Monitor (T2)
pub mod gossip_broadcast_collision_e3;
// Gate 468 — Gossip Broadcast Timeout E3 Monitor (T2)
pub mod gossip_broadcast_timeout_e3;
// Gate 469 — Gossip Broadcast Jitter E3 Monitor (T2)
pub mod gossip_broadcast_jitter_e3;
// Gate 470 — Gossip Broadcast Backpressure E3 Monitor (T2)
pub mod gossip_broadcast_backpressure_e3;
// Gate 471 — Gossip Broadcast Window Miss E3 Monitor (T2)
pub mod gossip_broadcast_window_miss_e3;
// Gate 472 — Gossip Broadcast Epoch Gap E3 Monitor (T2)
pub mod gossip_broadcast_epoch_gap_e3;
// Gate 473 — Gossip Broadcast Ack Timeout E3 Monitor (T2)
pub mod gossip_broadcast_ack_timeout_e3;
// Gate 474 — Gossip Broadcast Peer Churn E3 Monitor (T2)
pub mod gossip_broadcast_peer_churn_e3;
// Gate 475 — Gossip Broadcast Broadcast Drop E3 Monitor (T2)
pub mod gossip_broadcast_broadcast_drop_e3;
// Gate 476 — Gossip Broadcast Queue Overflow E3 Monitor (T2)
pub mod gossip_broadcast_queue_overflow_e3;
// Gate 477 — Gossip Broadcast Sync Lag E3 Monitor (T2)
pub mod gossip_broadcast_sync_lag_e3;
// Gate 478 — Gossip Broadcast Nack Rate E3 Monitor (T2)
pub mod gossip_broadcast_nack_rate_e3;
// Gate 479 — Gossip Broadcast Bandwidth Exceed E3 Monitor (T2)
pub mod gossip_broadcast_bandwidth_exceed_e3;
// Gate 480 — Gossip Broadcast Peer Drift E3 Monitor (T2)
pub mod gossip_broadcast_peer_drift_e3;
// Gate 481 — Gossip Broadcast Epoch Stall E3 Monitor (T2)
pub mod gossip_broadcast_epoch_stall_e3;
// Gate 482 — Gossip Broadcast Rebroadcast E3 Monitor (T2)
pub mod gossip_broadcast_rebroadcast_e3;
// Gate 483 — Gossip Broadcast Partial Delivery E3 Monitor (T2)
pub mod gossip_broadcast_partial_delivery_e3;
// Gate 484 — Gossip Broadcast Peer Rejection E3 Monitor (T2)
pub mod gossip_broadcast_peer_rejection_e3;
// Gate 485 — Gossip Broadcast Msg Ordering E3 Monitor (T2)
pub mod gossip_broadcast_msg_ordering_e3;
// Gate 486 — Gossip Broadcast Epoch Overlap E3 Monitor (T2)
pub mod gossip_broadcast_epoch_overlap_e3;
// Gate 487 — Gossip Broadcast Peer Isolation E3 Monitor (T2)
pub mod gossip_broadcast_peer_isolation_e3;
// Gate 488 — Gossip Broadcast Ttl Exceeded E3 Monitor (T2)
pub mod gossip_broadcast_ttl_exceeded_e3;
// Gate 489 — Gossip Broadcast Flood Rate E3 Monitor (T2)
pub mod gossip_broadcast_flood_rate_e3;
// Gate 490 — Gossip Broadcast Dedup Miss E3 Monitor (T2)
pub mod gossip_broadcast_dedup_miss_e3;
// Gate 491 — Gossip Broadcast Capacity Breach E3 Monitor (T2)
pub mod gossip_broadcast_capacity_breach_e3;
// Gate 492 — Gossip Broadcast Peer Timeout E3 Monitor (T2)
pub mod gossip_broadcast_peer_timeout_e3;
// Gate 493 — Gossip Broadcast Batch E4 Monitor (T2)
pub mod gossip_broadcast_batch_e4;
// Gate 494 — Gossip Broadcast Duplicate E4 Monitor (T2)
pub mod gossip_broadcast_duplicate_e4;
// Gate 495 — Gossip Broadcast Peer Latency E4 Monitor (T2)
pub mod gossip_broadcast_peer_latency_e4;
// Gate 496 — Gossip Broadcast Retry E4 Monitor (T2)
pub mod gossip_broadcast_retry_e4;
// Gate 497 — Gossip Broadcast Fragmentation E4 Monitor (T2)
pub mod gossip_broadcast_fragmentation_e4;
// Gate 498 — Gossip Broadcast Loss E4 Monitor (T2)
pub mod gossip_broadcast_loss_e4;
// Gate 499 — Gossip Broadcast Congestion E4 Monitor (T2)
pub mod gossip_broadcast_congestion_e4;
// Gate 500 — Gossip Broadcast Fanout E4 Monitor (T2)
pub mod gossip_broadcast_fanout_e4;
// Gate 501 — Gossip Broadcast Propagation E4 Monitor (T2)
pub mod gossip_broadcast_propagation_e4;
// Gate 502 — Gossip Broadcast Collision E4 Monitor (T2)
pub mod gossip_broadcast_collision_e4;
// Gate 503 — Gossip Broadcast Timeout E4 Monitor (T2)
pub mod gossip_broadcast_timeout_e4;
// Gate 504 — Gossip Broadcast Jitter E4 Monitor (T2)
pub mod gossip_broadcast_jitter_e4;
// Gate 505 — Gossip Broadcast Backpressure E4 Monitor (T2)
pub mod gossip_broadcast_backpressure_e4;
// Gate 506 — Gossip Broadcast Window Miss E4 Monitor (T2)
pub mod gossip_broadcast_window_miss_e4;
// Gate 507 — Gossip Broadcast Epoch Gap E4 Monitor (T2)
pub mod gossip_broadcast_epoch_gap_e4;
// Gate 508 — Gossip Broadcast Ack Timeout E4 Monitor (T2)
pub mod gossip_broadcast_ack_timeout_e4;