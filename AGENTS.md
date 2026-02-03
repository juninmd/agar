# AGENTS.md

## 🤖 Protocol & Guidelines
This repository is maintained by AI agents (Jules).

### Core Directives
*   **Logic Limit:** Functions should not exceed 100 lines.
*   **Package Managers:** Use `uv` for Python, `pnpm` for Node.js.
*   **Testing:** 100% test coverage for new code.
*   **Style:** Cyberpunk/Synthwave aesthetic.

## 🏗️ Architecture
*   **Frontend:** Vanilla JS with ES6 Modules.
*   **Rendering:** HTML5 Canvas.
*   **State:** centralized in `main.js`, exposed to `window` for Playwright testing.
*   **Entities:** `Entity` base class -> `Player`, `Bot`, `Food`.

## 🔮 Future Roadmap (High Priority)
1.  **Spatial Partitioning (Quadtree):** Implement a Quadtree for collision detection to resolve O(N^2) performance bottleneck when entity count grows.
2.  **Audio System:** Implement `AudioManager` using Web Audio API for synthwave background music and sound effects (dash, eat, death).
3.  **Multiplayer Protocol:** Design a WebSocket server (Node.js) to replace the current single-player `Bot` logic with real-time networking.

## 🧠 Memory Bank
*   **Particle System:** Implemented in `js/particles.js` to handle visual feedback.
*   **Verification:** `verify_game.py` and `antigravity_audit.py` are the source of truth for stability.
