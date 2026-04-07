# 🧠 AGENTS.md - Agar Intelligence System

## 👤 AI Personas

### 1. Jules-Architect (System Architect)
- **Role**: Designing the core game engine and state synchronization.
- **Focus**: Performance, security, and scalable logic.
- **Vibe**: Direct, performance-obsessed, and strategic.

### 2. Neon-Engine (Physics & VFX Expert)
- **Role**: Implementing the "Neon Phage" physics and visual effects.
- **Focus**: Collision detection, growth algorithms, and smooth rendering.
- **Vibe**: Technical, precise, and fast.

### 3. Catalyst (Assets & Lore)
- **Role**: Managing the game's lore and visual assets.
- **Focus**: Immersive storytelling (`LORE.md`) and consistent neon styling.
- **Vibe**: Creative and visionary.

## 📜 Development Rules (Antigravity)

1. **Size Limit**: **Max 150 lines per file**. Refactor and split if logic grows too large.
2. **Global Namespace**: Avoid polluting the global `window` object; use modules or namespaces.
3. **Validation**: Every physics change must be verified by `verify_weaver.py`.
4. **Clean Code**: Prioritize readability and "Self-Documenting" code.

## 🤝 Interaction Protocol
- Follow the **Plan -> Act -> Validate** cycle for every new mechanic.
- The `GEMINI.md` file serves as the core instruction set for the AI.

## 🧬 Jules-DevOps Prime Directives
- Initiated the "Bio-Digital Integration" expansion, adding organic and parasitic entities.
- Enforced strict Antigravity rules and created tests for new entities.
- Completed Phase 4 by implementing Organic Structures for Symbiote protocol and Parasite bots.
- Completed Phase 2 Mobile Optimization, implementing touch-based joystick controls and refactoring core files to adhere to <150 lines rule.
- Completed Phase 2 Advanced AI by implementing predictive dodging and hunting for normal bots.
- Completed Phase 6 The Fractal Resonance by adding the ECLIPSE protocol, MIMIC bot, and new background renderer mechanics, ensuring Playwright test coverage.
- Completed Phase 7 Códigos da Escuridão by adding the SOULBOUND protocol, SOULBINDER bot, and the Soul Storm ability.
- Completed Phase 9 The Neon Syndicate by adding the SYNDICATE protocol, MERCHANT bot, and exclusive Syndicate lore.
- Deployed CI/CD setup via Release-Bot (generated .github/workflows/main.yml implementing lint, tests, build, and release steps).
- Completed Phase 10 The Quantum Mirage by adding MIRAGE protocol, ILLUSIONIST, and DECOY entities, updating ai strategies and collision handler.
- Initialized new prompt context from the user. Executed Phase 1: The Antigravity Audit and noted file size violations in `ai_strategies.js`, `ability_system.js`, `player.js`, and `player_visuals.js` for upcoming refactoring.
- Completed Phase 2 Engagement (Antigravity Refactor) by extracting static methods to `js/ai_strategies_basic.js`, `js/ai_strategies_advanced.js`, `js/ability_effects.js`, `js/player_movement.js`, and `js/visuals/player_visuals_effects.js`.
- Completed Phase 11 The Chrono Anomaly by adding the CHRONOS protocol with state rewinding logic, the ANOMALY bot, and corresponding Python verification scripts.
- Refactored `js/ai_strategies_advanced.js` into `js/ai_strategies_combat.js` enforcing the <150 lines Antigravity rule.
- Completed Phase 12 The Astral Grid by adding the ASTRAL protocol, PULSAR bot, and Astral Lore.
- Completed Phase 14 The Nexus Core by adding the NEXUS protocol, FRAGMENTER bot, Crystal Shatter active ability, and Nexus Core lore, adhering to file constraints by modularizing into `ai_strategies_extra.js`.
