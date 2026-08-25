/**
 * Manages the UI health bar for the Null Void Titan boss.
 */
export class UITitanBar {
    /**
     * Initializes the Titan Bar manager.
     * @param {HTMLElement} uiLayer - The UI layer to append the bar to.
     */
    constructor(uiLayer) {
        this.uiLayer = uiLayer;
        this.container = null;
        this.bar = null;
    }

    /**
     * Updates the Null Void Titan boss health bar.
     * @param {number} percent - The health percentage (0-100).
     */
    update(percent) {
        if (!this.bar) this._create();
        this.bar.style.width = `${Math.max(0, percent)}%`;
        if (percent <= 0 && this.container) {
            this.container.remove();
            this.bar = null;
            this.container = null;
        }
    }

    /**
     * Creates the Titan health bar dynamically.
     * @private
     */
    _create() {
        if (this.container) return;

        const container = document.createElement('div');
        container.className = 'titan-health-container';
        container.innerHTML = `
            <div class="titan-label">NULL VOID TITAN</div>
            <div class="titan-health-bar-bg">
                <div class="titan-health-bar-fill"></div>
            </div>
        `;
        this.uiLayer.appendChild(container);
        this.container = container;
        this.bar = container.querySelector('.titan-health-bar-fill');
    }
}
