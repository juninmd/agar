/**
 * Manages the display of narrative "toasts" and system messages.
 */
export class NarrativeHUD {
    constructor(container) {
        this.container = container;
        this.activeToasts = [];
    }

    /**
     * Shows a narrative message.
     * @param {string} text - The message text.
     * @param {string} type - 'info', 'warning', 'critical', 'glitch'.
     */
    show(text, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `narrative-toast ${type}`;
        toast.innerText = text;

        // Glitch effect for critical messages
        if (type === 'glitch' || type === 'critical') {
            toast.setAttribute('data-text', text);
        }

        this.container.appendChild(toast);
        this.activeToasts.push(toast);
        this._updateToastPositions();

        // Remove after animation
        setTimeout(() => {
            toast.classList.add('fade-out');

            // Remove from array and update positions
            const index = this.activeToasts.indexOf(toast);
            if (index > -1) {
                this.activeToasts.splice(index, 1);
                this._updateToastPositions();
            }

            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 500); // Wait for fade out
        }, 4000); // Display time
    }

    _updateToastPositions() {
        const baseTop = 15; // Starting top percentage
        const spacing = 60; // Spacing in pixels

        this.activeToasts.forEach((toast, index) => {
            // baseTop is viewport height percentage, spacing is fixed px
            toast.style.top = `calc(${baseTop}% + ${index * spacing}px)`;
        });
    }
}
