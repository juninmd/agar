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

        // Position it explicitly. Get existing toasts to calculate top offset
        const existingToasts = Array.from(this.container.querySelectorAll('.narrative-toast:not(.fade-out)'));
        let topOffset = 15; // Starting top offset in vh/percent

        if (existingToasts.length > 0) {
            topOffset = 15 + (existingToasts.length * 10); // stack downwards with 10% gap
        }

        toast.style.top = `${topOffset}%`;

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
