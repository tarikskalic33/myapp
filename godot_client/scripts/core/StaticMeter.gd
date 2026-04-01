class_name StaticMeterSingleton
extends Node
## Dedicated tension/mechanic manager for the Static Meter.
## Fills the static meter when Kael overthinks (especially in boss rooms).
## Implements the Behavioral Integrity mitigation mechanic.

## The base rate at which static increases per second during a tension event (e.g. Boss Fight).
@export var base_fill_rate_per_sec: float = 0.05

## Is the static meter actively filling right now? (True during intense moments where action is required).
var is_active: bool = false

enum ActionType { MOVE, DASH, ATTACK, PARRY, GAMBLE }

func _process(delta: float) -> void:
    if is_active:
        var multiplier: float = _get_mitigation_multiplier()
        var actual_fill_rate: float = base_fill_rate_per_sec * multiplier
        GameState.static_meter += actual_fill_rate * delta

## Registers an action performed by Kael and adjusts the static meter accordingly.
func register_action(type: ActionType) -> void:
    var multiplier: float = _get_mitigation_multiplier()
    
    match type:
        ActionType.MOVE:
            GameState.static_meter += 0.001 * multiplier
        ActionType.DASH:
            GameState.static_meter += 0.05 * multiplier
        ActionType.ATTACK:
            GameState.static_meter += 0.02 * multiplier
        ActionType.PARRY:
            GameState.static_meter += 0.01 * multiplier
        ActionType.GAMBLE:
            GameState.static_meter = 1.0

func _get_mitigation_multiplier() -> float:
    # "reduces Static Meter fill rate 5% each (max 50%)"
    var mitigation_percent: float = float(min(10, GameState.behavioral_integrity)) * 0.05
    return 1.0 - mitigation_percent

## Start passively filling the Static Meter (e.g., entered boss room).
func begin_tension() -> void:
    is_active = true

## Pause the Static Meter filling (e.g., boss defeated, or in Medical Bridge).
func end_tension() -> void:
    is_active = false

## Directly add a burst of static (e.g., player hesitated too long on a puzzle).
func add_static_burst(amount: float) -> void:
    GameState.static_meter += amount

## Flush/clear the static meter completely (e.g., successful aggressive sequence or System Cascade/Flush).
func flush_static() -> void:
    # A successful flush resets tension.
    GameState.static_meter = 0.0
