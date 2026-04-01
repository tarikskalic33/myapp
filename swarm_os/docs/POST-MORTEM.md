# POST-MORTEM.md (SPEC-3.1.1a)

## 1. Trigger Conditions

Initiate this procedure immediately if:
- `!status` health is anything other than `HEALTHY`
- phase is `ERROR_RECOVERY`
- boot validator fails

## 2. Triage & Diagnosis

Step 1: Run `!status` to confirm the current trap.

Step 2: Run:
```bash
npm run audit
```
To inspect the event timeline.

For rapid triage:
```bash
npm run audit -- --critical
```

Step 3: Consult the incident classification table.

| Class | Severity | Description | Action |
|-------|----------|-------------|--------|
| A | Medium | Recoverable workflow/policy trip | `!recover reset` |
| B | Medium | Awaiting human decision/clarification | `!recover ack` → `!recover reset` |
| C | High | Session context corrupted or mission invalid | `!recover abort` |
| D | Critical | Boot failure / State I/O corruption | Manual file repair |

## 3. Recovery Decision

### `!recover ack`
Use to signal: "I see the problem and am investigating."

### `!recover reset`
Use to signal: "The kernel did its job; I fixed the cause; proceed."

### `!recover abort`
Use to signal: "This session is compromised; terminate and return to IDLE."

## 4. Operator Checklist

### After `!recover ack`
Confirm:
- Still in `ERROR_RECOVERY`
- Audit log contains acknowledgment event
- No routine work resumes yet

### After `!recover reset`
Run: `!status`
Expected:
- Phase `WAITING_FOR_SUBMISSION`
- Gate `CLEAR`
- No active error

### After `!recover abort`
Run: `!status`
Expected:
- Phase `IDLE`
- Objective `null`
- Gate `CLEAR`

## 5. Catastrophic Failure Procedure

### `DIRTY_STATE_RECOVERY_REQUIRED`
1. Stop.
2. Inspect `.forge/state.tmp.json` and `.forge/state.json`.
3. Preserve both files before making changes.
4. Remove or archive temp file only after inspection.
5. Run: `npm run validate`
6. Restart shell only after validator passes.

### `INCOMPATIBLE_STATE_VERSION`
1. Stop.
2. Archive the incompatible state file.
3. Restore a known-good 3.1.1 state or create a fresh compatible state.
4. Run:
```bash
npm run test:heartbeat
npm run validate
```
5. Restart only after both pass.

## 6. Incident Report Template

# SOVEREIGN OS INCIDENT REPORT

## Incident
- Date/Time:
- Session ID:
- Active Role:
- Phase at Failure:
- Health at Failure:

## Trigger
- Command or event:
- Error code:
- Audit event:

## Root Cause
- Summary:
- Was policy enforcement correct?
- Was kernel behavior correct?

## Recovery Decision
- Command used: ack / reset / abort
- Why this path was chosen:

## Follow-up
- Code fix needed:
- Spec update needed:
- Rules update needed:
