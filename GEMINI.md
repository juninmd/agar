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
- **Current Action**: Initialized new user session per Jules-DevOps Prime protocol. Acknowledged the environment (NEON-PHAGE) and ran an Antigravity Audit.
- **Note**: Found files violating the 150-line constraint (`ability_system.js`, `ai_strategies.js`, `player.js`, `player_visuals.js`). These are marked for refactor in Phase 2 Development. -> Completed Phase 2 Engagement (Antigravity Refactor).
- Phase 2 Engagement (Mobile Optimization) completed.
- Phase 4 The Bio-Digital Convergence completed (Implemented Organic Structures for Symbiote and Parasite entities).
- Phase 7 Architect Protocol completed
- Phase 7 Great Firewall completed
- Phase 8 Omni Awakening and True Ending completed
- Phase 8 The Glitch Weaver completed
- Phase 2 Advanced AI completed (added predictive dodging and interception) and fixed package.json module type warning.
- Phase 6 The Fractal Resonance completed (Added ECLIPSE protocol, MIMIC bot, and Fractal Zones).
- Phase 7 Códigos da Escuridão completed (Implemented Soulbinder Bot, Soulbound Protocol, and Soul Storm ability).
- Phase 9 The Neon Syndicate completed (Added SYNDICATE protocol, MERCHANT bot, and exclusive Syndicate lore).
- Deployed CI/CD Pipeline (Setup main.yml with automated build, test, release stages via pnpm and uv).
- Phase 10 The Quantum Mirage completed (Added MIRAGE protocol and ILLUSIONIST/DECOY bots).
- Phase 11 The Chrono Anomaly completed (Added CHRONOS protocol, ANOMALY bots, and Time Rewind ability).
- Phase 12 The Astral Grid completed (Added ASTRAL protocol, PULSAR bots, and Astral Lore). Also refactored `ai_strategies_advanced.js` into `ai_strategies_combat.js` to pass the Antigravity Audit.
- Phase 13 The Cybernetic Hive completed (Added SWARM protocol, DRONE bots, and Hive Mind Lore).
- Phase 14 The Nexus Core completed (Added NEXUS protocol, FRAGMENTER bots, and Nexus Core Lore. Extracted thinkDrone to ai_strategies_extra.js).
- Phase 15 The Time Loop completed (Added AEON protocol, ORACLE bots, and Chronovores Lore. Also updated `player_movement.js` to ensure the `isSlowed` time dilation flag is cleared properly per frame to prevent permanent slow loops).
- Phase 18 The Kinetic Resonance completed (Added KINETIC protocol, BUMPER bots, and Kinetic Resonance lore).
- Initialized Jules-DevOps Prime Antigravity Audit: Refactored `ai_strategies_extra.js` into `ai_strategies_physics.js` to enforce the 150-line file limit. 0 floating entities detected. 100% test coverage maintained.
- Phase 20 The Crimson Harvest completed (Added VAMPYR protocol, GHOUL bots, and Crimson lore. Created test scripts to verify life steal tether ability and scavenger AI logic).
- Phase 21 The Mutation Engine completed (Added MutationSystem to override constants via main menu UI, allowing Chaos, Scarcity, Gigantism, and Hyper Decay modifiers. Wrote Playwright test verify_mutations.py).
- Phase 23 The Spectral Echo completed (Added SPECTER protocol with intangibility 'Ghost Walk' ability, WRAITH bots that phase out when threatened, and spectral lore).
