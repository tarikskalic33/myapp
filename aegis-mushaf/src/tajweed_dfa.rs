//! Tajweed DFA — Acoustic state machine for Quranic recitation rules
//!
//! EPISTEMIC TIER: T2 (engineering hypothesis)
//!
//! The Tajweed rules modelled here are the classical Hafs 'an 'Asim rules:
//! - Izhar (clear articulation): nun-sakin/tanwin before throat letters
//! - Ikhfa (concealment): nun-sakin/tanwin before 15 letters
//! - Idgham (assimilation): nun-sakin before 6 letters (with/without ghunna)
//! - Madd (prolongation): vowel letters followed by hamza/sukun
//! - Qalqalah (echo): qaf/ta/ba/jim/dal at sukun/waqf
//!
//! Constitutional invariants:
//! - DFA transitions are pure functions — no floating-point, no randomness
//! - State table is exhaustive: every (AcousticState, Input) pair is handled
//! - No HashMap — BTreeMap for deterministic state transition tables
//! - All transitions are serializable for replay audit

use std::collections::BTreeMap;

/// The five acoustic states of the Tajweed DFA.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub enum AcousticState {
    /// Baseline — clear articulation, no active rule
    Izhar,
    /// Nun-sakin/tanwin followed by an Ikhfa trigger letter
    Ikhfa,
    /// Nun-sakin/tanwin assimilating into the following letter
    Idgham,
    /// Active prolongation (2, 4, or 6 harakah)
    Madd,
    /// Echo vibration on qaf/ta/ba/jim/dal at rest
    Qalqalah,
}

impl std::fmt::Display for AcousticState {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AcousticState::Izhar    => write!(f, "Izhar"),
            AcousticState::Ikhfa   => write!(f, "Ikhfa"),
            AcousticState::Idgham  => write!(f, "Idgham"),
            AcousticState::Madd    => write!(f, "Madd"),
            AcousticState::Qalqalah => write!(f, "Qalqalah"),
        }
    }
}

/// Arabic letter classification for Tajweed rule application.
/// Unicode codepoints from the Arabic block (U+0600–U+06FF).
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub enum LetterClass {
    NunSakin,
    Tanwin,
    ThroatLetter,   // ء ه ع ح غ خ → Izhar
    IkhfaLetter,    // 15 letters → Ikhfa
    IdghamLetter,   // 6 letters → Idgham (ي ن م و ل ر)
    MaddLetter,     // ا و ي with madd vowel
    QalqalaLetter,  // ق ط ب ج د
    Other,
}

/// One input event to the DFA — a classified letter with optional diacritic info.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct TajweedInput {
    pub codepoint: u32,
    pub class: LetterClass,
    pub has_sukun: bool,
    pub is_waqf: bool, // pause/stop position
}

/// One DFA transition record — replayable.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TransitionRecord {
    pub from_state: AcousticState,
    pub input_class: LetterClass,
    pub to_state: AcousticState,
    pub rule_applied: &'static str,
}

/// The Tajweed DFA automaton.
pub struct TajweedAutomaton {
    state: AcousticState,
    transition_log: Vec<TransitionRecord>,
}

impl TajweedAutomaton {
    pub fn new() -> Self {
        Self {
            state: AcousticState::Izhar,
            transition_log: Vec::new(),
        }
    }

    pub fn current_state(&self) -> AcousticState {
        self.state
    }

    pub fn transition_count(&self) -> usize {
        self.transition_log.len()
    }

    pub fn transition_log(&self) -> &[TransitionRecord] {
        &self.transition_log
    }

    /// Evaluate one transition. Returns the new state.
    pub fn evaluate_transition(&mut self, input: TajweedInput) -> AcousticState {
        let (next, rule) = Self::next_state(self.state, input);
        self.transition_log.push(TransitionRecord {
            from_state: self.state,
            input_class: input.class,
            to_state: next,
            rule_applied: rule,
        });
        self.state = next;
        next
    }

    /// Pure transition function — deterministic, no side effects.
    fn next_state(current: AcousticState, input: TajweedInput) -> (AcousticState, &'static str) {
        use AcousticState::*;
        use LetterClass::*;

        match (current, input.class) {
            // After NunSakin or Tanwin — apply Tajweed rules
            (Izhar, NunSakin) | (Izhar, Tanwin) => {
                // Stay in a holding pattern — the *next* letter determines the rule.
                // We encode this by transitioning to a virtual "pending" state.
                // For simplicity, we resolve on the next call using the next letter's class.
                (Ikhfa, "nun-sakin/tanwin detected — await next letter")
            }
            (Ikhfa, ThroatLetter) => (Izhar, "Izhar: clear articulation before throat letter"),
            (Ikhfa, IkhfaLetter)  => (Ikhfa, "Ikhfa: concealment"),
            (Ikhfa, IdghamLetter) => (Idgham, "Idgham: assimilation"),
            (Ikhfa, MaddLetter)   => (Izhar, "Izhar: letter after tanwin (alif madd)"),
            (Ikhfa, _)            => (Izhar, "Izhar: default resolution"),

            // Idgham resolves after one letter
            (Idgham, _) => (Izhar, "Idgham: resolved"),

            // Madd prolongation
            (Izhar, MaddLetter) if !input.has_sukun => (Madd, "Madd: prolongation begins"),
            (Madd, _) if input.has_sukun => (Izhar, "Madd: resolved at sukun"),
            (Madd, _) if input.is_waqf  => (Izhar, "Madd: resolved at waqf"),
            (Madd, _) => (Madd, "Madd: continues"),

            // Qalqalah echo
            (_, QalqalaLetter) if input.has_sukun || input.is_waqf => {
                (Qalqalah, "Qalqalah: echo on qalqalah letter at rest")
            }
            (Qalqalah, _) => (Izhar, "Qalqalah: resolved"),

            // Default: remain in Izhar
            _ => (Izhar, "Izhar: no rule applies"),
        }
    }

    /// Reset to initial state.
    pub fn reset(&mut self) {
        self.state = AcousticState::Izhar;
        self.transition_log.clear();
    }

    /// Build a lookup table for all (state, class) pairs.
    /// Returns BTreeMap<(state, class), (next_state, rule)> — deterministic iteration.
    pub fn build_transition_table() -> BTreeMap<(AcousticState, LetterClass), AcousticState> {
        use AcousticState::*;
        use LetterClass::*;
        let sample_input = |class: LetterClass| TajweedInput {
            codepoint: 0,
            class,
            has_sukun: false,
            is_waqf: false,
        };
        let states = [Izhar, Ikhfa, Idgham, Madd, Qalqalah];
        let classes = [NunSakin, Tanwin, ThroatLetter, IkhfaLetter, IdghamLetter, MaddLetter, QalqalaLetter, Other];
        let mut table = BTreeMap::new();
        for &s in &states {
            for &c in &classes {
                let (next, _) = Self::next_state(s, sample_input(c));
                table.insert((s, c), next);
            }
        }
        table
    }
}

impl Default for TajweedAutomaton {
    fn default() -> Self {
        Self::new()
    }
}

/// Classify an Arabic Unicode codepoint into a LetterClass.
/// Only the primary classification is returned; diacritic analysis is separate.
pub fn classify_codepoint(cp: u32) -> LetterClass {
    // Throat letters: ء(0x621) ه(0x647) ع(0x639) ح(0x62D) غ(0x63A) خ(0x62E)
    // Idgham letters: ي(0x64A) ن(0x646) م(0x645) و(0x648) ل(0x644) ر(0x631)
    // Qalqalah: ق(0x642) ط(0x637) ب(0x628) ج(0x62C) د(0x62F)
    // Madd: ا(0x627) و(0x648) ي(0x64A) — context-dependent, simplified here
    match cp {
        0x621 | 0x647 | 0x639 | 0x62D | 0x63A | 0x62E => LetterClass::ThroatLetter,
        0x644 | 0x631 => LetterClass::IdghamLetter, // lam+ra without ghunna
        0x64A | 0x646 | 0x645 | 0x648 => LetterClass::IdghamLetter, // with ghunna
        0x642 | 0x637 | 0x628 | 0x62C | 0x62F => LetterClass::QalqalaLetter,
        0x627 => LetterClass::MaddLetter, // alif
        // Ikhfa — letters not already classified above (excludes Qalqalah codepoints)
        // Full 15: add 0x628(ba), 0x62C(jim), 0x62F(dal), 0x637(ta), 0x642(qaf) → already Qalqalah
        0x62A | 0x62B | 0x630 | 0x632 | 0x633 |
        0x634 | 0x635 | 0x636 | 0x638 | 0x641 | 0x643 => LetterClass::IkhfaLetter,
        _ => LetterClass::Other,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn inp(class: LetterClass) -> TajweedInput {
        TajweedInput { codepoint: 0, class, has_sukun: false, is_waqf: false }
    }
    fn inp_sukun(class: LetterClass) -> TajweedInput {
        TajweedInput { codepoint: 0, class, has_sukun: true, is_waqf: false }
    }

    #[test]
    fn initial_state_is_izhar() {
        let dfa = TajweedAutomaton::new();
        assert_eq!(dfa.current_state(), AcousticState::Izhar);
    }

    #[test]
    fn nun_sakin_then_throat_gives_izhar() {
        let mut dfa = TajweedAutomaton::new();
        dfa.evaluate_transition(inp(LetterClass::NunSakin));
        let s = dfa.evaluate_transition(inp(LetterClass::ThroatLetter));
        assert_eq!(s, AcousticState::Izhar);
    }

    #[test]
    fn nun_sakin_then_ikhfa_stays_ikhfa() {
        let mut dfa = TajweedAutomaton::new();
        dfa.evaluate_transition(inp(LetterClass::NunSakin));
        let s = dfa.evaluate_transition(inp(LetterClass::IkhfaLetter));
        assert_eq!(s, AcousticState::Ikhfa);
    }

    #[test]
    fn nun_sakin_then_idgham_letter() {
        let mut dfa = TajweedAutomaton::new();
        dfa.evaluate_transition(inp(LetterClass::NunSakin));
        let s = dfa.evaluate_transition(inp(LetterClass::IdghamLetter));
        assert_eq!(s, AcousticState::Idgham);
    }

    #[test]
    fn qalqalah_at_sukun() {
        let mut dfa = TajweedAutomaton::new();
        let s = dfa.evaluate_transition(inp_sukun(LetterClass::QalqalaLetter));
        assert_eq!(s, AcousticState::Qalqalah);
    }

    #[test]
    fn qalqalah_resolves_to_izhar() {
        let mut dfa = TajweedAutomaton::new();
        dfa.evaluate_transition(inp_sukun(LetterClass::QalqalaLetter));
        let s = dfa.evaluate_transition(inp(LetterClass::Other));
        assert_eq!(s, AcousticState::Izhar);
    }

    #[test]
    fn madd_begins_and_resolves() {
        let mut dfa = TajweedAutomaton::new();
        let s1 = dfa.evaluate_transition(inp(LetterClass::MaddLetter));
        assert_eq!(s1, AcousticState::Madd);
        let s2 = dfa.evaluate_transition(inp_sukun(LetterClass::Other));
        assert_eq!(s2, AcousticState::Izhar);
    }

    #[test]
    fn transition_log_records_each_step() {
        let mut dfa = TajweedAutomaton::new();
        dfa.evaluate_transition(inp(LetterClass::NunSakin));
        dfa.evaluate_transition(inp(LetterClass::ThroatLetter));
        assert_eq!(dfa.transition_count(), 2);
    }

    #[test]
    fn reset_clears_state() {
        let mut dfa = TajweedAutomaton::new();
        dfa.evaluate_transition(inp(LetterClass::MaddLetter));
        dfa.reset();
        assert_eq!(dfa.current_state(), AcousticState::Izhar);
        assert_eq!(dfa.transition_count(), 0);
    }

    #[test]
    fn transition_table_deterministic_3x() {
        let t1 = TajweedAutomaton::build_transition_table();
        let t2 = TajweedAutomaton::build_transition_table();
        let t3 = TajweedAutomaton::build_transition_table();
        assert_eq!(t1, t2);
        assert_eq!(t2, t3);
    }

    #[test]
    fn transition_table_covers_all_state_class_pairs() {
        let table = TajweedAutomaton::build_transition_table();
        // 5 states × 8 classes = 40 entries
        assert_eq!(table.len(), 40);
    }

    #[test]
    fn classify_throat_letters() {
        assert_eq!(classify_codepoint(0x621), LetterClass::ThroatLetter); // hamza
        assert_eq!(classify_codepoint(0x647), LetterClass::ThroatLetter); // ha
    }

    #[test]
    fn classify_qalqalah_letters() {
        assert_eq!(classify_codepoint(0x642), LetterClass::QalqalaLetter); // qaf
        assert_eq!(classify_codepoint(0x628), LetterClass::QalqalaLetter); // ba
    }
}
