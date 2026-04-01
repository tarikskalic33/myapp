# System_Cascade_Ability.gd
extends Node
## Active ability: System Cascade
## Bible Anchor: "Active ability: System Cascade (NOT 'Vision Expansion' or 'Cascade System')"
## Effect: Flushes static to 0.0, dissolves enemies, costs 5% max health.

@export var cooldown: float = 30.0
var _cooldown_timer: float = 0.0

func _process(delta: float) -> void:
    if _cooldown_timer > 0.0:
        _cooldown_timer -= delta
        
    if Input.is_action_just_pressed("special") and _cooldown_timer <= 0.0:
        if SystemCascadeManager.spend_mana(25.0):
            _activate_ability()
        else:
            print("SYSTEM_REBUILD: Not enough Mental Mana for System Cascade.")

func _activate_ability() -> void:
    print("SYSTEM_REBUILD: System Cascade Initiated.")
    
    # Reset Static Meter via StaticMeter singleton
    if is_instance_valid(StaticMeter):
        StaticMeter.flush_static()
    else:
        # Fallback if singleton isn't ready
        GameState.static_meter = 0.0
        
    # Clear all enemies
    get_tree().call_group("Enemies", "dissolve")
    
    # Ability cost: Reduces max integrity permanently
    GameState.max_health *= 0.95
    
    _cooldown_timer = cooldown
    print("SYSTEM_REBUILD: System Cascade complete. Static flushed.")
