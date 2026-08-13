import { UIHud } from './ui_hud.js';
import { NarrativeHUD } from './narrative_hud.js';
import { UIEvents } from './ui_events.js';
import { UILeaderboard } from './ui_leaderboard.js';

/**
 * Manages all UI interactions and updates.
 */
export class UIManager {
    /**
     * Initializes the UIManager, setting up UI components and DOM references.
     */
    constructor() {
        this.hud = new UIHud();
        this.narrative = new NarrativeHUD(this.hud.uiLayer);
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.winScreen = document.getElementById('win-screen');
        this.finalScoreDisplay = document.getElementById('final-score');
        this.nameInput = document.getElementById('player-name');
        this.roomIdInput = document.getElementById('room-id');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.winBtn = document.getElementById('win-btn');
        this.trueWinScreen = document.getElementById('true-win-screen');
        this.trueWinBtn = document.getElementById('true-win-btn');
        this.mobileDashBtn = document.getElementById('mobile-dash-btn');
        this.leaderboard = new UILeaderboard();

        this.onStart = null;
        this.onRestart = null;

        UIEvents.initListeners(this);
    }

    /**
     * Toggles the active state of the game UI.
     * @param {boolean} active - Whether the game is active.
     */
    setGameActive(active) {
        const joystickBase = document.getElementById('joystick-base');
        if (active) {
            this.startScreen.classList.add('hidden');
            this.gameOverScreen.classList.add('hidden');
            this.winScreen.classList.add('hidden');
            if (this.trueWinScreen) this.trueWinScreen.classList.add('hidden');
            this.hud.showWarning(false);
            this.mobileDashBtn.classList.add('active-game');
            if (joystickBase) joystickBase.classList.add('active-game');
            this.hud.uiLayer.style.pointerEvents = 'none';
            this.leaderboard.show(true);
        } else {
            this.hud.uiLayer.style.pointerEvents = 'auto';
            this.mobileDashBtn.classList.remove('active-game');
            if (joystickBase) joystickBase.classList.remove('active-game');
            this.leaderboard.show(false);
        }
    }

    /** @param {number} fps */
    updateFPS(fps) { this.hud.updateFPS(fps); }
    /** @param {number} mass */
    updateScore(mass) { this.hud.updateScore(mass); }
    /** @param {number} percent */
    updateIntegrity(percent) { this.hud.updateIntegrity(percent); }
    /** @param {number} percent */
    updateAbilityCooldown(percent) { this.hud.updateAbilityCooldown(percent); }
    /** @param {string} text */
    showLorePopup(text) { this.hud.showLorePopup(text); }
    /** @param {boolean} show */
    showWarning(show) { this.hud.showWarning(show); }
    /** Shows the system purge alert. */
    showPurgeAlert() { this.hud.showPurgeAlert(); }
    /** @param {string} [message] */
    showCorruptionAlert(message) { this.hud.showCorruptionAlert(message); }
    /** Shows the raid event warning. */
    showRaidWarning() { this.hud.showRaidWarning(); }
    /** @param {number} percent */
    updateTitanHealth(percent) { this.hud.updateTitanHealth(percent); }
    /**
     * Updates the leaderboard with current entities.
     * @param {Object} player - The player object.
     * @param {Array} bots - The list of bots.
     */
    updateLeaderboard(player, bots) { this.leaderboard.update(player, bots); }

    /**
     * @param {string} text
     * @param {string} [type]
     */
    showNarrative(text, type) { this.narrative.show(text, type); }

    /**
     * Shows the game over screen.
     * @param {string} reason - The reason for failure.
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
     * Shows the standard win screen.
     */
    showWin() {
        this.winScreen.classList.remove('hidden');
        this.setGameActive(false);
    }

    /**
     * Shows the true (omni) win screen.
     */
    showTrueWin() {
        if (this.trueWinScreen) {
            this.trueWinScreen.classList.remove('hidden');
            this.setGameActive(false);
        } else {
            this.showWin(); // Fallback
        }
    }

    /**
     * Checks if the OMNI protocol should be unlocked in the UI.
     * @param {import('./lore_system.js').LoreSystem} loreSystem - The lore system instance.
     */
    checkOmniUnlock(loreSystem) {
        if (loreSystem.unlocked.size >= 34) {
            const omniCard = document.getElementById('omni-protocol-card');
            if (omniCard) {
                omniCard.classList.remove('hidden');
            }
        }
    }
}
