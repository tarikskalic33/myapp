# GamblerNPC — The unnamed gambler in the Inner Sanctum
# Bible: "No judgment. No warning popup."
# Extends SanctumNPC, opens GambleUI on interaction
extends SanctumNPC

var _gamble_ui: GambleUI

func _ready() -> void:
	npc_name = "???"
	npc_color = Color(1.0, 0.85, 0.3, 0.8)  # Amber — ambiguous
	interaction_prompt = "Press E"  # No judgment, no description
	super._ready()

	# Create gamble UI (hidden)
	_gamble_ui = GambleUI.new()
	add_child(_gamble_ui)

	interacted.connect(_on_gambler_interacted)

func _on_gambler_interacted(_npc: SanctumNPC) -> void:
	_gamble_ui.open()
