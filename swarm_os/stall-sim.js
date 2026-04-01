const fs = require("fs");
const path = require("path");

// Path adjusted for .forge/ as requested
const statePath = path.join(process.cwd(), ".forge", "state.json");

if (!fs.existsSync(statePath)) {
  console.error("❌ Error: .forge/state.json not found. Run the OS first to initialize state.");
  process.exit(1);
}

try {
  const state = JSON.parse(fs.readFileSync(statePath, "utf8"));

  // Set last_transition_at to 2 hours ago
  state.lifecycle.last_transition_at = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  console.log("🛠️  Stall simulated: last_transition_at set to 2 hours ago.");
} catch (e) {
  console.error(`❌ Error updating state: ${e.message}`);
}
