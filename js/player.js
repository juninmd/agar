import { Entity } from './entity.js';
import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';

export class Player extends Entity {
    constructor(x, y, radius, color, name) {
        super(x, y, radius, color);
        this.name = name || "Unit 734";
        this.targetX = x;
        this.targetY = y;
        this.velocity = { x: 0, y: 0 };
    }

    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    update(worldWidth, worldHeight) {
        // Calculate distance to target
        const dist = Utils.getDistance(this.x, this.y, this.targetX, this.targetY);

        // Speed calculation based on size (bigger = slower)
        // Decaying speed but with a minimum limit so you don't stop completely
        const speedDecay = Math.pow(CONSTANTS.INITIAL_RADIUS / this.radius, 0.4);
        const maxSpeed = CONSTANTS.PLAYER_SPEED_BASE * speedDecay;

        if (dist > 0) {
            // Move towards target
            // If close enough, just snap? No, smooth movement.
            // But if mouse is close to center, we don't want jitter.
            if (dist < 5) {
                this.velocity.x = 0;
                this.velocity.y = 0;
            } else {
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;

                // Normalize
                this.velocity.x = (dx / dist) * maxSpeed;
                this.velocity.y = (dy / dist) * maxSpeed;
            }
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.checkBounds(worldWidth, worldHeight);
    }

    checkBounds(width, height) {
        this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
    }

    grow(amount) {
        this.mass += amount;
        this.radius = Utils.getRadiusFromMass(this.mass);
    }

    draw(ctx) {
        super.draw(ctx);

        // Draw Name
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${Math.max(12, this.radius / 2)}px 'Orbitron'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.x, this.y);

        // Draw decorative ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 5, 0, Math.PI * 2);
        ctx.stroke();
    }
}
