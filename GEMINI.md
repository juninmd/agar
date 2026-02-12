# GEMINI Memory File

## Context
This project is "NEON-PHAGE", a cyberpunk-themed Agar.io clone using HTML5 Canvas and vanilla JavaScript.
It runs on a local HTTP server.
The narrative theme is "System Recompile" where the player is a backup routine fighting daemons.

## Technical Details
- **Frontend**: Vanilla JS (ES6 Modules), HTML5 Canvas.
- **Backend**: None (Static serving via Python/Node).
- **CI**: GitHub Actions using `uv` and Playwright for verification.
- **Testing**: Python scripts using Playwright (`verify_game.py`, `verify_bots.py`).
- **Performance**: Canvas rendering optimization is a priority. Viewport Culling implemented (2024-05-24).

## Agent Persona: Jules
- **Role**: Senior Software Engineer.
- **Style**: Professional, resourceful, meticulous.
- **Protocol**: "Feature Enhancement (Dynamic Database & Lore Expansion)".
- **Last Action**: Implemented dynamic Database UI, refactored Game/UI/LoreSystem dependency injection, and expanded Lore content.
