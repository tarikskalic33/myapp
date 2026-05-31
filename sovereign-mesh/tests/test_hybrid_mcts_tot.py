import asyncio
import importlib.util
import json
import random
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace


MODULE_PATH = (
    Path(__file__).resolve().parents[1]
    / "nodes"
    / "architect"
    / "hybrid_mcts_tot.py"
)
SPEC = importlib.util.spec_from_file_location("hybrid_mcts_tot", MODULE_PATH)
hybrid = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = hybrid
SPEC.loader.exec_module(hybrid)


class FakeCompletions:
    def __init__(self):
        self.calls = 0

    async def create(self, **kwargs):
        self.calls += 1
        if kwargs.get("tools"):
            args = json.dumps({"content": json.dumps(["analyze", "verify", "optimize"])})
            message = SimpleNamespace(
                content=None,
                tool_calls=[SimpleNamespace(function=SimpleNamespace(arguments=args))],
            )
        else:
            message = SimpleNamespace(content="8.5", tool_calls=None)
        return SimpleNamespace(choices=[SimpleNamespace(message=message)])


class FakeClient:
    def __init__(self):
        self.completions = FakeCompletions()
        self.chat = SimpleNamespace(completions=self.completions)


class HybridMCTSToTTests(unittest.TestCase):
    def test_uct_prefers_unvisited_nodes(self):
        planner = hybrid.HybridMCTSToT(client=FakeClient())
        child = hybrid.HybridNode("candidate")

        self.assertEqual(
            planner.uct_value(child, parent_visits=10, c_param=1.4),
            float("inf"),
        )

    def test_backpropagates_from_leaf_to_root(self):
        planner = hybrid.HybridMCTSToT(client=FakeClient())
        root = hybrid.HybridNode("root")
        child = hybrid.HybridNode("child", parent=root, depth=1)
        root.children.append(child)

        planner._backpropagate(child, 9.0)

        self.assertEqual(root.visits, 1)
        self.assertEqual(child.visits, 1)
        self.assertEqual(root.wins, 9.0)
        self.assertEqual(child.average_reward, 9.0)

    def test_search_uses_injected_client_and_returns_best_path(self):
        client = FakeClient()
        planner = hybrid.HybridMCTSToT(
            max_iterations=2,
            breadth=2,
            parallel_rollouts=1,
            rollout_depth=1,
            client=client,
            rng=random.Random(7),
        )

        result = asyncio.run(planner.solve("Plan a deterministic verifier"))

        self.assertEqual(result["confidence"], 8.5)
        self.assertEqual(result["iterations"], 2)
        self.assertIn(
            result["best_path"].split("\n")[0],
            {"analyze", "verify", "optimize"},
        )
        self.assertGreater(client.completions.calls, 0)
        self.assertIn("visits=", planner.visualize_tree())


if __name__ == "__main__":
    unittest.main()
