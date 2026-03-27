import { Rift } from './rift.js';
import { RiftVisuals } from './visuals/rift_visuals.js';

/**
 * Manages the lifecycle, spawning, and despawning of `Rift` entities (Quantum Wormholes).
 */
export class RiftSystem {
    /**
     * @param {Object} game - Reference to the main game instance.
     */
    constructor(game) {
        this.game = game;
        this.rifts = [];
        this.maxRifts = 3;
        this.isActive = false; // Flag for active storm
        this.spawnTimer = 0;
        this.spawnInterval = 500; // Time ticks before spawning another if under max
    }

    /**
     * Updates all existing rifts and randomly spawns new ones.
     */
    update() {
        this.spawnTimer++;

        // Randomly attempt to spawn a Rift if below max limit
        if (this.rifts.length < this.maxRifts && this.spawnTimer > this.spawnInterval) {
            this.spawnTimer = 0;
            // 5% chance to trigger a global Rift Storm instead of a single spawn
            if (Math.random() < 0.05 && !this.isActive) {
                this.triggerRiftStorm();
            } else {
                this.spawnRift();
            }
        }

        // Global pull effect if rifts exist
        if (this.rifts.length > 0) {
            const entities = [];
            if (this.game.player) entities.push(this.game.player);
            if (this.game.bots) entities.push(...this.game.bots);
            if (this.game.foods) entities.push(...this.game.foods);

            entities.forEach(entity => {
                if (!entity || entity.markedForDeletion) return;

                // Find nearest rift
                let nearestRift = null;
                let minDist = Infinity;
                this.rifts.forEach(rift => {
                    if (rift.markedForDeletion) return;
                    // Fix: Math.hypot instead of Math.distance
                    const dist = Math.hypot(entity.x - rift.x, entity.y - rift.y);
                    if (dist < minDist) {
                        minDist = dist;
                        nearestRift = rift;
                    }
                });

                // Pull entities within range based on event state
                const pullRange = this.isActive ? 1500 : 500; // Stronger range during storms
                if (nearestRift && minDist < pullRange && minDist > nearestRift.radius * 0.5) {
                    const pullStrength = this.isActive ? (500 / minDist) : (200 / minDist);
                    const angle = Math.atan2(nearestRift.y - entity.y, nearestRift.x - entity.x);
                    entity.x += Math.cos(angle) * pullStrength;
                    entity.y += Math.sin(angle) * pullStrength;
                }
            });
        }

        // Deactivate storm if no rifts left
        if (this.isActive && this.rifts.length === 0) {
            this.isActive = false;
        }

        // Update active Rifts (for visual rotation/logic)
        this.rifts.forEach(rift => rift.update());

        // Remove marked rifts
        this.rifts = this.rifts.filter(r => !r.markedForDeletion);
    }

    /**
     * Creates and adds a new Rift to the array.
     */
    spawnRift() {
        const newRift = new Rift();
        this.rifts.push(newRift);
    }

    /**
     * Triggers a global Rift Storm.
     */
    triggerRiftStorm() {
        this.isActive = true;
        if (this.game.ui && this.game.ui.showNarrative) {
            this.game.ui.showNarrative("WARNING: QUANTUM RIFT STORM DETECTED. SEVERE SPATIAL ANOMALY.", "warning");
        }

        // Maximize rifts
        const needed = this.maxRifts - this.rifts.length;
        for (let i = 0; i < needed; i++) {
            this.spawnRift();
        }
    }

    /**
     * Resets the RiftSystem state, clearing active rifts.
     */
    reset() {
        this.rifts = [];
        this.spawnTimer = 0;
        this.isActive = false;
    }

    /**
     * Renders all active rifts to the canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        this.rifts.forEach(rift => {
            RiftVisuals.drawRift(ctx, rift);
        });
    }
}