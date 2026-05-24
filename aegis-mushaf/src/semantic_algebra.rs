//! Semantic Algebra — Zero-allocation triliteral root graph for Arabic morphology
//!
//! EPISTEMIC TIER: T2 (engineering hypothesis)
//!
//! Arabic words are formed from triliteral roots (جذر, root = three consonants).
//! A WaznOperator (وزن, pattern/scale) maps a root onto a derived form.
//! This module implements a deterministic graph of semantic derivations
//! from a root via classical Arabic morphological patterns.
//!
//! Constitutional invariants:
//! - BTreeMap throughout — deterministic iteration
//! - Zero heap allocation in hot path (SemanticNode is Copy)
//! - All operations are pure functions — replay-safe
//! - No floating-point

use std::collections::BTreeMap;

/// Three-consonant Arabic root, stored as Unicode codepoints.
/// The ordering is (first, second, third) radical.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct TriliteralRoot {
    pub r1: u32, // first radical codepoint
    pub r2: u32, // second radical
    pub r3: u32, // third radical
}

impl TriliteralRoot {
    pub fn new(r1: u32, r2: u32, r3: u32) -> Self {
        Self { r1, r2, r3 }
    }

    /// Canonical string representation: r1-r2-r3 as hex codepoints.
    pub fn canonical_id(&self) -> String {
        format!("{:04X}-{:04X}-{:04X}", self.r1, self.r2, self.r3)
    }
}

/// Classical Arabic morphological patterns (awzaan).
/// Each variant encodes how the root radicals are inserted into a template.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub enum WaznOperator {
    /// فَعَلَ — past-tense verb (form I)
    FaAAaLa,
    /// فَاعِل — active participle (doer)
    FaaAiL,
    /// مَفْعُول — passive participle (done-to)
    MaFAUuL,
    /// تَفْعِيل — verbal noun of form II
    TaFAiL,
    /// اِفْعَال — verbal noun of form IV
    IFAAaL,
    /// مَفْعَل — place/time noun
    MaFAaL,
}

impl std::fmt::Display for WaznOperator {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            WaznOperator::FaAAaLa  => write!(f, "فعل"),
            WaznOperator::FaaAiL   => write!(f, "فاعل"),
            WaznOperator::MaFAUuL  => write!(f, "مفعول"),
            WaznOperator::TaFAiL   => write!(f, "تفعيل"),
            WaznOperator::IFAAaL   => write!(f, "إفعال"),
            WaznOperator::MaFAaL   => write!(f, "مفعل"),
        }
    }
}

/// A derived semantic node — the product of applying a WaznOperator to a root.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct SemanticNode {
    pub root: TriliteralRoot,
    pub wazn: WaznOperator,
    /// Semantic depth from root — 0 = root itself, 1 = direct derivation, etc.
    pub depth: u8,
}

impl SemanticNode {
    pub fn new(root: TriliteralRoot, wazn: WaznOperator, depth: u8) -> Self {
        Self { root, wazn, depth }
    }
}

/// Growth edge in the derivation graph.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct GrowthEdge {
    pub from: SemanticNode,
    pub to: SemanticNode,
    pub operator: WaznOperator,
}

/// The triliteral arena — a DAG of semantic derivations.
/// BTreeMap keyed by (root, wazn) for deterministic traversal.
pub struct TriliteralArena {
    nodes: BTreeMap<(TriliteralRoot, WaznOperator), SemanticNode>,
    edges: Vec<GrowthEdge>,
}

impl TriliteralArena {
    pub fn new() -> Self {
        Self {
            nodes: BTreeMap::new(),
            edges: Vec::new(),
        }
    }

    /// Register a root without any wazn applied (seed node, depth=0).
    pub fn seed(&mut self, root: TriliteralRoot) -> SemanticNode {
        let node = SemanticNode::new(root, WaznOperator::FaAAaLa, 0);
        self.nodes.entry((root, WaznOperator::FaAAaLa)).or_insert(node);
        node
    }

    /// Apply a WaznOperator to a node, producing a new derived node.
    /// Returns the derived node (existing or newly created).
    pub fn derive(&mut self, from: SemanticNode, wazn: WaznOperator) -> SemanticNode {
        let depth = from.depth.saturating_add(1);
        let to = SemanticNode::new(from.root, wazn, depth);
        self.nodes.entry((from.root, wazn)).or_insert(to);
        self.edges.push(GrowthEdge { from, to, operator: wazn });
        to
    }

    /// Trace all derivations reachable from a root via standard awzaan.
    /// Returns nodes in BTreeMap order (deterministic).
    pub fn trace_growth(&mut self, root: TriliteralRoot) -> Vec<SemanticNode> {
        let seed = self.seed(root);
        let awzaan = [
            WaznOperator::FaaAiL,
            WaznOperator::MaFAUuL,
            WaznOperator::TaFAiL,
            WaznOperator::IFAAaL,
            WaznOperator::MaFAaL,
        ];
        for &wazn in &awzaan {
            self.derive(seed, wazn);
        }
        // Return all nodes for this root in wazn-sorted order (BTreeMap guarantees this)
        self.nodes
            .iter()
            .filter(|((r, _), _)| *r == root)
            .map(|(_, &n)| n)
            .collect()
    }

    pub fn node_count(&self) -> usize {
        self.nodes.len()
    }

    pub fn edge_count(&self) -> usize {
        self.edges.len()
    }

    /// Find all nodes at a given semantic depth.
    pub fn nodes_at_depth(&self, depth: u8) -> Vec<SemanticNode> {
        self.nodes.values().filter(|n| n.depth == depth).copied().collect()
    }

    /// Compute a deterministic fingerprint over all node keys.
    /// Uses sha2 to hash the sorted (root_id, wazn_idx) sequence.
    pub fn arena_fingerprint(&self) -> [u8; 32] {
        use sha2::{Sha256, Digest};
        let mut h = Sha256::new();
        for ((root, wazn), node) in &self.nodes {
            h.update(root.r1.to_le_bytes());
            h.update(root.r2.to_le_bytes());
            h.update(root.r3.to_le_bytes());
            h.update([*wazn as u8]);
            h.update([node.depth]);
        }
        h.finalize().into()
    }
}

impl Default for TriliteralArena {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn root_ktb() -> TriliteralRoot {
        // ك ت ب — root for writing
        TriliteralRoot::new(0x643, 0x62A, 0x628)
    }

    fn root_qlm() -> TriliteralRoot {
        // ق ل م — root for pen/writing instrument
        TriliteralRoot::new(0x642, 0x644, 0x645)
    }

    #[test]
    fn root_canonical_id_format() {
        let r = root_ktb();
        let id = r.canonical_id();
        assert_eq!(id, "0643-062A-0628");
    }

    #[test]
    fn seed_creates_depth_zero_node() {
        let mut arena = TriliteralArena::new();
        let node = arena.seed(root_ktb());
        assert_eq!(node.depth, 0);
        assert_eq!(node.root, root_ktb());
    }

    #[test]
    fn derive_increments_depth() {
        let mut arena = TriliteralArena::new();
        let seed = arena.seed(root_ktb());
        let derived = arena.derive(seed, WaznOperator::FaaAiL);
        assert_eq!(derived.depth, 1);
        assert_eq!(derived.wazn, WaznOperator::FaaAiL);
    }

    #[test]
    fn trace_growth_returns_all_awzaan() {
        let mut arena = TriliteralArena::new();
        let nodes = arena.trace_growth(root_ktb());
        // 1 seed (FaAAaLa) + 5 awzaan = 6 nodes
        assert_eq!(nodes.len(), 6);
    }

    #[test]
    fn trace_growth_deterministic_3x() {
        let make = || {
            let mut a = TriliteralArena::new();
            a.trace_growth(root_ktb())
                .iter()
                .map(|n| (n.wazn, n.depth))
                .collect::<Vec<_>>()
        };
        assert_eq!(make(), make());
        assert_eq!(make(), make());
    }

    #[test]
    fn arena_fingerprint_deterministic_3x() {
        let make = || {
            let mut a = TriliteralArena::new();
            a.trace_growth(root_ktb());
            a.arena_fingerprint()
        };
        assert_eq!(make(), make());
        assert_eq!(make(), make());
    }

    #[test]
    fn two_roots_give_different_fingerprints() {
        let mut a1 = TriliteralArena::new();
        a1.trace_growth(root_ktb());
        let mut a2 = TriliteralArena::new();
        a2.trace_growth(root_qlm());
        assert_ne!(a1.arena_fingerprint(), a2.arena_fingerprint());
    }

    #[test]
    fn edge_count_matches_derivations() {
        let mut arena = TriliteralArena::new();
        arena.trace_growth(root_ktb()); // 5 awzaan = 5 edges
        assert_eq!(arena.edge_count(), 5);
    }

    #[test]
    fn nodes_at_depth_0_is_seed() {
        let mut arena = TriliteralArena::new();
        arena.trace_growth(root_ktb());
        let depth0 = arena.nodes_at_depth(0);
        assert_eq!(depth0.len(), 1);
        assert_eq!(depth0[0].root, root_ktb());
    }

    #[test]
    fn btreemap_order_preserved_across_roots() {
        let mut arena = TriliteralArena::new();
        arena.trace_growth(root_qlm());
        arena.trace_growth(root_ktb());
        // qlm: r1=0x642; ktb: r1=0x643 → qlm comes first (0x642 < 0x643)
        let first_root = arena.nodes.keys().next().unwrap().0;
        assert_eq!(first_root, root_qlm());
    }
}
