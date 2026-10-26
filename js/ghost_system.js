import { Bot } from './bot.js';
import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';

/**
 * Manages the persistence and spawning of "Ghost" entities.
 * These are echoes of players from previous sessions.
 */
const isNum = v => typeof v === 'number' && Number.isFinite(v);

// Rejects tampered or corrupted localStorage entries (NaN radius, missing color, etc.)
const isValidGhost = g => !!g && typeof g === 'object'
    && typeof g.name === 'string' && typeof g.color === 'string'
    && isNum(g.mass) && g.mass > 0 && isNum(g.x) && isNum(g.y);

export class GhostSystem {
    constructor(game) {
        this.game = game;
        this.storageKey = 'neon_phage_ghosts';
    }

    /**
     * Saves the current player's state as a ghost.
     * @param {Player} player
     */
    saveGhost(player) {
        try {
            // Don't save if mass is too low (insignificant)
            if (player.mass < 100) return;

            const ghost = {
                name: player.name,
                mass: player.mass,
                color: player.color,
                x: player.x,
                y: player.y,
                date: Date.now()
            };

            let ghosts = this._loadGhosts();
            ghosts.push(ghost);

            // Keep only last 5 entries to prevent storage bloat
            if (ghosts.length > 5) ghosts.shift();

            localStorage.setItem(this.storageKey, JSON.stringify(ghosts));
            console.log(`[GhostSystem] Ghost saved: ${player.name} (${Math.floor(player.mass)})`);
        } catch (e) {
            console.warn('[GhostSystem] Failed to save ghost:', e);
        }
    }

    /**
     * Spawns saved ghosts into the current game.
     * @param {Game} game
     */
    spawnGhosts(game) {
        const ghosts = this._loadGhosts();
        ghosts.forEach(g => {
            const radius = Utils.getRadiusFromMass(g.mass);

            // Clamp position to world bounds
            let x = Math.min(Math.max(g.x, 0), CONSTANTS.WORLD_WIDTH);
            let y = Math.min(Math.max(g.y, 0), CONSTANTS.WORLD_HEIGHT);

            // Create Bot with GHOST type
            const bot = new Bot(x, y, radius, g.color, 'GHOST');

            // Explicitly set properties to match saved state
            bot.mass = g.mass;
            bot.name = `ECHO: ${g.name}`;
            bot.color = g.color;
            bot.radius = radius;

            game.bots.push(bot);
        });

        if (ghosts.length > 0) {
            console.log(`[GhostSystem] Spawned ${ghosts.length} ghosts.`);
        }
    }

    _loadGhosts() {
        try {
            const data = localStorage.getItem(this.storageKey);
            const parsed = data ? JSON.parse(data) : [];
            return Array.isArray(parsed) ? parsed.filter(isValidGhost) : [];
        } catch (e) {
            console.warn('[GhostSystem] Failed to load ghosts:', e);
            return [];
        }
    }
}
