/**
 * Manages the Database Modal interaction and content population.
 */
export class DatabaseUI {
    /**
     * @param {import('./lore_system.js').LoreSystem} loreSystem - The lore system instance.
     */
    constructor(loreSystem) {
        this.loreSystem = loreSystem;
        this.modal = document.getElementById('database-modal');
        this.openBtn = document.getElementById('database-btn');
        this.closeBtn = document.getElementById('close-db-btn');
        this.loreList = document.getElementById('lore-list');

        this._initListeners();
    }

    _initListeners() {
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.open());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });
        }
    }

    open() {
        this.populateLore();
        this.modal.classList.remove('hidden');
    }

    close() {
        this.modal.classList.add('hidden');
    }

    populateLore() {
        if (!this.loreList) return;
        this.loreList.innerHTML = '';

        // Ensure we have access to fragments
        const fragments = this.loreSystem.fragments || [];

        fragments.forEach(fragment => {
            const isUnlocked = this.loreSystem.isUnlocked(fragment.id);
            const entry = document.createElement('div');
            entry.className = 'lore-entry';

            if (!isUnlocked) {
                 entry.classList.add('locked');
                 entry.innerText = `LOG 0x${fragment.id.toString(16).toUpperCase().padStart(2, '0')}: [ENCRYPTED DATA]`;
            } else {
                 entry.innerText = fragment.text;
            }
            this.loreList.appendChild(entry);
        });
    }
}
