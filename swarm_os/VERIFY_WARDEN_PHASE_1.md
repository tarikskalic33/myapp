# VERIFICATION: Warden Phase 1

This test confirms that the RoutineTracker correctly identifies repetitive player behavior and that the Warden reacts to it.

## Verification Steps:
1. Open the project in Godot.
2. Run `TestRoom.tscn`.
3. Add the `Warden` node to the scene if it's not present (instantiate `Warden.gd` on a Node2D).
4. Perform the following state transitions:
   - `Idle` -> `Move` -> `Idle` -> `Move` -> `Idle` -> `Move`
5. Check the debug console.
6. **Expected Output**:
   - `RoutineTracker: Wired to StateMachine.`
   - `Warden: Observing player via RoutineTracker.`
   - `WARDEN: Agitation Critical! Pattern Detected.` (if repeated enough times)
   - Static Meter should increase faster due to bursts.

## Rollback Plan:
1. `git checkout d:/03_WORK_PROJECTS/system_rebuild/game/scripts/core/StateMachine.gd`
2. `git checkout d:/03_WORK_PROJECTS/system_rebuild/game/scenes/player/Player.tscn`
3. `rm d:/03_WORK_PROJECTS/system_rebuild/game/scripts/bosses/warden/RoutineTracker.gd`
4. `rm d:/03_WORK_PROJECTS/system_rebuild/game/scripts/bosses/warden/Warden.gd`
