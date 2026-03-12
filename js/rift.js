import { Entity } from './entity.js';
import { CONSTANTS } from './constants.js';

/**
 * Represents a Quantum Rift (Wormhole) that teleports entities across the map.
 * Inherits from Entity to participate in the game loop and rendering.
 */
export class Rift extends Entity {
    /**
     * Initializes a new Rift at random coordinates within the world bounds.
     */
    constructor() {
        const x = Math.random() * CONSTANTS.WORLD_WIDTH;
        const y = Math.random() * CONSTANTS.WORLD_HEIGHT;
        const radius = 60;
        const color = '#00FFFF'; // Neon Cyan

        super(x, y, radius, color);

        // Custom property to distinguish rifts from bots/players
        this.type = 'RIFT';

        // Rifts don't move, but they might spin visually, which will be handled in visual_effects or their draw method
        this.rotation = 0;
    }

    /**
     * Update loop for the Rift.
     */
    update() {
        super.update();
        // Increment rotation for visual effect
        this.rotation += 0.02;
    }
}
