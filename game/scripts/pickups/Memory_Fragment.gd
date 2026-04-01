class_name MemoryFragment
extends Area2D

@export var restoration_amount: float = 5.0
@export var float_amplitude: float = 5.0
@export var float_speed: float = 2.0

var _start_y: float = 0.0

func _ready() -> void:
    _start_y = position.y
    body_entered.connect(_on_body_entered)

func _process(delta: float) -> void:
    var t: float = float(Time.get_ticks_msec()) * 0.001 * float_speed
    position.y = _start_y + sin(t) * float_amplitude

func _on_body_entered(body: Node2D) -> void:
    if body.is_in_group("Player"):
        # Restore a portion of health and slightly increase max health 
        # (recovering from trauma)
        GameState.current_health += 10.0
        GameState.max_health += 2.0
        _play_collect_effects()
        queue_free()

func _play_collect_effects() -> void:
    print("FRAGMENT RECONSTRUCTED: Max Integrity Restored.")
