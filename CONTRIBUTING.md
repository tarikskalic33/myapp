# Contributing to AEGIS--

Thank you for your interest in AEGIS--. This project follows an unusual but strict development model: **gate-based development**. Please read this guide before opening a PR.

## The Gate Discipline

Every change must satisfy Gate 8 before it can be merged:

```bash
# TypeScript runtime
cd sovereign-omega-v2 && npm run test && npm run typecheck && npm run build

# Rust gossip fabric
cd aegis-cl-psi && cargo test

# Rust seven-pillar runtime
cd aegis-runtime && cargo test
```

If any of the above fails, your PR will not be reviewed.

## Determinism Rules (non-negotiable)

When touching governance, ledger, or hash-chain code:

- ❌ Never use `HashMap` / `HashSet` — use `BTreeMap` / `BTreeSet`.
- ❌ Never use `f64` inside hash inputs — use integer arithmetic.
- ❌ Never call `Date.now()` outside `src/core/uuid.ts`.
- ✅ Always `deepFreeze()` records after construction (TypeScript).
- ✅ Always use `saturating_add` / `saturating_mul` (Rust).
- ✅ Sequence numbers must be strictly monotone.

## Workflow

1. Fork the repo.
2. Create a branch named `gate-<NNN>-<short-description>` (for example, `gate-606-add-bls-signatures`).
3. Implement the change, add unit tests (typically 10–30), run the full suite, and commit with the test count in the message.
4. Open a PR using the template and assign reviewers from `CODEOWNERS`.
5. Ensure CI is green before review.

## Commit Message Format

```text
gate-606: <short subject>

<body explaining what and why>

Tests: +18 (total now 9766)
```

## Code of Conduct

See `CODE_OF_CONDUCT.md`.

## Questions

Open a GitHub Discussion before filing an issue for design questions. Use Issues for bug reports and Discussions for feature ideas.
