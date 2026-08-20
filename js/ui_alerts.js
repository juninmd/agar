/**
 * UIAlerts manages all non-persistent alert elements for the UIHud.
 */
export class UIAlerts {
    /**
     * Shows a popup when a lore fragment is collected.
     * @param {HTMLElement} layer - The UI layer to append to.
     * @param {string} text - The lore fragment text.
     */
    static showLorePopup(layer, text) {
        const popup = document.createElement('div');
        popup.className = 'lore-popup';
        popup.innerHTML = `
            <div class="lore-header">DATA FRAGMENT RECOVERED</div>
            <div class="lore-body">${text}</div>
        `;
        layer.appendChild(popup);

        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 1000);
        }, 5000);
    }

    /**
     * Shows the raid warning event message.
     * @param {HTMLElement} layer - The UI layer to append to.
     */
    static showRaidWarning(layer) {
        const warning = document.createElement('div');
        warning.className = 'raid-warning';
        warning.innerHTML = `
            <h1 class="glitch-text" data-text="WARNING">WARNING</h1>
            <p>DIMENSIONAL TEAR DETECTED</p>
        `;
        layer.appendChild(warning);
        setTimeout(() => warning.remove(), 5000);
    }

    /**
     * Shows the system purge alert message.
     * @param {HTMLElement} layer - The UI layer to append to.
     */
    static showPurgeAlert(layer) {
        const alert = document.createElement('div');
        alert.className = 'purge-alert';
        alert.textContent = 'SYSTEM PURGE INITIATED // NULL VOID DETECTED';
        layer.appendChild(alert);
        setTimeout(() => {
            if (alert.parentNode) alert.remove();
        }, 10000);
    }

    /**
     * Shows a data corruption alert message.
     * @param {HTMLElement} layer - The UI layer to append to.
     * @param {string} [message] - Custom message to display.
     */
    static showCorruptionAlert(layer, message) {
        const alert = document.createElement('div');
        alert.className = 'corruption-alert';
        alert.textContent = message || 'DATA CORRUPTED // MASS LOST';
        layer.appendChild(alert);
        setTimeout(() => alert.remove(), 2000);
    }
}
