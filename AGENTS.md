# AGENTS.md

Agar: browser cell-battle game ("Neon Phage") in vanilla JS with an optional Socket.IO multiplayer server. Narrative text lives in `LORE.md`; the assistant instruction set is `GEMINI.md`.

## Stack

- Client: vanilla JS ES modules (`js/`), CSS (`css/`), static `index.html`. Deployed as static files (`Dockerfile` serves them with nginx).
- Server: Node with Express 5 and Socket.IO 4 (`server.js`, `server/`).
- Tests: Vitest 5 with jsdom (`*.test.js`, `server/*.test.js`). Browser verification: Python + Playwright (`verification/`, root `verify_*.py`).
- Tooling: pnpm 10.32.1 (`packageManager`), ESLint 10 (`eslint.config.js`), Prettier 3.

## Commands

```bash
corepack enable && pnpm install   # setup
pnpm start                        # Node server (server.js)
python3 -m http.server 8000       # serve the static client (CI does this for Playwright tests)
pnpm test                         # vitest run (CI: unit-tests.yml)
pnpm lint                         # eslint --fix "js/**/*.js"
node check_syntax.js              # syntax check (CI: main.yml)
python3 verify_weaver.py          # physics gate, required by the rules below
python3 test_stalker.py && python3 test_abyss_zones.py   # Python checks run in main.yml
```

Build: `pnpm build` copies `css js index.html README.md LORE.md` into `dist/`.

## Structure

- `index.html`, `css/`: client shell and styles (one file per concern: `hud.css`, `start_screen.css`, `mobile_controls.css`, ...).
- `js/`: game logic. `game.js` and `main.js` are the entry points; `ai_strategies_*.js` hold bot behaviors; `config/` holds bot, power-up, protocol and skin definitions; `core/` holds collisions and the spatial hash; `effects/` holds ability effects; `renderer*.js` hold drawing.
- `server.js`, `server/`: Socket.IO rooms, validators, rate limiting.
- `verification/`: Playwright and unit verification scripts. CI runs a subset.
- `docs/images/`: README screenshots (`screenshots.py` regenerates them).
- `.github/workflows/`: `main.yml` (lint, syntax, tests, build), `unit-tests.yml`, `ci.yml`, `validate.yml`, `pages.yml`, `docker-build-push.yml`, `sast.yml`, `security.yml`, `release-drafter.yml`.

## Conventions

- Default branch: `master`. `main.yml` triggers on `main`.
- Contributing: `CONTRIBUTING.md`. Commits: clear, descriptive messages. Run the verification scripts before committing (e.g. `verify_game.py`, per `CONTRIBUTING.md`).
- PR template: `PULL_REQUEST_TEMPLATE.md`.

### Development Rules

1. **Size Limit**: max 150 lines per file. Refactor and split when logic grows.
2. **Global Namespace**: do not pollute the global `window` object; use modules or namespaces.
3. **Validation**: every physics change must be verified by `verify_weaver.py`.
4. **Clean Code**: readable, self-documenting code.

### Interaction Protocol

- Follow the Plan -> Act -> Validate cycle for every new mechanic.
- `GEMINI.md` is the core instruction set for the AI assistant.

### Agent Personas

- **Jules-Architect** (system architect): core engine design and state sync. Focus: performance, security, scalable logic.
- **Neon-Engine** (physics and VFX): "Neon Phage" physics and effects. Focus: collision detection, growth, smooth rendering.
- **Catalyst** (assets and lore): game lore (`LORE.md`) and neon styling.

<!-- base-actions-main-policy -->
## GitHub Actions — padrão obrigatório (@main)

- Referencie as actions internas sempre pelo branch, nunca por SHA:
  - `uses: juninmd/base-actions/<action>@main`
  - `uses: juninmd/base-actions/.github/workflows/<arquivo>.yml@main`
- Não fixe `@<sha>` em `juninmd/base-actions`: a atualização é centralizada no
  `main` e passa a valer no próximo run.
- PRs cujos checks não iniciam por billing/spending limit são mesclados pelo bot central
  `juninmd/base-actions/.github/workflows/auto-merge-billing-blocked.yml`.
  Para impedir o merge automático de um PR, aplique a label `do-not-merge`.

## Gotchas

- `main.yml` `build-and-release` has placeholder steps: the Android `.aab`/`.apk` and the Docker image are fake `echo` files, and the lint step only echoes. Do not treat them as real builds. Changing them is outside this cleanup.
- The `lint` script uses `--fix`, so it rewrites files. Run it on a clean tree and review the diff.
- `verification/` scripts expect a server on `localhost:8000` (`python3 -m http.server 8000`) and Playwright with Chromium.
- No secrets are needed to run the game or tests. Optional server env vars: `PORT` (default 3000), `CORS_ORIGINS`, `NODE_ENV`, `MAX_PLAYERS_PER_ROOM` (default 20). Keep `ENV_PRODUCTION` and keystore values out of files and logs.
