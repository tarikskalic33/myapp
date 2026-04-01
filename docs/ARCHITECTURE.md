# ARCHITECTURE.md — SYSTEM_REBUILD
> **Owner:** Architect Agent · **Bible Version:** 2.0 · **Sprint:** Vertical Slice  
> **Last Updated:** 2026-03-13 · **Phase:** Stage 1 (Maze of Thorns) + Player Controller

---

## 1 — High-Level System Map

```
┌──────────────────────────────────────────────────────────────┐
│                    GODOT 4 APPLICATION                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              AUTOLOAD SINGLETONS                     │    │
│  │  SystemCascadeManager (Central Nervous System)       │    │
│  │  [FUTURE] AudioBus · SaveManager · EventBus          │    │
│  └────────────────────┬─────────────────────────────────┘    │
│                       │ signals                              │
│  ┌────────────────────▼─────────────────────────────────┐    │
│  │              SCENE TREE (per level)                   │    │
│  │                                                       │    │
│  │  Level Root (Node2D)                                  │    │
│  │  ├── Environment Layer (parallax, tiles, deco)        │    │
│  │  ├── Entity Layer (player, enemies, pickups)          │    │
│  │  ├── VFX Layer (particles, flicker nodes)             │    │
│  │  └── UI Layer (CanvasLayer — HUD, overlays)           │    │
│  └───────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## 2 — Autoload: SystemCascadeManager
    
    **Bible Anchor:** System Cascade (Orchestrator Role)  
    **Script:** `res://scripts/core/SystemCascadeManager.gd`  
    **Role:** Orchestrator for complex system-spanning events. (Low-activity in Act I).
    
### Owned State

| Variable             | Type    | Range       | Bible Mechanic          |
|----------------------|---------|-------------|-------------------------|
| `current_health`     | `float` | `0 … max`  | Integrity (HP)          |
| `max_health`         | `float` | `≥ 1`       | Integrity ceiling       |
| `static_intensity`   | `float` | `0.0 … 1.0`| Static Meter            |
| *[PLANNED]* `mental_mana`      | `float` | `0 … max`  | Mental Mana             |
| *[PLANNED]* `behavioral_integrity` | `int` | `≥ 0`   | Behavioral Integrity    |

### Signals (Outbound)

| Signal                      | Payload        | Consumers                                    |
|-----------------------------|----------------|-----------------------------------------------|
| `integrity_changed`         | `val: float`   | `IntegrityHUD`                                |
| `max_integrity_changed`     | `val: float`   | `IntegrityHUD`                                |
| `static_level_changed`      | `val: float`   | `Player`, `StaticShadowBasic`, `Static_Overlay_Controller`, `Environment_Flicker`, `EnvironmentalDistortion` |
| *[PLANNED]* `mana_changed`  | `val: float`   | `ManaHUD`, Ability system                     |
| *[PLANNED]* `integrity_stack_changed` | `val: int` | `IntegrityHUD`, Static Meter modifier    |

### Methods

| Method                     | Effect                                           |
|----------------------------|--------------------------------------------------|
| `register_action(type)`    | Increments `static_intensity` by action weight   |
| `reduce_max_integrity(%)`  | Permanently reduces `max_health` by % fraction   |
| *[PLANNED]* `spend_mana(amount)` → `bool` | Deducts Mental Mana if sufficient      |
| *[PLANNED]* `add_integrity_stack()` | +1 stack → reduces Static fill rate      |

### Enum: `ActionType`

| Value    | Static Δ | Bible Mechanic                  |
|----------|----------|---------------------------------|
| `MOVE`   | +0.001   | Passive accumulation            |
| `DASH`   | +0.05    | Ability cost (Autonomy Dash)    |
| `GAMBLE` | → 1.0    | Instant max (The Gamble Mechanic)|

### Design Invariants
- **Signals over references.** No consumer reads the manager directly in `_process`; all react to signal emissions.
- **Clamped state.** Every setter clamps its value before emitting. No downstream code ever needs to re-clamp.

---

## 3 — Player System

**Bible Anchor:** Kael / The Transmuted Architect  
**Scene:** `res://scenes/player/Player.tscn`

### 3.1 — Node Tree

```
Player (CharacterBody2D) [Group: "Player"]
│   script: Player.gd
│
├── Sprite2D
│       modulate: cyan (0, 0.9, 0.95, 1) — placeholder
│
├── CollisionShape2D
│       RectangleShape2D (28×28)
│
├── StateMachine (Node)
│   │   script: StateMachine.gd
│   │   initial_state → "Idle"
│   │
│   ├── Idle (Node)  — script: Idle.gd
│   ├── Move (Node)  — script: Move.gd
│   ├── Dash (Node)  — script: Dash.gd
│   ├── [PLANNED] Attack (Node)
│   ├── [PLANNED] Parry  (Node)
│   └── [PLANNED] Hit    (Node)
│
├── [NOT IN SCENE] SystemFlushAbility (Node)
│       script: System_Flush_Ability.gd
│       NOTE: exists as script but is NOT wired into Player.tscn yet
│
├── [PLANNED] HurtBox (Area2D) — receives damage
├── [PLANNED] HitBox  (Area2D) — deals damage
└── [PLANNED] AnimationPlayer
```

### 3.2 — Script Responsibilities

| Script       | Single Responsibility                                      |
|--------------|------------------------------------------------------------|
| `Player.gd`  | Owns `base_speed`, `current_speed`, `last_direction`. Caches child refs. Connects to `SystemCascadeManager.static_level_changed` to scale speed. Provides `get_input_direction()`. |
| `StateMachine.gd` | Generic FSM controller. Iterates child `State` nodes. Routes `_process`, `_physics_process`, `_unhandled_input` to active state. Exposes `transition_to(name, msg)`. |
| `State.gd`   | Abstract base. Virtual: `enter()`, `exit()`, `update()`, `physics_update()`, `handle_input()`. |
| `Idle.gd`    | Zeroes velocity. Listens for movement → `Move`, dash input → `Dash`. |
| `Move.gd`    | Applies `current_speed * direction`. Registers `MOVE` action. Transitions to `Idle` on zero input, `Dash` on dash input. |
| `Dash.gd`    | Fixed-duration burst (`600px/s`, `0.2s`). Spawns ghost sprites at `0.05s` intervals. Registers `DASH` action. Returns to `Idle` or `Move`. |
| `System_Cascade_Ability.gd` | Cooldown-gated (`30s`). Flushes static to `0.0`, dissolves all enemies in `"Enemies"` group, reduces max integrity by 5%. **Bible: System Cascade active ability** |

### 3.3 — Signal / Data Flow

```
Input Actions ──► Player.get_input_direction()
                         │
                         ▼
                  StateMachine.current_state
                         │
           ┌─────────────┼─────────────────┐
           ▼             ▼                  ▼
         Idle          Move              Dash
                    registers          registers
                    MOVE action        DASH action
                         │                  │
                         ▼                  ▼
              SystemCascadeManager.register_action()
                         │
                         ▼ signal: static_level_changed
                         │
         ┌───────────────┼──────────────────────────────┐
         ▼               ▼                              ▼
   Player._on_static   UI Overlays              StaticShadowBasic
   (scales speed)      (shader/flicker)         (visibility/aggro)
```

### 3.4 — Input Map

| Action       | Keys          | Purpose                   |
|--------------|---------------|---------------------------|
| `move_left`  | A / ←         | Horizontal movement       |
| `move_right` | D / →         | Horizontal movement       |
| `move_up`    | W / ↑         | Vertical movement         |
| `move_down`  | S / ↓         | Vertical movement         |
| `dash`       | Shift         | Autonomy Dash (C1)        |
| `special`    | Q             | System Cascade / Flush    |

---

## 4 — Finite State Machine (Generic)

**Script:** `res://scripts/core/StateMachine.gd` + `res://scripts/core/State.gd`

### 4.1 — Contract

```
StateMachine
  ├── registers all child State nodes on _ready()
  ├── routes _process / _physics_process / _unhandled_input to current_state
  └── transition_to(target_name, msg) → calls exit() then enter()

State (abstract base)
  ├── enter(previous_state, msg)
  ├── exit()
  ├── update(delta)          — per-frame logic
  ├── physics_update(delta)  — physics-frame logic
  └── handle_input(event)    — unhandled input
```

### 4.2 — Current State Graph (Player)

```
         ┌────────────────────────────────────┐
         │                                    │
         ▼          move input ≠ 0            │
      [ IDLE ] ──────────────────────► [ MOVE ]
         │                                │
         │ dash pressed                   │ dash pressed
         ▼                                ▼
      [ DASH ] ◄──────────────────────────┘
         │
         │ duration elapsed
         │
         ├── input ≠ 0 ──► [ MOVE ]
         └── input = 0 ──► [ IDLE ]
```

### 4.3 — Planned States

| State     | Trigger                      | Bible Anchor                |
|-----------|------------------------------|-----------------------------|
| `Attack`  | Attack input                 | Melee system (TBD)          |
| `Parry`   | Timed defend input           | Micro-Expression Read (B1)  |
| `Hit`     | HurtBox collision            | Integrity reduction         |
| `Dead`    | `current_health ≤ 0`        | Run reset / rogue-lite loop |

---

## 5 — Enemy System

**Bible Anchor:** Static Shadow NPC Taxonomy (1D Thinkers)

### 5.1 — StaticShadowBasic

**Script:** `res://scripts/enemies/Static_Shadow_Basic.gd`  
**Base Type:** `CharacterBody2D`

#### Behavior

| Static Intensity | Visibility         | Speed        | Damage |
|------------------|---------------------|-------------|--------|
| `< 0.2`          | Invisible (α = 0)  | Base (60)   | None   |
| `0.2 – 0.8`      | Fading in (α = level) | Base (60) | None   |
| `> 0.8`           | Fully visible (α = 1) | 2× Base (120) | Active |

**AI:** Pure chase — moves directly toward player position each physics frame.

#### Player Detection
- Tries `player_path` export first
- Falls back to `get_tree().get_nodes_in_group("Player")`

### 5.2 — Planned Enemy Architecture

```
[PLANNED] EnemyBase (CharacterBody2D)
├── Sprite2D / AnimatedSprite2D
├── CollisionShape2D
├── HurtBox (Area2D) — receives player attacks
├── HitBox  (Area2D) — deals contact damage
├── StateMachine (Node)
│   ├── Idle
│   ├── Chase
│   ├── Attack
│   └── Dissolve
├── HealthComponent (Node)  — signal: died
└── [Optional] NavigationAgent2D
```

> **Design Note:** `StaticShadowBasic` currently has inline AI. Future enemies should use the generic `StateMachine` + `State` pattern to keep AI modular and Bible-aligned.

---

## 6 — Pickup System

**Bible Anchor:** Legacy Artifacts, Memory Fragments

### 6.1 — MemoryFragment

**Script:** `res://scripts/pickups/Memory_Fragment.gd`  
**Base Type:** `Area2D`

| Behavior                | Detail                                      |
|-------------------------|---------------------------------------------|
| Floating animation      | Sine bob (amplitude 5px, speed 2 Hz)        |
| Collection trigger      | `body_entered` → group check `"Player"`     |
| Effect                  | Restores `max_health` + heals to full       |
| Cleanup                 | `queue_free()` after collection              |

### 6.2 — Planned Pickup Architecture

```
[PLANNED] PickupBase (Area2D)
├── Sprite2D / AnimatedSprite2D
├── CollisionShape2D
├── FloatComponent (Node) — sine-bob logic
└── InteractComponent (Node) — signal: collected(body)
```

Specific pickups extend `PickupBase`:
- `MemoryFragment` — restores integrity ceiling
- `ManaOrb` — restores Mental Mana
- `LegacyArtifact` — one-off items (Pocket Watch, LEGO Microchip, etc.)

---

## 7 — UI / VFX Layer

**Bible Anchor:** Art Direction Laws, Chiaroscuro filter

### 7.1 — Current Node Tree

```
[UI CanvasLayer — PLANNED, not yet in scene]
├── IntegrityHUD (Control)
│     script: Integrity_HUD.gd
│     └── BackgroundBar (TextureProgressBar)
│     └── ForegroundBar (TextureProgressBar)
│
├── [PLANNED] ManaHUD (Control)
├── [PLANNED] StaticMeterHUD (Control)
├── [PLANNED] BehavioralIntegrityCounter (Control)
│
└── OverlayStack (CanvasLayer — top-most)
      ├── Static_Overlay_Controller (ColorRect + ShaderMaterial)
      │     shader: distortion.gdshader
      └── EnvironmentalDistortion (ColorRect + ShaderMaterial)
            shader: distortion.gdshader (shared)

[In-World VFX — children of Level Root]
└── Environment_Flicker (Node2D)
      Toggles visibility on random interval scaled by static
```

### 7.2 — Shader: `distortion.gdshader`

**Type:** `canvas_item` (screen-space post-process)

| Uniform                  | Range         | Driven By                   |
|--------------------------|---------------|-----------------------------|
| `distortion_strength`    | `0.0 – 0.2`  | `static_intensity`          |
| `glitch_amount`          | `0.0 – 1.0`  | `static_intensity` (above 0.7 threshold) |
| `chromatic_aberration`   | `0.0 – 0.02` | Base + glitch boost         |
| `scanline_strength`      | `0.0 – 0.25` | Constant + glitch scale     |

### 7.3 — Design Rule

All UI scripts connect to `SystemCascadeManager` signals. **No polling.** The UI layer is purely reactive.

---

## 8 — Scene Composition

### 8.1 — TestRoom (Current Main Scene)

```
TestRoom (Node2D)
├── Floor (StaticBody2D)
│   ├── CollisionShape2D (2000×40)
│   └── FloorVisual (ColorRect — dark grey-blue)
│
└── Player (instance of Player.tscn)
    ├── position: (640, 360)
    └── Camera2D (child, follows player)
```

### 8.2 — Planned Level Template

```
[PLANNED] LevelBase (Node2D)
├── ParallaxBackground
│   └── ParallaxLayer(s)
├── TileMapLayer (environment geometry)
├── EntityContainer (Node2D)
│   ├── Player (instanced)
│   ├── Enemies (Node2D container)
│   └── Pickups (Node2D container)
├── VFXContainer (Node2D)
│   └── Environment_Flicker nodes
├── NavigationRegion2D [PLANNED]
└── UILayer (CanvasLayer)
    ├── IntegrityHUD
    ├── OverlayStack
    └── [PLANNED] additional HUDs
```

---

## 9 — Render Layers

| Layer | Name    | Usage                     |
|-------|---------|---------------------------|
| 1     | World   | Tiles, environment, deco  |
| 2     | Player  | Kael + effects            |
| 3     | Enemies | Static Shadows + bosses   |
| 4     | UI      | HUD, overlays, menus      |

---

## 10 — Signal Registry (Global)

All cross-system communication flows through signals. No direct node references between unrelated systems.

| Signal Source              | Signal Name                | Subscribers                                    |
|----------------------------|----------------------------|------------------------------------------------|
| `SystemCascadeManager`     | `integrity_changed`        | `IntegrityHUD`                                 |
| `SystemCascadeManager`     | `max_integrity_changed`    | `IntegrityHUD`                                 |
| `SystemCascadeManager`     | `static_level_changed`     | `Player`, `StaticShadowBasic`, `Static_Overlay_Controller`, `Environment_Flicker`, `EnvironmentalDistortion` |
| `MemoryFragment`           | `body_entered` (built-in)  | Self (collection logic)                        |
| *[PLANNED]* `EnemyBase`    | `died`                     | Spawn manager, loot system                     |
| *[PLANNED]* `Player`       | `damaged`                  | HUD, camera shake, VFX                         |
| *[PLANNED]* `Player`       | `died`                     | Game state manager, UI                         |

---

## 11 — Architectural Gaps & Bible Alignment Flags

> Items below have **Bible anchors** but **no implementation yet.**

| Bible Mechanic                        | Required System                        | Priority |
|---------------------------------------|----------------------------------------|----------|
| Mental Mana                           | Mana resource in SCM + ManaHUD         | HIGH     |
| Behavioral Integrity stacks           | Stack counter + Static Meter modifier  | HIGH     |
| Emotional Scan                        | Hold-to-scan input + NPC data overlay  | MEDIUM   |
| Parry / Micro-Expression Read (B1)    | Parry state + mana restoration         | HIGH     |
| Pattern Recognition (A1)              | Intent trail VFX on enemies            | MEDIUM   |
| Consistency Loop (C2)                 | Hit streak tracker → speed boost       | MEDIUM   |
| The Gamble Mechanic                   | Inner Sanctum NPC + wager UI           | LOW      |
| Maze layout variation on re-entry     | Procedural/seed-based tile rearrange   | LOW      |
| Static Shadow Dimensional Tiers       | 1D/2D/3D AI behavior differentiation   | MEDIUM   |
| The Cracked Tablet (starting item)    | Room architecture overlay system       | LOW      |
| System Flush integration              | Wire `SystemFlushAbility` into Player.tscn | HIGH |
| Combat (Attack state + HitBox/HurtBox)| Melee system + damage pipeline         | **CRITICAL** |
| Camera system                         | Chiaroscuro filter, shake, follow      | MEDIUM   |

### Bible Violation Flags

| Issue | Detail |
|-------|--------|
| ⚠️ No face rendering | Not an issue yet (placeholder sprite), but Art Direction Law 1 must be enforced once real sprites arrive. |
| ⚠️ Left/Right directionality | Art Direction Law 3 not yet enforceable in TestRoom. Must be implemented in Stage 1 level design. |

---

## 12 — Vertical Slice Scope (Sprint Target)

The current phase targets a **playable vertical slice** of Stage 1:

```
Vertical Slice Checklist:
[x] Player movement (WASD + arrow keys)
[x] Dash with ghost trail
[x] SystemCascadeManager (health + static)
[x] Static-reactive enemy (StaticShadowBasic)
[x] Memory Fragment pickup
[x] Distortion shader (static-driven)
[x] UI: IntegrityHUD (health bar)
[x] UI: Static overlay + environment flicker
[ ] Combat: Attack state + damage pipeline
[ ] Combat: Parry state + Micro-Expression Read
[ ] Wire SystemFlushAbility into Player.tscn
[ ] Mental Mana resource
[ ] Behavioral Integrity stacks
[ ] Stage 1 tilemap (Maze of Thorns)
[ ] Boss: The Warden of Routine
[ ] Audio: ambient + SFX bus
[ ] Camera: follow + shake + Chiaroscuro enforcement
```

---

## Appendix A — File Map

```
game/
├── project.godot
├── main.tscn
├── scenes/
│   ├── player/
│   │   └── Player.tscn
│   └── test/
│       └── TestRoom.tscn
├── scripts/
│   ├── core/
│   │   ├── State.gd
│   │   ├── StateMachine.gd
│   │   └── SystemCascadeManager.gd
│   ├── player/
│   │   ├── Player.gd
│   │   ├── Idle.gd
│   │   ├── Move.gd
│   │   ├── Dash.gd
│   │   └── System_Flush_Ability.gd
│   ├── enemies/
│   │   └── Static_Shadow_Basic.gd
│   ├── pickups/
│   │   └── Memory_Fragment.gd
│   ├── bosses/
│   │   └── (empty)
│   └── ui/
│       ├── Integrity_HUD.gd
│       ├── Static_Overlay_Controller.gd
│       ├── Environment_Flicker.gd
│       └── Environmental_Distortion.gd
└── shaders/
    └── distortion.gdshader
```

---

*This document is the single source of truth for system architecture. All Builder Agent outputs must be reviewed against this blueprint. Updated by Architect Agent after every sprint.*
