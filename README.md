# 🧬 Agar - Abyss Runner

> Uma experiência de evolução biológica frenética e viciante.

[![Deployment Status](https://img.shields.io/badge/ArgoCD-Synced-success?style=for-the-badge&logo=argocd)](https://argocd.antonio-code.duckdns.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

## 📝 Descrição

**Agar** (Abyss Runner) é um jogo experimental inspirado no gênero "agar.io", onde você controla uma célula biológica em um abismo hostil. O objetivo é consumir nutrientes, evoluir e sobreviver contra outras entidades biológicas e perigos do ambiente.

## 🛠️ Tech Stack

- **Frontend**: HTML5 Canvas, JavaScript (Vanilla)
- **Estilização**: CSS3
- **Lógica de Jogo**: Engine de partículas customizada, sistemas de colisão biológica.
- **Automação**: Scripts em Python para verificação de zonas e comportamentos de bots.

## 🚀 Como Jogar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/juninmd/agar.git
   ```
2. Abra o arquivo `index.html` no seu navegador.

## 📦 Deployment

Este projeto é servido via **Nginx** em um cluster **K3s**.

- **URL de Produção**: [https://agar.antonio-code.duckdns.org](https://agar.antonio-code.duckdns.org)
