class_name HurtBox
extends Area2D

signal damage_taken(amount: float)
signal parried(attacker: Node)

@export var is_invincible: bool = false
@export var is_parrying: bool = false

func take_damage(amount: float, attacker: Node) -> void:
    if is_invincible:
        return
        
    if is_parrying:
        parried.emit(attacker)
        return
        
    damage_taken.emit(amount)
