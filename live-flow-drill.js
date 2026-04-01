const { loadState, transition, saveStateAtomic } = require('./sovereign-os');
const { renderStatus } = require('./sovereign-discord');

async function drill() {
  console.log('=== V3.1.1a LIVE FLOW DRILL ===\n');

  // Step 1: Status
  let state = loadState();
  console.log('Step 1: !status');
  console.log(renderStatus(state));

  // Step 2: Session Ignition
  console.log('\nStep 2: !start');
  transition(state, 'START', { command: '!start', source: 'drill' });
  saveStateAtomic(state);
  console.log('Output: 🚀 START: Phase moved to PLANNING.');
  console.log(renderStatus(state));

  // Step 2.5: Planner Success (Internal)
  console.log('\nStep 2.5: PLANNER_SUCCESS');
  transition(state, 'PLANNER_SUCCESS', { source: 'drill' });
  saveStateAtomic(state);
  console.log(renderStatus(state));

  // Step 3: Governance Entry
  console.log('\nStep 3: !submit');
  transition(state, 'SUBMIT', { command: '!submit', source: 'drill' });
  saveStateAtomic(state);
  console.log('Output: 📤 SUBMIT: Phase moved to GOVERNANCE_CHECK.');
  console.log(renderStatus(state));

  console.log('\n=== LIVE FLOW DRILL: SUCCESS ===');
}

drill().catch(err => {
  console.error(err);
  process.exit(1);
});
