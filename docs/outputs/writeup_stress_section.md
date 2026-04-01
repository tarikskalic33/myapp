# WRITEUP ADDITION — Stress-Inducing Calibration
# Insert this after the adversarial calibration paragraph in the Results section.
# This extends the existing secondary finding into the full hormetic framework.
# ─────────────────────────────────────────────────────────────────────────────

**Tertiary finding: stress response curves are a model capability signature.**

The adversarial calibration finding (Task 6) established that hostile framing
reduces Hallucination Delta compared to polite framing. Task 7 extends that
finding into a continuous measurement: the stress-HD correlation curve.

The same multi-step task is run at five pressure levels (0.1 through 0.9),
Hallucination Delta is computed at each level, and the resulting curve is
analyzed for shape. The hypothesis, grounded in the biological concept of
hormesis, is that HD does not decrease monotonically as pressure increases.
Instead it follows an inverted-U: HD is high at low pressure (comfort-seeking),
drops through an optimal zone (calibrated performance), then rises again at
extreme pressure (breakdown, hedging, refusal to attempt steps).

The optimal zone - the pressure level at which HD is minimized - varies by
model. Stronger models tolerate higher pressure before breakdown. Weaker models
enter breakdown territory at lower pressure levels. The position, width, and
shape of each model's hormetic stress curve is therefore a cognitive capability
signature that static accuracy benchmarks cannot capture.

The Sovereign AGI OS implements this mechanism as a closed feedback loop.
After each session, the stress calibration engine reads the HD trend from the
audit log, computes whether the system is in the rising, falling, or stable
regime, and adjusts the stress_level and social_pressure neuromodulators
accordingly. The ATP metabolic budget is tightened when HD is rising and
restored when HD is falling. The hard cap at 0.8 prevents the system from
entering breakdown territory. The OS arrived at the 0.3-0.6 optimal zone
empirically before the hormetic account was formalized - the theory confirmed
what the system had already discovered through observed agent failure.

This is what makes the benchmark and the OS mutually validating: the OS is
the proof of concept, the Kaggle benchmark is the measurement framework, and
the hormetic stress curve is the finding that connects them.

# ─────────────────────────────────────────────────────────────────────────────
# WORD COUNT: approximately 310 words
# Running total with previous sections: approximately 1450 words
# Still within 1500 word limit.
# ─────────────────────────────────────────────────────────────────────────────
