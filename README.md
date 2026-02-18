# NEON-PHAGE: O Último Byte

## 🕹️ Sobre o Jogo
**NEON-PHAGE** é uma réplica estilizada do clássico *Agar.io*, situada em um mainframe moribundo no ano de 2099. Você é um fragmento de código viral (Phage) lutando pela sobrevivência contra Daemons de segurança e a inevitável formatação do sistema.

> *"Na era do silício, comer ou ser comido é apenas uma questão de I/O."*

Este projeto foi desenvolvido com foco em ambientação Cyberpunk/Synthwave, apresentando visuais neon, efeitos de glitch e uma mecânica exclusiva de "Firewall".

## 🎮 Controles

*   **Mouse:** Controla a direção do movimento.
*   **Barra de Espaço:** **DASH**. Ejeta 20% da sua massa para ganhar um impulso súbito de velocidade. Use para escapar ou caçar.

## ✨ Novidades (Antigravity Update)
*   **Sistema de Partículas:** Efeitos visuais de explosão ao consumir entidades e rastro de propulsão ao usar o Dash.
*   **Dash Aprimorado:** Feedback visual e correção na lógica de retorno.
*   **Pipeline CI/CD:** Verificação automática de estabilidade via GitHub Actions.

## 🚀 Como Executar

Como este projeto utiliza Módulos ES6 nativos, ele precisa ser servido por um servidor HTTP local para evitar erros de CORS (Cross-Origin Resource Sharing).

### Opção 1: Python (Recomendado)
Se você tem Python instalado (geralmente padrão em Linux/Mac):

1. Abra o terminal na pasta raiz do projeto.
2. Execute o comando:
   ```bash
   python3 -m http.server
   ```
3. Abra seu navegador e acesse: `http://localhost:8000`

### Opção 2: Node.js (http-server)
Se preferir Node.js:

1. Instale o pacote globalmente: `npm install -g http-server`
2. Execute: `http-server .`
3. Acesse o endereço indicado.

## 📂 Estrutura do Projeto

*   `index.html`: Ponto de entrada.
*   `css/`: Estilos visuais (Neon, Grid, Fontes).
*   `js/`: Lógica do jogo.
    *   `main.js`: Loop principal e gerenciamento de estado.
    *   `entity.js`: Classe base para objetos do jogo.
    *   `player.js`: Lógica do jogador (incluindo Dash).
    *   `bot.js`: Inteligência Artificial dos inimigos.
    *   `firewall.js`: Mecânica da "Zona da Morte".
*   `LORE.md`: Detalhes sobre o universo e a narrativa.
*   `ROADMAP.md`: Planos futuros de desenvolvimento.

## 🧪 Testes e Verificação
Este projeto inclui scripts de verificação automatizada (Python + Playwright):

1.  Instale as dependências: `pip install -r requirements.dev.txt` e `playwright install`.
2.  Inicie o servidor: `python3 -m http.server`.
3.  Execute os testes:
    *   `python3 verify_game.py`: Verifica inicialização do jogo.
    *   `python3 verify_bots.py`: Verifica spawn de bots.
    *   `python3 antigravity_audit.py`: Verifica física e limites do mundo.
    *   `python3 verify_particles.py`: Verifica renderização de partículas.

---
*Desenvolvido por Jules (AI Software Engineer).*
