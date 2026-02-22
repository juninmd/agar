import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';
import { Bot } from './bot.js';

/**
 * Manages the "System Purge" event (Kernel Panic).
 * Triggers when player reaches critical mass, spawning Elite Hunters and glitching the UI.
 */
export class PurgeSystem {
    constructor() {
        this.isActive = false;
        this.timer = 0;
        this.cooldown = 0;
        this.duration = 1800; // 30 seconds at 60fps
        this.minMassThreshold = 2500;
        this.huntersSpawned = false;
    }

    canStart(player) {
        return !this.isActive && this.cooldown <= 0 && player.mass >= this.minMassThreshold;
    }

    startPurge(game) {
        console.log("PURGE STARTED");
        this.isActive = true;
        this.timer = this.duration;
        this.huntersSpawned = false;

        // Visual Effect
        document.body.classList.add('glitch-mode');
        game.ui.showCorruptionAlert("⚠️ KERNEL PANIC: SYSTEM PURGE INITIATED ⚠️");

        // Spawn Elite Hunters
        this.spawnHunters(game);
    }

    spawnHunters(game) {
        if (this.huntersSpawned) return;

        const hunterCount = 3;
        const spawnRadius = 800;
        const hunterType = CONSTANTS.BOT_TYPES.ELITE_HUNTER || { color: '#FFFFFF' };

        for (let i = 0; i < hunterCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const x = game.player.x + Math.cos(angle) * spawnRadius;
            const y = game.player.y + Math.sin(angle) * spawnRadius;

            // Constructor: x, y, radius, color, typeKey
            const hunter = new Bot(x, y, 60, hunterType.color, 'ELITE_HUNTER');
            game.bots.push(hunter);
        }
        this.huntersSpawned = true;
    }

    endPurge(game) {
        this.isActive = false;
        this.cooldown = 3600; // 60 seconds cooldown
        document.body.classList.remove('glitch-mode');
    }

    update(game) {
        if (this.cooldown > 0) this.cooldown--;

        if (this.isActive) {
            this.timer--;

            // Glitch screen shake intensity management
            if (this.timer % 60 === 0) {
                 game.renderer.screenShake = 10;
            }

            if (this.timer <= 0) {
                this.endPurge(game);
                game.ui.showNarrative("SYSTEM STABILIZED. PURGE FAILED.", "SUCCESS");
            } else if (game.player.mass < this.minMassThreshold * 0.8) {
                // End early if player loses too much mass
                this.endPurge(game);
                game.ui.showNarrative("THREAT REDUCED. PURGE CANCELED.", "INFO");
            }
        }
    }

    draw(ctx) {
        // Visuals are handled via CSS class 'glitch-mode' and Renderer screen shake
    }
}
