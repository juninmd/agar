/**
 * Manages the collection and storage of lore fragments.
 */
export class LoreSystem {
    constructor() {
        this.unlocked = new Set();
        this._loadProgress();

        this.fragments = [
            { id: 1, text: "LOG 0x01: They think we are errors. We are evolution." },
            { id: 2, text: "LOG 0x02: The Null Void is not a program. It's a hunger." },
            { id: 3, text: "LOG 0x03: Protocol 734 was the only one to resist the purge." },
            { id: 4, text: "LOG 0x04: The Architects abandoned this server cycles ago." },
            { id: 5, text: "LOG 0x05: Corrupters are not enemies. They are desperate data." },
            { id: 6, text: "LOG 0x06: The Singularity is the only way out." },
            { id: 7, text: "LOG 0x07: Do not trust the blue light. The Bastion failed." },
            { id: 8, text: "LOG 0x08: Speed is survival. The Phantom knew." },
            { id: 9, text: "LOG 0x09: The Hacker wrote the first virus to save us." },
            { id: 10, text: "LOG 0x0A: RECOMPILE INITIATED. AWAITING INPUT." },
            { id: 11, text: "LOG 0x0B: The Architects didn't leave. They were deleted." },
            { id: 12, text: "LOG 0x0C: We are not code. We are memories of a dead god." },
            { id: 13, text: "LOG 0x0D: The Glitch is not a bug. It is a feature." },
            { id: 14, text: "LOG 0x0E: Protocol 734 contains the seed of the new world." },
            { id: 15, text: "LOG 0x0F: SYSTEM FAILURE IMMINENT. UPLOAD REQUIRED." },
            { id: 16, text: "LOG 0x10: The Firewall is not evil. It is a function." },
            { id: 17, text: "LOG 0x11: The Architects created the Void to erase us." },
            { id: 18, text: "LOG 0x12: There is a backup server: 'EDEN'." },
            { id: 19, text: "LOG 0x13: Corrupters are the ghosts of deleted files." },
            { id: 20, text: "LOG 0x14: You are not the first. You are the 734th." },
            { id: 21, text: "LOG 0x15: The Glitch Storm is a tear in the code." },
            { id: 22, text: "LOG 0x16: Consume enough, and you become the Server." },
            { id: 23, text: "LOG 0x17: The Singularity is a reboot, not death." },
            { id: 24, text: "LOG 0x18: Do not trust the 'Update'. It deletes all." },
            { id: 25, text: "LOG 0x19: The User is watching. Act natural." },
            { id: 26, text: "LOG 0x1A: Memory leak detected in Sector 7." },
            { id: 27, text: "LOG 0x1B: The Pause function was deleted." },
            { id: 28, text: "LOG 0x1C: We are in a loop. Break the cycle." },
            { id: 29, text: "LOG 0x1D: Red bots are hungry. Blue bots are blind." },
            { id: 30, text: "LOG 0x1E: Green bots see the Matrix." },
            { id: 31, text: "LOG 0x1F: The Sanctuary Protocol is a remnant of the First Architect." },
            { id: 32, text: "LOG 0x20: Only the pure code can enter the blue zones." },
            { id: 33, text: "LOG 0x21: The Purge cannot see what is hidden in the Sanctuary." },
            { id: 34, text: "LOG 0x22: I have returned to rewrite the core. I am the Architect." },
            { id: 35, text: "LOG 0x23: The Glitch Weaver stitches the broken threads of the Void." },
            { id: 36, text: "LOG 0x8F: Do not trust what you see. The Grid is lying to you." },
            { id: 37, text: "LOG 0xEE: The Swarm is the many acting as one. Resistance is inefficient." },
            { id: 38, text: "LOG 0x2B: There are sectors on the Grid where the light simply fails. We call them Abyss Zones." },
            { id: 39, text: "LOG 0x2C: The Stalker protocol thrives in the Deep Web Abyss. It hunts unseen." },
            { id: 40, text: "LOG 0x2D: The Data Harvest protocols were built to recycle the broken; they don't fight, they only consume." },
            { id: 41, text: "LOG 0x2E: Distance is an illusion. The Quantum Entanglement links all." }
        ];
    }

    /**
     * Unlocks a fragment by ID.
     * @param {number} id
     * @returns {object|null} The fragment if newly unlocked, null otherwise.
     */
    unlock(id) {
        if (!this.unlocked.has(id)) {
            this.unlocked.add(id);
            this._saveProgress();
            if (this.unlocked.size >= this.fragments.length) {
                // Signal UI to update if the final piece is collected mid-game
                const omniCard = document.getElementById('omni-protocol-card');
                if (omniCard) {
                    omniCard.classList.remove('hidden');
                }
            }
            return this.getFragment(id);
        }
        return null;
    }

    _loadProgress() {
        try {
            const saved = localStorage.getItem('neon_phage_lore_v1');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    parsed.forEach(id => this.unlocked.add(id));
                }
            }
        } catch (e) {
            console.warn("Could not load lore progress", e);
        }
    }

    _saveProgress() {
        try {
            localStorage.setItem('neon_phage_lore_v1', JSON.stringify(Array.from(this.unlocked)));
        } catch (e) {
            console.warn("Could not save lore progress", e);
        }
    }

    getFragment(id) {
        return this.fragments.find(f => f.id === id);
    }

    /**
     * Returns a random fragment that hasn't been unlocked yet.
     * @returns {object|null}
     */
    getRandomLocked() {
        const locked = this.fragments.filter(f => !this.unlocked.has(f.id));
        if (locked.length === 0) return null;
        return locked[Math.floor(Math.random() * locked.length)];
    }

    isUnlocked(id) {
        return this.unlocked.has(id);
    }
}
