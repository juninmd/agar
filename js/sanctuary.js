import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';

export class Sanctuary {
    /**
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} radius - Radius of the sanctuary zone.
     */
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.pulse = 0;
        this.active = true;
    }

    /**
     * Draws the sanctuary zone.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.active) return;

        this.pulse += 0.05;
        const pulseScale = 1 + Math.sin(this.pulse) * 0.05;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(pulseScale, pulseScale);

        // Shield Dome
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.stroke();

        // Simple Grid Pattern inside (Hexagon-like feel)
        ctx.clip();
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        const gridSize = 50;

        // Vertical lines
        for (let i = -this.radius; i < this.radius; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, -this.radius);
            ctx.lineTo(i, this.radius);
            ctx.stroke();
        }

        // Horizontal lines
        for (let i = -this.radius; i < this.radius; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(-this.radius, i);
            ctx.lineTo(this.radius, i);
            ctx.stroke();
        }

        ctx.restore();
    }

    /**
     * Checks if an entity is inside the sanctuary.
     * @param {Entity} entity
     * @returns {boolean}
     */
    checkCollision(entity) {
        if (!this.active) return false;
        const dist = Utils.getDistance(this.x, this.y, entity.x, entity.y);
        // Consider inside if the center is within the radius
        return dist < this.radius;
    }
}
