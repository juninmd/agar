import { Utils } from './utils.js';
import { Spawner } from './spawner.js';

/**
 * Manages the Singularity Event V2 mechanics.
 * Handles gravity wells, event horizon consumption, instability, and Void Walker spawning.
 */
export class SingularitySystem {
    /**
     * @param {UIManager} ui - UI manager for alerts.
     * @param {Renderer} renderer - Renderer for screen shake.
     */
    constructor(ui, renderer) {
        this.ui = ui;
        this.renderer = renderer;
        this.active = false;
        this.massThreshold = 4000;
        this.gravityConstant = 5000;
        this.maxRange = 2000;
        this.instability = 0;
    }

    /**
     * Updates the singularity state each frame.
     * @param {Player} player - The player instance.
     * @param {Entity[]} entities - All game entities (bots + foods).
     * @param {Bot[]} bots - Array of bots for Void Walker spawning.
     */
    update(player, entities, bots = []) {
        if (!this.active && player.mass > this.massThreshold) this.activate();

        if (this.active) {
            this.applyGravity(player, entities);
            this.checkEventHorizon(player, entities);
            this.manageInstability(player, bots);
            this.triggerEffects();
        } else {
            this.instability = Math.max(0, this.instability - 0.1);
        }
    }

    /** Triggers the start of the Singularity Event. */
    activate() {
        this.active = true;
        this.ui.showCorruptionAlert("⚠ SINGULARITY DETECTED ⚠");
        this.renderer.screenShake = 50;
        document.body.classList.add('glitch-mode');
        setTimeout(() => document.body.classList.remove('glitch-mode'), 2000);
    }

    /** Applies gravitational pull to entities within range. */
    applyGravity(player, entities) {
        entities.forEach(e => {
            if (e === player || e.type === 'VOID_WALKER') return; // Void Walkers are immune
            const dx = player.x - e.x;
            const dy = player.y - e.y;
            const distSq = dx*dx + dy*dy;
            const dist = Math.sqrt(distSq);
            if (dist < this.maxRange && dist > player.radius) {
                const force = (player.mass / (distSq + 1000)) * 50;
                const angle = Math.atan2(dy, dx);
                e.x += Math.cos(angle) * force;
                e.y += Math.sin(angle) * force;
            }
        });
    }

    /** Consumes entities that cross the Event Horizon. */
    checkEventHorizon(player, entities) {
        // Horizon extends beyond physical body due to intense gravity
        const horizon = player.radius * 1.2;
        entities.forEach(e => {
            if (e === player || e.markedForDeletion || e.type === 'VOID_WALKER') return;
            const dist = Utils.getDistance(player.x, player.y, e.x, e.y);
            if (dist < horizon) {
                e.markedForDeletion = true;
                player.mass += e.mass;
                player.radius = Utils.getRadiusFromMass(player.mass);
                this.instability = Math.min(100, this.instability + 2);
            }
        });
    }

    /** Handles instability growth/decay and random Void Walker spawns. */
    manageInstability(player, bots) {
        if (this.instability >= 100) {
            this.discharge(player);
            // Don't return, allow visuals to sync (instability becomes 0)
        } else {
            this.instability = Math.max(0, this.instability - 0.05);
        }

        if (this.instability > 50 && bots.length > 0 && Math.random() < 0.02) {
             bots.push(Spawner.spawnVoidWalker(player));
             this.ui.showCorruptionAlert("⚠ VOID WALKER DETECTED ⚠");
        }

        player.instability = this.instability; // Sync for visuals
    }

    /** Triggers a Critical Mass Discharge, resetting instability and halving player mass. */
    discharge(player) {
        this.instability = 0;
        player.mass *= 0.5;
        player.radius = Utils.getRadiusFromMass(player.mass);
        this.renderer.screenShake = 100;
        this.ui.showCorruptionAlert("⚠ CRITICAL MASS DISCHARGE ⚠");
    }

    /** Applies screen shake effects based on instability. */
    triggerEffects() {
        if (Math.random() > 0.9 || this.instability > 80) {
            this.renderer.screenShake = Math.max(this.renderer.screenShake, this.instability * 0.1);
        }
    }
}
