/**
 * Manages the display of narrative "toasts" and system messages.
 */
export class NarrativeHUD {
    constructor(container) {
        this.container = container;
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

        // Remove after animation
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 500); // Wait for fade out
        }, 4000); // Display time
    }
}
