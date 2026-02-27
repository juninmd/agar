export class UIHud {
    constructor() {
        this.scoreDisplay = document.getElementById('score-display');
        this.integrityBar = document.getElementById('integrity-bar');
        this.abilityOverlay = document.getElementById('ability-overlay');
        this.warningMessage = document.getElementById('warning-message');
        this.uiLayer = document.getElementById('ui-layer');
        this.titanBarContainer = null;
        this.titanBar = null;
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

    updateTitanHealth(percent) {
        if (!this.titanBar) this._createTitanBar();
        this.titanBar.style.width = `${Math.max(0, percent)}%`;
        if (percent <= 0 && this.titanBarContainer) {
            this.titanBarContainer.remove();
            this.titanBar = null;
            this.titanBarContainer = null;
        }
    }

    _createTitanBar() {
        if (this.titanBarContainer) return;

        const container = document.createElement('div');
        container.className = 'titan-health-container';
        container.innerHTML = `
            <div class="titan-label">NULL VOID TITAN</div>
            <div class="titan-health-bar-bg">
                <div class="titan-health-bar-fill"></div>
            </div>
        `;
        this.uiLayer.appendChild(container);
        this.titanBarContainer = container;
        this.titanBar = container.querySelector('.titan-health-bar-fill');
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

    showRaidWarning() {
        const warning = document.createElement('div');
        warning.className = 'raid-warning';
        warning.innerHTML = `
            <h1 class="glitch-text" data-text="WARNING">WARNING</h1>
            <p>DIMENSIONAL TEAR DETECTED</p>
        `;
        this.uiLayer.appendChild(warning);
        setTimeout(() => warning.remove(), 5000);
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
