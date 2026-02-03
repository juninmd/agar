# GEMINI.md - Jules Memory Log

## Session 1: Antigravity Audit
*   **Date:** 2023-10-27
*   **Agent:** Jules
*   **Actions:**
    *   Conducted Codebase Audit.
    *   Identified missing Particle System and broken Dash return logic.
    *   Implemented `ParticleSystem` and fixed `Player.dash()`.
    *   Established CI pipeline (`.github/workflows/ci.yml`).
    *   Standardized documentation (`CONTRIBUTING.md`, `AGENTS.md`).
*   **Learnings:**
    *   The collision detection is O(N^2), which will be a bottleneck at scale. Added to Roadmap.
    *   The `verify_game.py` script is a robust way to test game state via browser automation.
