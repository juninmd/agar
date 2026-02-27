import { NullVoidTitan } from './titan.js';
import { CONSTANTS } from './constants.js';

/**
 * Manages the lifecycle of the "Distributed Defense" Raid Event.
 * Triggers when system integrity is critical and player is powerful enough.
 */
export class RaidSystem {
    constructor() {
        this.isActive = false;
        this.cooldown = 0;
        this.activeTitan = null;
    }

    /**
     * Checks triggers and updates the active raid state.
     * @param {Game} game
     */
    update(game) {
        if (this.cooldown > 0) this.cooldown--;

        // Check Trigger: Low Integrity + High Mass (Endgame challenge)
        if (!this.isActive && this.cooldown <= 0) {
            if (game.systemIntegrity < 20 && game.player.mass > 2000) {
                this.startRaid(game);
            }
        }

        if (this.isActive) {
            if (!this.activeTitan || this.activeTitan.markedForDeletion) {
                this.endRaid(game, true);
            }

            if (this.activeTitan) {
                 if (game.ui.updateTitanHealth) {
                     const health = (this.activeTitan.mass / 15000) * 100;
                     game.ui.updateTitanHealth(health);
                 }
            }
        }
    }

    /**
     * Initiates the Raid event, spawning the Titan and showing UI alerts.
     * @param {Game} game
     */
    startRaid(game) {
        this.isActive = true;

        // Spawn Titan far away
        const angle = Math.random() * Math.PI * 2;
        const dist = 1500;
        const tx = game.player.x + Math.cos(angle) * dist;
        const ty = game.player.y + Math.sin(angle) * dist;

        this.activeTitan = new NullVoidTitan(tx, ty);
        game.bots.push(this.activeTitan);

        // UI Alerts
        if (game.ui.showRaidWarning) {
            game.ui.showRaidWarning();
        }

        game.renderer.screenShake = 50;
        game.ui.showNarrative("CRITICAL THREAT: NULL VOID TITAN DETECTED", "critical");
    }

    /**
     * Ends the raid event.
     * @param {Game} game
     * @param {boolean} success - Whether the Titan was defeated.
     */
    endRaid(game, success) {
        this.isActive = false;
        this.activeTitan = null;
        this.cooldown = 7200; // 2 minutes cooldown

        if (success) {
            game.ui.showNarrative("TITAN DESTROYED. INTEGRITY RESTORED.", "success");
            game.systemIntegrity = Math.min(100, game.systemIntegrity + 50);

            // Clear health bar
            if (game.ui.updateTitanHealth) {
                game.ui.updateTitanHealth(0);
            }
        }
    }
}
