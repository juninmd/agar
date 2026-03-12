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
        this.spawnTimer = 0;
        this.spawnInterval = 500; // Time ticks before spawning another if under max
    }

    /**
     * Updates all existing rifts and randomly spawns new ones.
     * @param {Object} game
     */
    update() {
        this.spawnTimer++;

        // Randomly attempt to spawn a Rift if below max limit
        if (this.rifts.length < this.maxRifts && this.spawnTimer > this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnRift();
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
        // Maybe trigger a warning/popup from UI for the first time
    }

    /**
     * Resets the RiftSystem state, clearing active rifts.
     */
    reset() {
        this.rifts = [];
        this.spawnTimer = 0;
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
