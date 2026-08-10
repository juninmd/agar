export class UILeaderboard {
    constructor() {
        this.container = document.getElementById('leaderboard');
        this.list = document.getElementById('leaderboard-list');
        this.lastUpdate = 0;
        this.updateInterval = 1000; // Update every second
    }

    /**
     * Updates the leaderboard with the top 10 entities.
     * @param {Object} player - The player entity.
     * @param {Array} bots - The bot entities.
     */
    update(player, bots) {
        if (!this.container || !this.list) return;

        const now = Date.now();
        if (now - this.lastUpdate < this.updateInterval) return;
        this.lastUpdate = now;

        const allEntities = [player, ...bots].filter(e => e && !e.markedForDeletion);

        // Sort by mass descending
        allEntities.sort((a, b) => b.mass - a.mass);

        // Take top 10
        const top10 = allEntities.slice(0, 10);

        this.list.innerHTML = '';
        top10.forEach((entity, index) => {
            const li = document.createElement('li');

            // Highlight player
            if (entity === player) {
                li.style.color = 'var(--neon-green)';
                li.style.textShadow = '0 0 5px var(--neon-green)';
                li.style.fontWeight = 'bold';
            }

            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${index + 1}. ${entity.name || entity.type || 'UNKNOWN'}`;

            const massSpan = document.createElement('span');
            massSpan.textContent = `${Math.floor(entity.mass)} KB`;

            li.appendChild(nameSpan);
            li.appendChild(massSpan);
            this.list.appendChild(li);
        });
    }

    /**
     * Toggles visibility of the leaderboard.
     * @param {boolean} show
     */
    show(show) {
        if (!this.container) return;
        if (show) {
            this.container.classList.remove('hidden');
        } else {
            this.container.classList.add('hidden');
        }
    }
}
