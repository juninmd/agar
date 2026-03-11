# GEMINI Memory File

## Context
This project is "NEON-PHAGE", a cyberpunk-themed Agar.io clone using HTML5 Canvas and vanilla JavaScript.
It runs on a local HTTP server.
The narrative theme is "System Recompile" where the player is a backup routine fighting daemons.

## Technical Details
- **Frontend**: Vanilla JS (ES6 Modules), HTML5 Canvas.
- **Backend**: None (Static serving via Python/Node).
- **CI**: GitHub Actions using `uv` and Playwright for verification.
- **Testing**: Python scripts using Playwright (`verify_game.py`, `verify_bots.py`, `verify_purge.py`, `verify_raid.py`).
- **Performance**: Canvas rendering optimization is a priority. Viewport Culling implemented.

## Agent Persona: Jules-DevOps Prime
- **Role**: Principal Architect & DevOps Orchestrator.
- **Style**: Strict adherence to "Constitution" (150 lines/file, 100% tests).
- **Protocol**: "The Antigravity Audit (Start)".
- **Last Action**: Implemented The Glitch Weaver mechanic and Lore 35.
- **Current Action**: Conducted codebase refactor checking and file size limitation audit. Refactored `js/game.js`, `js/ability_system.js`, and `js/visuals/boss_visuals.js` to adhere strictly to the <150 line rule.
- Phase 7 Architect Protocol completed
- Phase 7 Great Firewall completed
- Phase 8 Omni Awakening and True Ending completed
- Phase 8 The Glitch Weaver completed
- Codebase refactored to reduce file sizes (< 150 lines per file constraint enforced).
