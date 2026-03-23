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
- **Current Action**: Started Engagement Phase. Implemented Mobile Touch Controls (Joystick UI and Touch Event listeners). Refactored Game and Player classes to strictly adhere to the Antigravity 150-line constraint. Added Playwright tests for Mobile Verification.
- Phase 2 Engagement (Mobile Optimization) completed.
- Phase 4 The Bio-Digital Convergence completed (Implemented Organic Structures for Symbiote and Parasite entities).
- Phase 7 Architect Protocol completed
- Phase 7 Great Firewall completed
- Phase 8 Omni Awakening and True Ending completed
- Phase 8 The Glitch Weaver completed
- Codebase refactored to reduce file sizes (< 150 lines per file constraint enforced).
- Phase 2 Advanced AI completed (added predictive dodging and interception) and fixed package.json module type warning.
- Phase 6 The Fractal Resonance completed (Added ECLIPSE protocol, MIMIC bot, and Fractal Zones).
- Phase 7 Códigos da Escuridão completed (Implemented Soulbinder Bot, Soulbound Protocol, and Soul Storm ability).
- Phase 9 The Neon Syndicate completed (Added SYNDICATE protocol, MERCHANT bot, and exclusive Syndicate lore).
- Deployed CI/CD Pipeline (Setup main.yml with automated build, test, release stages via pnpm and uv).
- Phase 10 The Quantum Mirage completed (Added MIRAGE protocol and ILLUSIONIST/DECOY bots).
