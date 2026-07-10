# 💻 Kernel.io - Antivirus vs. PC Virus

> A macroscopic "Antivirus vs. PC Virus" digital ecosystem, built as a high-performance Agar.io clone.

[![Deployment Status](https://img.shields.io/badge/ArgoCD-Synced-success?style=for-the-badge&logo=argocd)](https://argocd.antonio-code.duckdns.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

## 📝 Description

**Kernel.io** is an experimental game inspired by the "agar.io" genre, where you control an antivirus or PC virus entity in a host system's memory. The goal is to consume data packets and processes, evolve, and survive against other digital entities and system hazards.

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
3. Open `http://localhost:8000` in your browser.

## 📦 Deployment

This project is served via **Nginx** on a **K3s** cluster.

- **Production URL**: [https://agar.antonio-code.duckdns.org](https://agar.antonio-code.duckdns.org)
