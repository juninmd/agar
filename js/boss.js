import { Bot } from './bot.js';
import { AIBoss } from './ai_boss.js';
import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';

/**
 * Represents the Sentinel Boss entity.
 * Extends Bot to inherit basic entity properties, but uses AIBoss for logic.
 */
export class Boss extends Bot {
    /**
     * Creates a new Boss instance.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     */
    constructor(x, y) {
        // Pass dummy arguments for super, we override props immediately
        super(x, y, 100, CONSTANTS.BOT_TYPES.SENTINEL.color, 'SENTINEL');

        this.type = 'SENTINEL';
        this.color = CONSTANTS.BOT_TYPES.SENTINEL.color;
        this.mass = 5000;
        this.radius = Utils.getRadiusFromMass(this.mass);
        this.aiState = 'IDLE';
        this.stateTimer = 0;
        this.shields = 3;
        this.shieldRotation = 0;
        this.targetX = x;
        this.targetY = y;
        this.velocity = { x: 0, y: 0 };
    }

    /**
     * Updates the boss state.
     * @param {number} worldWidth
     * @param {number} worldHeight
     * @param {Entity[]} entities
     * @param {Food[]} foods
     */
    update(worldWidth, worldHeight, entities, foods) {
        const player = entities.find(e => e.constructor.name === 'Player');

        if (player) {
            AIBoss.think(this, player);
        }

        // Apply movement
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const speed = this.getSpeed();

        if (dist > 5) {
             this.velocity.x = (dx / dist) * speed;
             this.velocity.y = (dy / dist) * speed;
        } else {
             this.velocity.x = 0;
             this.velocity.y = 0;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.checkBounds(worldWidth, worldHeight);

        // Update visuals
        this.shieldRotation += 0.05;
        this.radius = Utils.getRadiusFromMass(this.mass); // Ensure radius syncs with mass
    }

    /**
     * Calculates current speed based on AI state.
     * @returns {number} Speed in pixels per frame.
     */
    getSpeed() {
        let base = 2.0;
        if (this.aiState === 'CHASE') base = 3.5;
        if (this.aiState === 'CHARGE') base = 8.0;
        return base;
    }
}
