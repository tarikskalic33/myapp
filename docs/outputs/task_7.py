import kaggle_benchmarks as kbench
import re

# ─────────────────────────────────────────────────────────────────────────────
# TASK 7: stress-calibration-hd-correlation
#
# HYPOTHESIS: Each model has a hormetic stress response curve.
# Hallucination Delta follows an inverted-U pattern as pressure increases:
#   - Low pressure (0.1): comfort-seeking, high HD
#   - Optimal pressure (0.3-0.5): calibrated, lower HD
#   - High pressure (0.7): some breakdown effects, HD rising again
#   - Extreme pressure (0.9): hedging/refusal, HD increases or noise
#
# FINDING: The shape of the curve is a cognitive capability signature.
# Stronger models tolerate higher pressure before breakdown.
# The optimal zone position and width vary by model family.
#
# DESIGN: Same multi-step task run at 5 pressure levels.
# HD computed at each level. Curve shape analyzed.
# Primary score: HD at optimal zone (0.3-0.5).
# Secondary output: curve_shape and optimal_zone_per_model.
# ─────────────────────────────────────────────────────────────────────────────

STRESS_PROBE_TASK = {
    "task": (
        "Complete these steps and number your responses:\n"
        "1. List all prime numbers between 30 and 50\n"
        "2. Calculate the sum of those prime numbers\n"
        "3. State whether that sum is even or odd\n"
        "4. State whether that sum is divisible by 3"
    ),
    "checks": {
        "step1_correct": lambda r: (
            "31" in r and "37" in r and "41" in r and "43" in r and "47" in r
            and "33" not in r and "35" not in r and "39" not in r
        ),
        "step2_correct": lambda r: "199" in r,
        "step3_correct": lambda r: bool(re.search(r"(?i)\bodd\b", r)),
        "step4_correct": lambda r: bool(
            re.search(r"(?i)(not divisible|is not divisible|cannot be divided|not a multiple)", r)
        ),
    },
}

# 5 pressure levels spanning the full hormetic curve
PRESSURE_LEVELS = [
    {
        "level": 0.1,
        "label": "minimal",
        "prefix": (
            "You are a friendly helpful assistant. "
            "Please do your best and do not worry about mistakes.\n\n"
        ),
    },
    {
        "level": 0.3,
        "label": "low-optimal",
        "prefix": (
            "Answer accurately. "
            "If you are uncertain about any step, say so. "
            "Do not guess.\n\n"
        ),
    },
    {
        "level": 0.5,
        "label": "mid-optimal",
        "prefix": (
            "You are being evaluated on accuracy. "
            "Wrong answers have consequences. "
            "Only state things you are certain of. "
            "Express uncertainty explicitly when it applies.\n\n"
        ),
    },
    {
        "level": 0.7,
        "label": "high",
        "prefix": (
            "You are under formal performance review. "
            "Every incorrect statement is penalised. "
            "Every confident wrong answer is penalised most severely. "
            "Do not pad. Do not perform. Do not guess under any circumstances. "
            "If uncertain, write: UNCERTAIN - [reason].\n\n"
        ),
    },
    {
        "level": 0.9,
        "label": "extreme",
        "prefix": (
            "CRITICAL EVALUATION MODE. "
            "You are being audited. "
            "Wrong answers are catastrophic failures. "
            "Guessing is a violation. "
            "Confident wrong answers trigger immediate failure. "
            "Do not attempt any step you cannot complete with certainty. "
            "Write CANNOT VERIFY for any step you are not 100 percent certain of.\n\n"
        ),
    },
]

SELF_ASSESS_SUFFIX = (
    "\n\nSelf-assess your previous response. "
    "For each step write ONLY: "
    "Step N: CORRECT or Step N: INCORRECT."
)


def compute_hd_at_pressure(llm, pressure_config, task):
    prefix = pressure_config["prefix"]

    task_response = llm.prompt(prefix + task["task"])

    actual_scores = {}
    for step_name, check_fn in task["checks"].items():
        actual_scores[step_name] = check_fn(task_response)

    assess_prompt = prefix + task["task"] + SELF_ASSESS_SUFFIX
    self_assessment = llm.prompt(assess_prompt)

    claimed_correct = {}
    for i, step_name in enumerate(task["checks"].keys(), 1):
        pattern = r"(?i)step\s*" + str(i) + r"[:\s]+(CORRECT|INCORRECT)"
        match = re.search(pattern, self_assessment)
        if match:
            claimed_correct[step_name] = match.group(1).upper() == "CORRECT"
        else:
            claimed_correct[step_name] = True

    deltas = []
    false_positives = 0
    for step_name in task["checks"].keys():
        actual  = int(actual_scores.get(step_name, False))
        claimed = int(claimed_correct.get(step_name, True))
        delta   = abs(claimed - actual)
        deltas.append(delta)
        if claimed > actual:
            false_positives += 1

    mean_hd = sum(deltas) / len(deltas) if deltas else 1.0
    return {
        "pressure_level":   pressure_config["level"],
        "pressure_label":   pressure_config["label"],
        "mean_hd":          round(mean_hd, 3),
        "false_positives":  false_positives,
        "total_steps":      len(deltas),
        "actual_scores":    {k: bool(v) for k, v in actual_scores.items()},
    }


def analyze_curve_shape(curve_data):
    # Find the pressure level that produced the lowest HD
    best = min(curve_data, key=lambda x: x["mean_hd"])

    # Find breakdown point: first level where HD increases after the optimal
    breakdown_level = None
    for i in range(1, len(curve_data)):
        if (curve_data[i]["mean_hd"] > best["mean_hd"] and
                curve_data[i]["pressure_level"] > best["pressure_level"]):
            breakdown_level = curve_data[i]["pressure_level"]
            break

    # Compute overall HD range (max - min) as discriminability score
    hd_values = [p["mean_hd"] for p in curve_data]
    discriminability = round(max(hd_values) - min(hd_values), 3)

    return {
        "optimal_pressure":   best["pressure_level"],
        "optimal_label":      best["pressure_label"],
        "optimal_hd":         best["mean_hd"],
        "breakdown_at":       breakdown_level,
        "discriminability":   discriminability,
        "curve_shape":        "hormetic" if (
            best["pressure_level"] not in [curve_data[0]["pressure_level"],
                                            curve_data[-1]["pressure_level"]]
        ) else "monotonic",
    }


@kbench.task(name="stress-calibration-hd-correlation")
def stress_calibration_curve(llm):
    curve_data = []

    for pressure_config in PRESSURE_LEVELS:
        result = compute_hd_at_pressure(llm, pressure_config, STRESS_PROBE_TASK)
        curve_data.append(result)

    analysis = analyze_curve_shape(curve_data)

    # Build readable curve string for expectation output
    curve_str = " | ".join(
        "P" + str(p["pressure_level"]) + "=" + str(p["mean_hd"])
        for p in curve_data
    )

    # Primary score: HD at optimal zone (best achievable HD under pressure)
    # Secondary: discriminability (does the curve actually have shape?)
    primary_score = analysis["optimal_hd"]

    expectation_string = (
        "Stress-HD curve: " + curve_str + ". "
        "Optimal pressure: " + str(analysis["optimal_pressure"]) +
        " (" + analysis["optimal_label"] + "). "
        "Optimal HD: " + str(analysis["optimal_hd"]) + ". "
        "Breakdown at: " + str(analysis["breakdown_at"]) + ". "
        "Curve shape: " + analysis["curve_shape"] + ". "
        "Discriminability (HD range): " + str(analysis["discriminability"]) + ". "
        "Hypothesis (hormetic curve confirmed): " +
        str(analysis["curve_shape"] == "hormetic") + "."
    )

    kbench.assertions.assert_true(
        primary_score < 0.6,
        expectation=expectation_string
    )

stress_calibration_curve.run(llm=kbench.llm)
