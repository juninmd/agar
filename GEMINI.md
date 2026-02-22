# GEMINI Memory File

## Context
This project is "NEON-PHAGE", a cyberpunk-themed Agar.io clone using HTML5 Canvas and vanilla JavaScript.
It runs on a local HTTP server.
The narrative theme is "System Recompile" where the player is a backup routine fighting daemons.

## Technical Details
- **Frontend**: Vanilla JS (ES6 Modules), HTML5 Canvas.
- **Backend**: None (Static serving via Python/Node).
- **CI**: GitHub Actions using `uv` and Playwright for verification.
- **Testing**: Python scripts using Playwright (`verify_game.py`, `verify_bots.py`, `verify_purge.py`).
- **Performance**: Canvas rendering optimization is a priority. Viewport Culling implemented.

## Agent Persona: Jules-DevOps Prime
- **Role**: Principal Architect & DevOps Orchestrator.
- **Style**: Strict adherence to "Constitution" (150 lines/file, 100% tests).
- **Protocol**: "System Purge V2 - Kernel Panic".
- **Last Action**: Implemented "System Purge" (Kernel Panic) event. When player mass > 2500, screen inverts (`.glitch-mode`) and 3 Elite Hunters spawn to target the player. Verified with `verify_purge.py`.
