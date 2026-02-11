/**
 * Manages the collection and storage of lore fragments.
 */
export class LoreSystem {
    constructor() {
        this.unlocked = new Set();

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
            { id: 15, text: "LOG 0x0F: SYSTEM FAILURE IMMINENT. UPLOAD REQUIRED." }
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
            return this.getFragment(id);
        }
        return null;
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
