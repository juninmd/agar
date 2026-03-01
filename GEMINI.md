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
- **Protocol**: "Distributed Defense - Null Void Titan".
- **Last Action**: Implemented "Raid System" featuring the Null Void Titan boss. Triggered by low integrity (<20%) and high mass (>2000). Includes dedicated UI warnings, health bar, and visual effects. Verified with `verify_raid.py`.
- **Current Action**: Fixed Netlify CI deployment failure by updating `netlify.toml` publish directory to root and removing invalid `_redirects` configuration.
- Phase 6 Boot Sequence V2 completed
