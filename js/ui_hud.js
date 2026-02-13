export class UIHud {
    constructor() {
        this.scoreDisplay = document.getElementById('score-display');
        this.integrityBar = document.getElementById('integrity-bar');
        this.abilityOverlay = document.getElementById('ability-overlay');
        this.warningMessage = document.getElementById('warning-message');
        this.uiLayer = document.getElementById('ui-layer');
    }

    updateScore(mass) {
        const kb = Math.floor(mass);
        if (this.scoreDisplay) this.scoreDisplay.innerText = `${kb} KB`;
    }

    updateIntegrity(percent) {
        if (this.integrityBar) this.integrityBar.style.width = `${Math.max(0, percent)}%`;
    }

    updateAbilityCooldown(percent) {
        if (this.abilityOverlay) {
            this.abilityOverlay.style.height = `${percent}%`;
        }
    }

    showLorePopup(text) {
        const popup = document.createElement('div');
        popup.className = 'lore-popup';
        popup.innerHTML = `
            <div class="lore-header">DATA FRAGMENT RECOVERED</div>
            <div class="lore-body">${text}</div>
        `;
        this.uiLayer.appendChild(popup);

        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 1000);
        }, 5000);
    }

    showWarning(show) {
        if (!this.warningMessage) return;
        if (show) {
            this.warningMessage.classList.remove('hidden');
            setTimeout(() => this.warningMessage.classList.add('hidden'), 5000);
        } else {
            this.warningMessage.classList.add('hidden');
        }
    }

    showPurgeAlert() {
        const alert = document.createElement('div');
        alert.className = 'purge-alert';
        alert.innerText = 'SYSTEM PURGE INITIATED // NULL VOID DETECTED';
        this.uiLayer.appendChild(alert);
        setTimeout(() => {
            if (alert.parentNode) alert.remove();
        }, 10000);
    }

    showCorruptionAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'corruption-alert';
        alert.innerText = message || 'DATA CORRUPTED // MASS LOST';
        this.uiLayer.appendChild(alert);
        setTimeout(() => alert.remove(), 2000);
    }
}
