# 💻 Kernel.io - Antivirus vs. PC Virus

> A macroscopic "Antivirus vs. PC Virus" digital ecosystem, built as a high-performance Agar.io clone.

[![Deployment Status](https://img.shields.io/badge/ArgoCD-Synced-success?style=for-the-badge&logo=argocd)](https://argocd.antonio-code.duckdns.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

## 📝 Description

**Kernel.io** is an experimental game inspired by the "agar.io" genre, where you control an antivirus or PC virus entity in a host system's memory. The goal is to consume data packets and processes, evolve, and survive against other digital entities and system hazards.

## 📸 Screenshots

| Start screen | Gameplay |
| :---: | :---: |
| ![Start screen](docs/images/start-screen.png) | ![Gameplay](docs/images/gameplay.png) |

| System Purge event | Win screen |
| :---: | :---: |
| ![Purge event](docs/images/purge-event.png) | ![Win screen](docs/images/win-screen.png) |

| System archives | Mobile start | Mobile gameplay |
| :---: | :---: | :---: |
| ![Archives](docs/images/archives.png) | ![Mobile start](docs/images/mobile-start.png) | ![Mobile gameplay](docs/images/mobile-gameplay.png) |

> Regenerate them with `python3 -m http.server 8000` and `python3 screenshots.py` (needs `pip install playwright`).

## 🎮 Controls

| Input | Action |
| --- | --- |
| Mouse / touch joystick | Move |
| `SPACE` / DASH button | Dash (ejects mass for a speed boost) |
| `E` / right click | Protocol ability |
| Mouse wheel | Tactical zoom |

Reach **5000 KB** of data to force the Recompile and win. Beware of the System Purge at 2500 KB.

## 🛠️ Tech Stack

- **Frontend**: HTML5 Canvas, JavaScript (Vanilla), TypeScript
- **Styling**: CSS3
- **Game Logic**: Custom particle engine, macroscopic collision systems.
- **Automation**: Python scripts for verifying bot behaviors and zone rules.

## 🚀 How to Play Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/juninmd/agar.git
   ```
2. Run a local web server (e.g., `python3 -m http.server 8000`)
3. Open `http://localhost:8000` in your browser (add `?skipBoot` to skip the boot sequence).

Run the unit tests and linter with `pnpm install && pnpm test --run && pnpm exec eslint js`.

## 📦 Deployment

This project is served via **Nginx** on a **K3s** cluster.

- **Production URL**: [https://agar.antonio-code.duckdns.org](https://agar.antonio-code.duckdns.org)
