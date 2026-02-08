/**
 * Manages all UI interactions and updates.
 */
export class UIManager {
    constructor() {
        // UI Elements
        this.uiLayer = document.getElementById('ui-layer');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.winScreen = document.getElementById('win-screen');
        this.scoreDisplay = document.getElementById('score-display');
        this.finalScoreDisplay = document.getElementById('final-score');
        this.nameInput = document.getElementById('player-name');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.winBtn = document.getElementById('win-btn');
        this.warningMessage = document.getElementById('warning-message');
        this.integrityBar = document.getElementById('integrity-bar');
        this.mobileDashBtn = document.getElementById('mobile-dash-btn');

        // Database UI
        this.databaseBtn = document.getElementById('database-btn');
        this.databaseModal = document.getElementById('database-modal');
        this.closeDbBtn = document.getElementById('close-db-btn');

        // Callbacks
        /** @type {function(string): void} */
        this.onStart = null;
        /** @type {function(): void} */
        this.onRestart = null;

        this._initListeners();
    }

    /**
     * Initialize DOM event listeners.
     * @private
     */
    _initListeners() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => {
                const name = this.nameInput.value || "Unit 734";
                const protocol = document.querySelector('.protocol-card.selected')?.dataset.id || 'HACKER';
                if (this.onStart) this.onStart(name, protocol);
            });
        }

        // Protocol Selection
        const protocolCards = document.querySelectorAll('.protocol-card');
        protocolCards.forEach(card => {
            card.addEventListener('click', () => {
                protocolCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });

        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => {
                if (this.onRestart) this.onRestart();
            });
        }

        if (this.winBtn) {
            this.winBtn.addEventListener('click', () => {
                if (this.onRestart) this.onRestart();
            });
        }

        // Database Modal
        if (this.databaseBtn && this.databaseModal && this.closeDbBtn) {
            this.databaseBtn.addEventListener('click', () => {
                this.databaseModal.classList.remove('hidden');
            });

            this.closeDbBtn.addEventListener('click', () => {
                this.databaseModal.classList.add('hidden');
            });

            this.databaseModal.addEventListener('click', (e) => {
                if (e.target === this.databaseModal) {
                    this.databaseModal.classList.add('hidden');
                }
            });
        }
    }

    /**
     * Set the visibility of game UI elements.
     * @param {boolean} active - Whether the game is running.
     */
    setGameActive(active) {
        if (active) {
            this.startScreen.classList.add('hidden');
            this.gameOverScreen.classList.add('hidden');
            this.winScreen.classList.add('hidden');
            this.warningMessage.classList.add('hidden');
            this.mobileDashBtn.classList.add('active-game');
            this.uiLayer.style.pointerEvents = 'none';
        } else {
            this.uiLayer.style.pointerEvents = 'auto';
            this.mobileDashBtn.classList.remove('active-game');
        }
    }

    /**
     * Update the score display.
     * @param {number} mass - Current player mass.
     */
    updateScore(mass) {
        const kb = Math.floor(mass);
        this.scoreDisplay.innerText = `${kb} KB`;
    }

    /**
     * Update the system integrity bar.
     * @param {number} percent - Integrity percentage (0-100).
     */
    updateIntegrity(percent) {
        this.integrityBar.style.width = `${Math.max(0, percent)}%`;
    }

    /**
     * Show or hide the warning message.
     * @param {boolean} show - Whether to show the warning.
     */
    showWarning(show) {
        if (show) {
            this.warningMessage.classList.remove('hidden');
            setTimeout(() => this.warningMessage.classList.add('hidden'), 5000);
        } else {
            this.warningMessage.classList.add('hidden');
        }
    }

    /**
     * Display the Game Over screen.
     * @param {string} reason - The reason for game over.
     * @param {number} score - The final score.
     */
    showGameOver(reason, score) {
        this.finalScoreDisplay.innerText = Math.floor(score);
        const reasonEl = this.gameOverScreen.querySelector('.error-text');
        if (reasonEl) reasonEl.innerText = reason || "FATAL ERROR";
        this.gameOverScreen.classList.remove('hidden');
        this.setGameActive(false);
    }

    /**
     * Display the Win screen.
     */
    showWin() {
        this.winScreen.classList.remove('hidden');
        this.setGameActive(false);
    }

    /**
     * Show the System Purge alert overlay.
     */
    showPurgeAlert() {
        const alert = document.createElement('div');
        alert.className = 'purge-alert';
        alert.innerText = 'SYSTEM PURGE INITIATED // NULL VOID DETECTED';
        this.uiLayer.appendChild(alert);
        setTimeout(() => {
            if (alert.parentNode) alert.remove();
        }, 10000);
    }

    /**
     * Show a corruption/data loss alert.
     * @param {string} [message] - Custom message.
     */
    showCorruptionAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'corruption-alert';
        alert.innerText = message || 'DATA CORRUPTED // MASS LOST';
        this.uiLayer.appendChild(alert);
        setTimeout(() => alert.remove(), 2000);
    }
}
