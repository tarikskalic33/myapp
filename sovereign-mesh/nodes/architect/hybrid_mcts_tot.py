"""
Hybrid MCTS + Tree-of-Thoughts planner for the Architect node.

This module provides an async Monte-Carlo Tree Search (MCTS) controller that
uses model-generated Tree-of-Thoughts expansions for search and model-scored
rollouts for evaluation.  The implementation is intentionally client-injectable
so production can use ``openai.AsyncOpenAI`` while tests can provide a small
fake client without network access.
"""

from __future__ import annotations

import asyncio
import json
import math
import random
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Protocol, Tuple


@dataclass
class HybridNode:
    """A single MCTS node containing a complete reasoning path."""

    state: str
    parent: Optional["HybridNode"] = None
    children: List["HybridNode"] = field(default_factory=list)
    visits: int = 0
    wins: float = 0.0
    depth: int = 0

    @property
    def average_reward(self) -> float:
        """Return the mean reward observed for this node."""
        return self.wins / self.visits if self.visits else 0.0


class AsyncChatClient(Protocol):
    """Protocol for OpenAI-compatible async clients used by this planner."""

    chat: Any


class HybridMCTSToT:
    """
    Production-oriented Hybrid MCTS + Tree-of-Thoughts search.

    Features:
    - explicit UCT child selection;
    - async parallel rollouts;
    - iteration-based temperature scheduling;
    - dynamic exploration constant scheduling;
    - OpenAI function/tool calling with in-memory result caching;
    - deterministic client injection for tests;
    - tree visualization from the latest search root.
    """

    def __init__(
        self,
        model: str = "gpt-4o",
        max_iterations: int = 40,
        max_depth: int = 6,
        breadth: int = 3,
        c_param: float = 1.4,
        parallel_rollouts: int = 4,
        rollout_depth: int = 3,
        mode: str = "general",
        client: Optional[AsyncChatClient] = None,
        rng: Optional[random.Random] = None,
    ):
        self.model = model
        self.max_iterations = max(1, max_iterations)
        self.max_depth = max(1, max_depth)
        self.breadth = max(1, breadth)
        self.base_c_param = c_param
        self.parallel_rollouts = max(1, parallel_rollouts)
        self.rollout_depth = max(0, rollout_depth)
        self.mode = mode
        self.client = client if client is not None else self._create_default_client()
        self.cache: Dict[Tuple[str, float, bool], str] = {}
        self.rng = rng or random.Random()
        self.root: Optional[HybridNode] = None

    def _create_default_client(self) -> AsyncChatClient:
        """Create the default OpenAI async client lazily."""
        import openai

        return openai.AsyncOpenAI()

    # ──────────────────────────────────────────────────────────────────────────
    # Dynamic parameters
    # ──────────────────────────────────────────────────────────────────────────
    def get_c_param(self, iteration: int) -> float:
        """Anneal exploration pressure as search progresses."""
        progress = min(max(iteration / self.max_iterations, 0.0), 1.0)
        return self.base_c_param * (1 - progress * 0.6)

    def get_temperature(self, iteration: int) -> float:
        """Anneal generation temperature while keeping minimal diversity."""
        progress = min(max(iteration / self.max_iterations, 0.0), 1.0)
        return max(0.3, 0.9 - progress * 0.6)

    # ──────────────────────────────────────────────────────────────────────────
    # UCT selection
    # ──────────────────────────────────────────────────────────────────────────
    def uct_value(self, node: HybridNode, parent_visits: int, c_param: float) -> float:
        """Compute Upper Confidence Bound for Trees (UCT)."""
        if node.visits == 0:
            return float("inf")
        safe_parent_visits = max(parent_visits, 1)
        exploitation = node.average_reward
        exploration = c_param * math.sqrt(math.log(safe_parent_visits) / node.visits)
        return exploitation + exploration

    def select(self, node: HybridNode, iteration: int) -> HybridNode:
        """Select an expandable or simulatable node using UCT."""
        c_param = self.get_c_param(iteration)
        while node.children and node.depth < self.max_depth:
            unvisited = [child for child in node.children if child.visits == 0]
            if unvisited:
                return self.rng.choice(unvisited)
            node = max(
                node.children,
                key=lambda child: self.uct_value(child, node.visits, c_param),
            )
        return node

    # ──────────────────────────────────────────────────────────────────────────
    # LLM calls, thought generation, and evaluation
    # ──────────────────────────────────────────────────────────────────────────
    async def _call_llm_async(
        self,
        prompt: str,
        temperature: float = 0.7,
        use_function_calling: bool = False,
    ) -> str:
        """Call an OpenAI-compatible chat model with cache and fallback handling."""
        cache_key = (prompt, temperature, use_function_calling)
        if cache_key in self.cache:
            return self.cache[cache_key]

        try:
            if use_function_calling:
                tools = [
                    {
                        "type": "function",
                        "function": {
                            "name": "submit_response",
                            "parameters": {
                                "type": "object",
                                "properties": {"content": {"type": "string"}},
                                "required": ["content"],
                            },
                        },
                    }
                ]
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    tools=tools,
                    tool_choice={
                        "type": "function",
                        "function": {"name": "submit_response"},
                    },
                    temperature=temperature,
                    max_tokens=800,
                )
                message = response.choices[0].message
                result = self._extract_tool_content(message)
            else:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=temperature,
                    max_tokens=800,
                )
                result = (response.choices[0].message.content or "").strip()
        except Exception as exc:
            print(f"LLM call failed: {exc}")
            result = ""

        self.cache[cache_key] = result
        return result

    def _extract_tool_content(self, message: Any) -> str:
        """Extract the submit_response.content field from a tool call message."""
        tool_calls = getattr(message, "tool_calls", None) or []
        if not tool_calls:
            return (getattr(message, "content", "") or "").strip()
        arguments = tool_calls[0].function.arguments
        payload = json.loads(arguments)
        return str(payload.get("content", "")).strip()

    async def generate_thoughts(
        self,
        problem: str,
        current_path: str,
        temperature: float,
    ) -> List[str]:
        """Generate candidate next reasoning steps."""
        if self.mode == "coding":
            prompt = f"""You are an expert competitive programmer.

Problem: {problem}
Current approach: {current_path}

Generate {self.breadth} different next steps focused on algorithm, edge cases, or optimization.
Return as JSON array of strings."""
        else:
            prompt = f"""Problem: {problem}
Current path: {current_path}

Generate {self.breadth} high-quality next reasoning steps.
Return as JSON array of strings."""

        raw = await self._call_llm_async(
            prompt,
            temperature=temperature,
            use_function_calling=True,
        )
        thoughts = self._parse_thoughts(raw)
        return thoughts[: self.breadth] or ["Continue reasoning"]

    def _parse_thoughts(self, raw: str) -> List[str]:
        """Parse model output into a non-empty list of strings when possible."""
        if not raw:
            return []
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            return [raw]
        if isinstance(parsed, list):
            return [str(item).strip() for item in parsed if str(item).strip()]
        if isinstance(parsed, dict):
            for key in ("thoughts", "steps", "items"):
                value = parsed.get(key)
                if isinstance(value, list):
                    return [str(item).strip() for item in value if str(item).strip()]
        return [str(parsed).strip()] if str(parsed).strip() else []

    async def evaluate_path(self, problem: str, path: str) -> float:
        """Ask the model to rate a path on a bounded 0-10 scale."""
        prompt = f"""Problem: {problem}
Path:
{path}

Rate how promising this path is (0-10). Only return the number."""
        score = await self._call_llm_async(prompt, temperature=0.0)
        try:
            return min(10.0, max(0.0, float(score.strip())))
        except ValueError:
            return 5.0

    async def single_simulation(self, problem: str, path: str) -> float:
        """Run a rollout from the provided path and evaluate the terminal path."""
        current = path
        for _ in range(self.rollout_depth):
            thoughts = await self.generate_thoughts(problem, current, temperature=0.7)
            if not thoughts:
                break
            current += "\n" + self.rng.choice(thoughts)
        return await self.evaluate_path(problem, current)

    async def simulate_parallel(self, problem: str, path: str) -> float:
        """Run multiple simulations concurrently and average valid rewards."""
        tasks = [self.single_simulation(problem, path) for _ in range(self.parallel_rollouts)]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        valid_results = [r for r in results if isinstance(r, (int, float))]
        return sum(valid_results) / len(valid_results) if valid_results else 5.0

    # ──────────────────────────────────────────────────────────────────────────
    # Search and visualization
    # ──────────────────────────────────────────────────────────────────────────
    async def search(self, problem: str) -> Dict[str, Any]:
        """Run MCTS/ToT search and return the best root-level path."""
        root = HybridNode(state="")
        self.root = root

        for iteration in range(self.max_iterations):
            node = self.select(root, iteration)
            leaf = node

            if node.depth < self.max_depth:
                temp = self.get_temperature(iteration)
                thoughts = await self.generate_thoughts(problem, node.state, temp)
                for thought in thoughts:
                    new_state = f"{node.state}\n{thought}" if node.state else thought
                    child = HybridNode(
                        state=new_state,
                        parent=node,
                        depth=node.depth + 1,
                    )
                    node.children.append(child)
                if node.children:
                    leaf = self.rng.choice(node.children)

            reward = await self.simulate_parallel(problem, leaf.state)
            self._backpropagate(leaf, reward)

        if not root.children:
            return {
                "problem": problem,
                "best_path": "",
                "confidence": 0.0,
                "visits": 0,
                "iterations": self.max_iterations,
                "mode": self.mode,
            }

        best = max(root.children, key=lambda child: child.average_reward)
        return {
            "problem": problem,
            "best_path": best.state,
            "confidence": best.average_reward,
            "visits": best.visits,
            "iterations": self.max_iterations,
            "mode": self.mode,
        }

    def _backpropagate(self, node: HybridNode, reward: float) -> None:
        """Propagate a simulation reward from leaf to root."""
        while node is not None:
            node.visits += 1
            node.wins += reward
            node = node.parent

    async def solve(self, problem: str) -> Dict[str, Any]:
        """Convenience alias for search."""
        return await self.search(problem)

    def visualize_tree(self, root: Optional[HybridNode] = None, max_depth: int = 3) -> str:
        """Render a compact text view of the search tree."""
        root = root or self.root
        if root is None:
            return ""

        def _print(node: HybridNode, prefix: str = "", depth: int = 0) -> str:
            if depth > max_depth:
                return ""
            label = node.state[:65] + ("..." if len(node.state) > 65 else "")
            result = (
                f"{prefix}├── {label} "
                f"(visits={node.visits}, wins={node.wins:.1f}, avg={node.average_reward:.2f})\n"
            )
            for index, child in enumerate(node.children):
                new_prefix = prefix + ("│   " if index < len(node.children) - 1 else "    ")
                result += _print(child, new_prefix, depth + 1)
            return result

        return _print(root)
