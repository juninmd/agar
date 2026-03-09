import { UIHud } from './ui_hud.js';
import { NarrativeHUD } from './narrative_hud.js';

/**
 * Manages all UI interactions and updates.
 */
export class UIManager {
    constructor() {
        this.hud = new UIHud();
        this.narrative = new NarrativeHUD(this.hud.uiLayer);
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.winScreen = document.getElementById('win-screen');
        this.finalScoreDisplay = document.getElementById('final-score');
        this.nameInput = document.getElementById('player-name');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.winBtn = document.getElementById('win-btn');
        this.trueWinScreen = document.getElementById('true-win-screen');
        this.trueWinBtn = document.getElementById('true-win-btn');
        this.mobileDashBtn = document.getElementById('mobile-dash-btn');

        this.onStart = null;
        this.onRestart = null;

        this._initListeners();
    }

    _initListeners() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => {
                const name = this.nameInput.value || "Unit 734";
                const protocol = document.querySelector('.protocol-card.selected')?.dataset.id || 'HACKER';
                if (this.onStart) this.onStart(name, protocol);
            });
        }

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

        if (this.trueWinBtn) {
            this.trueWinBtn.addEventListener('click', () => {
                if (this.onRestart) this.onRestart();
            });
        }
    }

    setGameActive(active) {
        if (active) {
            this.startScreen.classList.add('hidden');
            this.gameOverScreen.classList.add('hidden');
            this.winScreen.classList.add('hidden');
            if (this.trueWinScreen) this.trueWinScreen.classList.add('hidden');
            this.hud.showWarning(false);
            this.mobileDashBtn.classList.add('active-game');
            this.hud.uiLayer.style.pointerEvents = 'none';
        } else {
            this.hud.uiLayer.style.pointerEvents = 'auto';
            this.mobileDashBtn.classList.remove('active-game');
        }
    }

    updateScore(mass) { this.hud.updateScore(mass); }
    updateIntegrity(percent) { this.hud.updateIntegrity(percent); }
    updateAbilityCooldown(percent) { this.hud.updateAbilityCooldown(percent); }
    showLorePopup(text) { this.hud.showLorePopup(text); }
    showWarning(show) { this.hud.showWarning(show); }
    showPurgeAlert() { this.hud.showPurgeAlert(); }
    showCorruptionAlert(message) { this.hud.showCorruptionAlert(message); }
    showRaidWarning() { this.hud.showRaidWarning(); }
    updateTitanHealth(percent) { this.hud.updateTitanHealth(percent); }
    showNarrative(text, type) { this.narrative.show(text, type); }

    showGameOver(reason, score) {
        this.finalScoreDisplay.innerText = Math.floor(score);
        const reasonEl = this.gameOverScreen.querySelector('.error-text');
        if (reasonEl) reasonEl.innerText = reason || "FATAL ERROR";
        this.gameOverScreen.classList.remove('hidden');
        this.setGameActive(false);
    }

    showWin() {
        this.winScreen.classList.remove('hidden');
        this.setGameActive(false);
    }

    showTrueWin() {
        if (this.trueWinScreen) {
            this.trueWinScreen.classList.remove('hidden');
            this.setGameActive(false);
        } else {
            this.showWin(); // Fallback
        }
    }

    checkOmniUnlock(loreSystem) {
        if (loreSystem.unlocked.size >= 34) {
            const omniCard = document.getElementById('omni-protocol-card');
            if (omniCard) {
                omniCard.classList.remove('hidden');
            }
        }
    }
}
