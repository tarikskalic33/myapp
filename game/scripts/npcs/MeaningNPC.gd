# MeaningNPC — The voice of purpose in the Inner Sanctum
# Bible: MEANING teaches why. Why fight. Why persist. Why the maze exists.
# Reduces static meter when engaged. Rewards emotional scan usage.
extends SanctumNPC

## Dialogue sets — rotates based on emotional resonance level
var _dialogue_sets: Array[Array] = [
	# Low resonance (0-25) — existential, searching
	[
		"You don't know why you're here yet. That's okay. Neither did I, once.",
		"The maze isn't punishment. It's the shape of a question you haven't answered.",
		"Static fills the silence where meaning should be. Find the signal.",
		"Every enemy you scan reveals a piece of what you're fighting FOR, not just against.",
	],
	# Mid resonance (26-60) — connecting
	[
		"You're starting to feel it, aren't you? The weight behind each swing.",
		"The Warden doesn't fear your strength. He fears your clarity.",
		"Meaning isn't found. It's built. One choice at a time, one room at a time.",
		"When you scan an enemy and see its motivation — you're seeing a mirror.",
	],
	# High resonance (61+) — transcendent
	[
		"The maze is you. You know that now.",
		"Every wall was a boundary you set for yourself. Every door, a decision you were afraid to make.",
		"The static doesn't control you anymore. You hear through it.",
		"Kael — the Transmuted Architect. You're not just surviving the maze. You're rewriting it.",
	]
]

func _ready() -> void:
	npc_name = "MEANING"
	npc_color = Color(1.0, 0.5, 0.8, 1.0)  # Pink — warmth, emotion
	interaction_prompt = "Press E to speak"
	super._ready()
	interacted.connect(_on_meaning_interacted)

func _on_dialogue_complete() -> void:
	# Reward: reduce static meter
	var reduction: float = 0.15 + GameState.emotional_resonance * 0.002
	GameState.static_meter = clampf(
		GameState.static_meter - reduction, 0.0, 1.0
	)
	EventBus.state_changed.emit("static_meter", GameState.static_meter)
	print("MEANING: Static reduced by %.2f" % reduction)

	# Bonus: if player has used emotional scan recently, boost resonance
	if GameState.emotional_resonance > 0:
		GameState.emotional_resonance = clampf(
			GameState.emotional_resonance + 5.0, 0.0, 100.0
		)
		print("MEANING: Resonance attuned +5")

func _on_meaning_interacted(_npc: SanctumNPC) -> void:
	var resonance: float = GameState.emotional_resonance
	var set_index: int
	if resonance <= 25.0:
		set_index = 0
	elif resonance <= 60.0:
		set_index = 1
	else:
		set_index = 2

	var lines: Array[String] = []
	lines.assign(_dialogue_sets[set_index])

	var ui = DialogueUI.get_instance()
	if ui:
		ui.open("MEANING", npc_color, lines, _on_dialogue_complete)
