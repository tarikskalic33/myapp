# DisciplineNPC — The voice of structure in the Inner Sanctum
# Bible: DISCIPLINE teaches consistency, routine, and the cost of entropy.
# Restores Emotional Resonance when engaged. Rewards consistency streak.
extends SanctumNPC

## Dialogue sets — rotates based on behavioral integrity level
var _dialogue_sets: Array[Array] = [
	# Low integrity (0-2) — firm, direct
	[
		"You keep showing up. That's the only thing that matters right now.",
		"Structure isn't a cage. It's the scaffold you build yourself on.",
		"Every time you swing that weapon with intention, you reclaim a piece of yourself.",
		"Don't confuse stillness with stagnation. Rest is earned structure.",
	],
	# Mid integrity (3-5) — encouraging
	[
		"I can see the pattern forming. You're starting to hold the shape.",
		"Consistency isn't perfection. It's the willingness to return after failure.",
		"The maze rearranges itself because YOU are rearranging. That's not chaos — that's growth.",
		"Your streak matters. Not as a number — as proof that you chose to stay.",
	],
	# High integrity (6+) — philosophical
	[
		"You no longer need me to tell you what discipline is. You embody it.",
		"The Warden watches for cracks in your routine. You've stopped giving him cracks.",
		"Structure and freedom aren't opposites. One enables the other.",
		"When the static rises, you don't flinch anymore. That's not numbness — that's mastery.",
	]
]

func _ready() -> void:
	npc_name = "DISCIPLINE"
	npc_color = Color(0.4, 0.7, 1.0, 1.0)  # Blue — structure, calm
	interaction_prompt = "Press E to speak"
	super._ready()
	interacted.connect(_on_discipline_interacted)

func _on_discipline_interacted(_npc: SanctumNPC) -> void:
	var integrity: int = GameState.behavioral_integrity
	var set_index: int = clampi(integrity / 3, 0, _dialogue_sets.size() - 1)
	var lines: Array[String] = []
	lines.assign(_dialogue_sets[set_index])

	var ui = DialogueUI.get_instance()
	if ui:
		ui.open("DISCIPLINE", npc_color, lines, _on_dialogue_complete)

func _on_dialogue_complete() -> void:
	# Reward: restore emotional resonance
	var restore: float = 10.0 + GameState.behavioral_integrity * 2.0
	GameState.emotional_resonance = clampf(
		GameState.emotional_resonance + restore, 0.0, 100.0
	)
	print("DISCIPLINE: Emotional resonance restored +%.1f" % restore)

	# Bonus: if consistency streak is active, restore mana too
	if GameState.consistency_streak >= 3:
		GameState.mental_mana = clampf(
			GameState.mental_mana + 10.0, 0.0, GameState.max_mental_mana
		)
		print("DISCIPLINE: Consistency bonus — Mental Mana +10")
