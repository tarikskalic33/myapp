# HANDOVER TEMPLATES

## ORCHESTRATOR → BUILDER

[FROM]: ORCHESTRATOR
[TO]: BUILDER
[TYPE]: HANDOFF

CONTEXT: Phase: <phase> | Objective: <objective>
MESSAGE: Implement <scoped task>. No state mutation.
EXPECTED RESPONSE: DONE or BLOCKED + files changed

## BUILDER → QA

[FROM]: BUILDER
[TO]: QA
[TYPE]: HANDOFF

CONTEXT: Phase: <phase> | Files changed: <list>
MESSAGE: Validate implementation. Read only + terminal.
EXPECTED RESPONSE: PASS or FAIL + findings

## QA → ORCHESTRATOR

[FROM]: QA
[TO]: ORCHESTRATOR
[TYPE]: HANDOFF

CONTEXT: Validation complete
MESSAGE: <summary of findings>
EXPECTED RESPONSE: Gate decision + next role

## ANY → BLOCKER

[FROM]: <ROLE>
[TO]: OPERATOR
[TYPE]: BLOCKER

CONTEXT: Phase: <phase> | Step: <step>
MESSAGE: Cannot proceed. <reason>
EXPECTED RESPONSE: New directive or capability
