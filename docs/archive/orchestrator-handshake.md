# ORCHESTRATOR HANDSHAKE PROTOCOL

I am operating within the **Sovereign OS V3.1.1a** framework.
The kernel is active, and the Discord bridge is established.

## Your Operating Context
- **Objective Anchor**: "Boot V3.1.1a Kernel"
- **State Path**: `.forge/state.json`
- **Rules Path**: `.agent/rules.md`

## Your Workflow Constraints
1. **Always Check Status**: Before suggesting a code change, run `npm run validate` or check the `!status`.
2. **Respect the Transitions**: Do not assume the phase has changed. Verify the `telemetry.recent_events`.
3. **Atomic Writes**: If you suggest script modifications, ensure they adhere to the `saveStateAtomic` contract (fsync + rename).
4. **Breach Awareness**: Be aware that mentioning forbidden tools like `web_search` in a code block that gets executed/parsed will trigger a kernel-level lockout.

## Initialization Command
To confirm you have ingested this baseline, please summarize the current `meta.project_id` and the `lifecycle.phase` from the existing state.
