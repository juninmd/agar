import { UIAlerts } from './ui_alerts.js';
import { UITitanBar } from './ui_titan_bar.js';

/**
 * UIHud manages individual HUD elements like score, integrity bar, and alerts.
 */
export class UIHud {
    /**
     * Initializes the HUD elements.
     */
    constructor() {
        this.scoreDisplay = document.getElementById('score-display');
        this.integrityBar = document.getElementById('integrity-bar');
        this.abilityOverlay = document.getElementById('ability-overlay');
        this.warningMessage = document.getElementById('warning-message');
        this.uiLayer = document.getElementById('ui-layer');
        this.fpsCounter = document.getElementById('fps-counter');
        this.terminalTicker = document.getElementById('terminal-ticker');

        // Apply neon-glow class for Interface Richness
        const integrityContainer = document.getElementById('integrity-container');
        if (integrityContainer) integrityContainer.classList.add('neon-glow', 'holographic-hud');
        const scoreBoard = document.getElementById('score-board');
        if (scoreBoard) scoreBoard.classList.add('neon-glow', 'holographic-hud');
        const abilityHud = document.getElementById('ability-hud');
        if (abilityHud) abilityHud.classList.add('holographic-hud');

        this.titanBar = new UITitanBar(this.uiLayer);
    }

    /**
     * Toggles the visibility of the main HUD elements.
     * @param {boolean} active - Whether the HUD should be visible.
     */
    show(active) {
        const action = active ? 'remove' : 'add';
        const scoreBoard = document.getElementById('score-board');
        if (scoreBoard) scoreBoard.classList[action]('hidden');
        if (this.fpsCounter) this.fpsCounter.classList[action]('hidden');
        const integrityContainer = document.getElementById('integrity-container');
        if (integrityContainer) integrityContainer.classList[action]('hidden');
        const abilityHud = document.getElementById('ability-hud');
        if (abilityHud) abilityHud.classList[action]('hidden');
        if (this.terminalTicker) this.terminalTicker.classList[action]('hidden');
    }

    /**
     * Updates the terminal ticker text.
     * @param {string} text - The text to display in the ticker.
     */
    updateTicker(text) {
        if (this.terminalTicker) {
            this.terminalTicker.innerText = `> ${text}`;
        }
    }

    /**
     * Updates the FPS counter.
     * @param {number} fps - The current frames per second.
     */
    updateFPS(fps) {
        if (this.fpsCounter) this.fpsCounter.innerText = `${fps} FPS`;
    }

    /**
     * Updates the score (mass) display.
     * @param {number} mass - The player's current mass.
     */
    updateScore(mass) {
        const kb = Math.floor(mass);
        if (this.scoreDisplay) this.scoreDisplay.innerText = `${kb} KB`;
    }

    /**
     * Updates the system integrity bar.
     * @param {number} percent - The integrity percentage (0-100).
     */
    updateIntegrity(percent) {
        if (this.integrityBar) {
            const p = Math.max(0, percent);
            this.integrityBar.style.width = `${p}%`;
            this.integrityBar.style.backgroundColor = p > 50 ? '#00ff41' : p > 25 ? '#ffb800' : '#ff2244';
        }
    }

    /**
     * Updates the ability cooldown overlay.
     * @param {number} percent - The cooldown percentage (0-100).
     */
    updateAbilityCooldown(percent) {
        if (this.abilityOverlay) {
            this.abilityOverlay.style.height = `${percent}%`;
        }
    }

    /**
     * Updates the Null Void Titan boss health bar.
     * @param {number} percent - The health percentage (0-100).
     */
    updateTitanHealth(percent) {
        this.titanBar.update(percent);
    }

    /**
     * Shows a popup when a lore fragment is collected.
     * @param {string} text - The lore fragment text.
     */
    showLorePopup(text) {
        UIAlerts.showLorePopup(this.uiLayer, text);
    }

    /**
     * Toggles the critical system warning message.
     * @param {boolean} show - Whether to show the warning.
     */
    showWarning(show) {
        if (!this.warningMessage) return;
        clearTimeout(this.warningTimer);
        this.warningMessage.classList.toggle('hidden', !show);
        if (show) this.warningTimer = setTimeout(() => this.warningMessage.classList.add('hidden'), 5000);
    }

    /**
     * Shows the raid warning event message.
     */
    showRaidWarning() {
        UIAlerts.showRaidWarning(this.uiLayer);
    }

    /**
     * Shows the system purge alert message.
     */
    showPurgeAlert() {
        UIAlerts.showPurgeAlert(this.uiLayer);
    }

    /**
     * Shows a data corruption alert message.
     * @param {string} [message] - Custom message to display.
     */
    showCorruptionAlert(message) {
        UIAlerts.showCorruptionAlert(this.uiLayer, message);
    }
}
