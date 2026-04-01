You are organizing the Sovereign AGI OS project.
Project root: D:\03_WORK_PROJECTS\system_rebuild
Do not modify any .js, .json, or .md files — only move and organize.
Do not delete anything. If unsure, leave it in place.
Report every action taken.

STEP 1 — Create clean folder structure if missing:
  D:\03_WORK_PROJECTS\system_rebuild\benchmark\
  D:\03_WORK_PROJECTS\system_rebuild\scripts\
  D:\03_WORK_PROJECTS\system_rebuild\docs\outputs\
  D:\03_WORK_PROJECTS\system_rebuild\docs\sessions\

STEP 2 — Move benchmark files to benchmark\:
  docs\archive\AGI_Metacognition_Benchmark.ipynb   -> benchmark\AGI_Metacognition_Benchmark.ipynb
  docs\archive\sovereign_benchmark.py              -> benchmark\sovereign_benchmark_CORRUPT.py
    (rename it corrupt so nobody runs it — it is a Word doc with wrong extension)

STEP 3 — Move loose PowerShell scripts to scripts\:
  debug_json.ps1       -> scripts\debug_json.ps1
  extract.ps1          -> scripts\extract.ps1
  extract_json_v2.ps1  -> scripts\extract_json_v2.ps1
  extract_line.ps1     -> scripts\extract_line.ps1
  extract_messages.ps1 -> scripts\extract_messages.ps1
  extract_script_7.ps1 -> scripts\extract_script_7.ps1
  extract_text.ps1     -> scripts\extract_text.ps1
  ingest.ps1           -> scripts\ingest.ps1
  ingest.py            -> scripts\ingest.py
  init_structure.ps1   -> scripts\init_structure.ps1
  list_scripts.ps1     -> scripts\list_scripts.ps1
  list_scripts_v2.ps1  -> scripts\list_scripts_v2.ps1
  search_messages.ps1  -> scripts\search_messages.ps1
  vault_init.ps1       -> scripts\vault_init.ps1
  vault_init.py        -> scripts\vault_init.py
  verify_proxy.py      -> scripts\verify_proxy.py

STEP 4 — Move loose data/text files to docs\sessions\:
  chat_data.json       -> docs\sessions\chat_data.json
  final_data.json      -> docs\sessions\final_data.json
  extracted_text.txt   -> docs\sessions\extracted_text.txt
  line_with_data.txt   -> docs\sessions\line_with_data.txt
  script_7_data.txt    -> docs\sessions\script_7_data.txt
  chat.html            -> docs\sessions\chat.html

STEP 5 — Move loose test/debug JS files to scripts\:
  audit-log.js              -> scripts\audit-log.js
  boot-validator.js         -> scripts\boot-validator.js
  enforce-test.js           -> scripts\enforce-test.js
  failure-path-verification.js -> scripts\failure-path-verification.js
  first-heartbeat.js        -> scripts\first-heartbeat.js
  live-flow-drill.js        -> scripts\live-flow-drill.js
  sovereign-stress-test.js  -> scripts\sovereign-stress-test.js
  stall-sim.js              -> scripts\stall-sim.js

STEP 6 — Clean up .forge\ backup files:
  Move all state.backup.*.json files to .forge\docs\backups\
  Create .forge\docs\backups\ if it does not exist.

STEP 7 — Copy kaggle.json to correct auth location:
  Source:      D:\03_WORK_PROJECTS\system_rebuild\docs\archive\kaggle.json
  Destination: C:\Users\hhk33\.kaggle\kaggle.json
  Create directory if missing.

STEP 8 — Report the final clean structure:
  List what is now in project root
  List what is in benchmark\
  List what is in scripts\
  List what is in tools\
  Confirm kaggle.json is at C:\Users\hhk33\.kaggle\kaggle.json

FILES THAT MUST STAY IN ROOT — do not move these:
  genesis.js
  start.js
  sentinel.js
  sovereign-discord.js
  sovereign-discord-bot.js
  sovereign-os.js
  package.json
  package-lock.json
  .env
  CLAUDE.md
  CONTEXT.md
  HANDOFF.md
  POST-MORTEM.md
  VERIFY_WARDEN_PHASE_1.md

CONSTITUTIONAL LAWS:
  Do not delete anything.
  Do not modify file contents.
  Report FATAL_BLOCKER if any move fails.
  If a destination file already exists, do not overwrite — report conflict instead.
