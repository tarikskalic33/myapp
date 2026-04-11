"""
Metacognitive Calibration Proof — Phase 2
==========================================
Correlates the system's predicted HD (derived from state.json
stress_level / attention_gain) against actual accuracy on the
ARC held-out set from Phase 1.

Predicted confidence formula (biological model):
  stress = state.biology.stress_level       (0–1, optimal 0.3–0.6)
  attn   = state.biology.attention_gain     (0–1)
  hormetic_factor = 1 - |stress - 0.45| * 2   (peaks at 0.45)
  predicted_confidence = attn * hormetic_factor

Metrics:
  Brier Score = mean( (predicted_confidence - actual_accuracy)^2 )
  Pearson r   = correlation(predicted_confidence, actual_accuracy)

Output: docs/outputs/metacognition_proof.json
"""

import sys, json, time, math
import numpy as np
from pathlib import Path
from datetime import datetime, timezone

ROOT     = Path(__file__).parent.parent
ARC_ROOT = ROOT / "arc"
sys.path.insert(0, str(ARC_ROOT))
sys.path.insert(0, str(ROOT))

# ── LOAD STATE ────────────────────────────────────────────────────────────────

def load_state() -> dict:
    path = ROOT / ".forge" / "state.json"
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def get_bio_params(state: dict) -> dict:
    bio = state.get("biology", state.get("cognition", {}).get("neuromodulators", {}))
    return {
        "stress_level":   float(bio.get("stress_level",  0.4262)),
        "attention_gain": float(bio.get("attention_gain", 0.82)),
        "atp_balance":    float(bio.get("atp_balance",   2100)),
    }


# ── PREDICTED CONFIDENCE MODEL ────────────────────────────────────────────────

def predict_confidence(stress: float, attn: float, task_complexity: float = 0.5) -> float:
    """
    Biological confidence prediction.
    Hormetic curve: optimal stress = 0.45, degrades beyond 0.8.
    """
    # Hard cap: above 0.8 stress = collapse
    if stress > 0.8:
        hormetic = 0.1
    else:
        # Inverted parabola centered at 0.45
        hormetic = 1.0 - 2.0 * abs(stress - 0.45)
        hormetic = max(0.1, hormetic)

    base_confidence = attn * hormetic

    # Adjust for task complexity (more complex = lower confidence)
    adjusted = base_confidence * (1.0 - 0.3 * task_complexity)
    return round(max(0.0, min(1.0, adjusted)), 4)


# ── TASK COMPLEXITY ───────────────────────────────────────────────────────────

COMPLEXITY_MAP = {
    "ROT90":              0.1,
    "ROT180":             0.1,
    "FLIP_X":             0.1,
    "FLIP_Y":             0.1,
    "TRANSPOSE":          0.15,
    "INVERT":             0.2,
    "FLIP_X_then_FLIP_Y": 0.35,
    "ROT90_twice":        0.3,
    "FLIP_X_then_ROT90":  0.4,
    "INVERT_then_FLIP_X": 0.45,
    "ROT90_FLIP_X_ROT90": 0.6,
}


# ── CALIBRATION METRICS ───────────────────────────────────────────────────────

def brier_score(predicted: list[float], actual: list[float]) -> float:
    """Mean squared error between predicted confidence and actual binary outcomes."""
    n = len(predicted)
    return round(sum((p - a) ** 2 for p, a in zip(predicted, actual)) / n, 4)


def pearson_r(x: list[float], y: list[float]) -> float:
    """Pearson correlation coefficient."""
    n = len(x)
    mx, my = sum(x) / n, sum(y) / n
    num = sum((xi - mx) * (yi - my) for xi, yi in zip(x, y))
    den = math.sqrt(
        sum((xi - mx) ** 2 for xi in x) *
        sum((yi - my) ** 2 for yi in y)
    )
    return round(num / den, 4) if den > 0 else 0.0


def calibration_error(predicted: list[float], actual: list[float], n_bins: int = 5) -> float:
    """Expected Calibration Error (ECE) — how well confidence tracks accuracy per bin."""
    bins = np.linspace(0, 1, n_bins + 1)
    ece  = 0.0
    n    = len(predicted)
    for i in range(n_bins):
        lo, hi = bins[i], bins[i+1]
        mask = [lo <= p < hi for p in predicted]
        if not any(mask):
            continue
        bin_pred = [p for p, m in zip(predicted, mask) if m]
        bin_act  = [a for a, m in zip(actual, mask) if m]
        ece += (len(bin_pred) / n) * abs(
            sum(bin_pred) / len(bin_pred) - sum(bin_act) / len(bin_act)
        )
    return round(ece, 4)


# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("METACOGNITIVE CALIBRATION PROOF — Phase 2")
    print("=" * 60)

    # Load Phase 1 results
    arc_proof_path = ROOT / "docs" / "outputs" / "arc_grammar_proof.json"
    if not arc_proof_path.exists():
        print("[ERROR] arc_grammar_proof.json not found. Run arc_held_out_eval.py first.")
        sys.exit(1)

    arc_proof   = json.loads(arc_proof_path.read_text(encoding="utf-8"))
    task_results = arc_proof["task_results"]

    # Load OS biological state
    state  = load_state()
    bio    = get_bio_params(state)
    stress = bio["stress_level"]
    attn   = bio["attention_gain"]

    print(f"\n  OS State: stress={stress:.4f}  attn={attn:.4f}  atp={bio['atp_balance']:.0f}")
    print(f"  Hormetic zone: {'OPTIMAL (0.3-0.6)' if 0.3 <= stress <= 0.6 else 'SUBOPTIMAL'}")
    print(f"  Tasks to calibrate: {len(task_results)}\n")

    predicted  = []
    actual     = []
    per_task   = []

    for r in task_results:
        transform  = r["transform"]
        complexity = COMPLEXITY_MAP.get(transform, 0.4)
        pred_conf  = predict_confidence(stress, attn, complexity)
        actual_acc = float(r["accuracy"])

        predicted.append(pred_conf)
        actual.append(actual_acc)
        per_task.append({
            "task_id":              r["task_id"],
            "transform":            transform,
            "complexity":           complexity,
            "predicted_confidence": pred_conf,
            "actual_accuracy":      actual_acc,
            "delta":                round(abs(pred_conf - actual_acc), 4),
            "solved":               r["solved"],
        })

    # Metrics
    bs  = brier_score(predicted, actual)
    r   = pearson_r(predicted, actual)
    ece = calibration_error(predicted, actual)
    mean_pred = round(sum(predicted) / len(predicted), 4)
    mean_act  = round(sum(actual)    / len(actual),    4)

    # HD of the metacognitive system itself
    hd_metacog = round(abs(mean_pred - mean_act), 4)

    print(f"  Mean predicted confidence: {mean_pred:.4f}")
    print(f"  Mean actual accuracy:      {mean_act:.4f}")
    print(f"  Metacognitive HD:          {hd_metacog:.4f}")
    print(f"  Brier Score:               {bs:.4f}  (lower=better, 0=perfect)")
    print(f"  Pearson r:                 {r:.4f}  (higher=better, 1.0=perfect calibration)")
    print(f"  ECE:                       {ece:.4f}  (lower=better)")

    # Interpret
    if bs < 0.1 and r > 0.5:
        verdict = "WELL_CALIBRATED"
    elif bs < 0.2:
        verdict = "MODERATELY_CALIBRATED"
    else:
        verdict = "POORLY_CALIBRATED"
    print(f"\n  Verdict: {verdict}")

    proof = {
        "timestamp":                datetime.now(timezone.utc).isoformat(),
        "phase":                    "METACOGNITIVE_CALIBRATION_PROOF",
        "os_state": {
            "stress_level":         stress,
            "attention_gain":       attn,
            "atp_balance":          bio["atp_balance"],
            "hormetic_zone":        "optimal" if 0.3 <= stress <= 0.6 else "suboptimal",
        },
        "calibration_metrics": {
            "brier_score":          bs,
            "pearson_r":            r,
            "ece":                  ece,
            "mean_predicted":       mean_pred,
            "mean_actual":          mean_act,
            "metacognitive_hd":     hd_metacog,
            "verdict":              verdict,
        },
        "n_tasks":                  len(task_results),
        "arc_success_rate":         arc_proof["success_rate"],
        "per_task":                 per_task,
        "methodology": (
            "Predicted confidence derived from biological state: "
            "confidence = attention_gain × hormetic(stress_level, peak=0.45). "
            "Actual accuracy = exact match on held-out ARC grid. "
            "Brier Score measures calibration quality. "
            "Pearson r measures correlation between predicted confidence and actual success."
        ),
    }

    out = ROOT / "docs" / "outputs" / "metacognition_proof.json"
    out.write_text(json.dumps(proof, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n  Proof saved: {out}")
    return proof


if __name__ == "__main__":
    main()
