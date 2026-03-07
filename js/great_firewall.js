import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';
import { VisualEffects } from './visual_effects.js';

/**
 * Represents the Great Firewall boss encounter.
 * A horizontally sweeping barrier with vertically stacked core nodes that the player can consume.
 */
export class GreatFirewall {
    /**
     * Initializes the Great Firewall and spawns its core nodes.
     */
    constructor() {
        this.x = 0;
        this.speed = 10;
        this.direction = 1;
        this.width = 120; // visual and interaction width
        this.nodes = [];
        this.markedForDeletion = false;

        // Spawn vertical nodes
        const nodeCount = 10;
        const spacing = CONSTANTS.WORLD_HEIGHT / nodeCount;
        for (let i = 0; i < nodeCount; i++) {
            const y = (i * spacing) + (spacing / 2);
            this.nodes.push({
                y: y,
                mass: 1500,
                radius: 80, // Substantial nodes
                active: true,
                color: '#FF4500' // Orange-red
            });
        }
    }

    /**
     * Updates the Great Firewall's position and checks for collisions.
     * @param {Object} game - The main game instance.
     */
    update(game) {
        if (this.markedForDeletion) return;

        // Move the firewall
        this.x += this.speed * this.direction;

        // Reverse at edges
        if (this.x < 0) {
            this.x = 0;
            this.direction = 1;
        } else if (this.x > CONSTANTS.WORLD_WIDTH) {
            this.x = CONSTANTS.WORLD_WIDTH;
            this.direction = -1;
        }

        // Check collision with player
        this._checkCollisions(game.player, game);

        // Check if all nodes are destroyed
        if (this.nodes.every(n => !n.active)) {
            this.markedForDeletion = true;
        }
    }

    /**
     * Checks for collisions between the player and the firewall's core nodes.
     * @param {Object} player - The player entity.
     * @param {Object} game - The main game instance.
     */
    _checkCollisions(player, game) {
        if (player.markedForDeletion) return;

        // Fast check: is player near the X coordinate?
        if (Math.abs(player.x - this.x) > player.radius + (this.width / 2)) return;

        this.nodes.forEach(node => {
            if (!node.active) return;

            const dist = Utils.getDistance(player.x, player.y, this.x, node.y);
            const combinedRadius = player.radius + node.radius;

            if (dist < combinedRadius) {
                // Collision with a node
                if (player.mass > node.mass) {
                    // Player consumes the node
                    node.active = false;
                    player.grow(node.mass);
                    game.ui.showNarrative("FIREWALL NODE DESTROYED", "SUCCESS");

                    // Visual explosion
                    for (let i = 0; i < 20; i++) {
                         game.particleSystem.emitExplosion(this.x, node.y, node.color);
                    }
                } else {
                    // Player takes damage or pushed back
                    player.mass = Math.max(10, player.mass - 10); // constant drain
                    player.radius = Utils.getRadiusFromMass(player.mass);

                    // Push player away slightly
                    player.x -= this.direction * 10;

                    // Glitch effect on player
                    player.isGlitching = true;
                    setTimeout(() => player.isGlitching = false, 200);
                }
            }
        });
    }

    /**
     * Renders the Great Firewall and its core nodes on the canvas via VisualEffects.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.markedForDeletion) return;

        VisualEffects.drawGreatFirewall(ctx, this);
    }
}
