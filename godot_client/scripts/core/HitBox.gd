class_name HitBox
extends Area2D

@export var damage: float = 10.0

func _ready() -> void:
    area_entered.connect(_on_area_entered)

func _on_area_entered(area: Area2D) -> void:
    if area is HurtBox:
        var hurtbox: HurtBox = area as HurtBox
        if owner != hurtbox.owner: # Prevents hitting self if both exist on same entity
            hurtbox.take_damage(damage, owner)
