import { Entity } from './entity.js';
import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';

/**
 * Represents the player entity controlled by the user.
 * Handles movement, input, and specific visual effects like trails.
 */
export class Player extends Entity {
    /**
     * @param {number} x - Start X
     * @param {number} y - Start Y
     * @param {string} protocolId - The selected protocol (BASTION, PHANTOM, HACKER)
     * @param {string} [name] - Player name
     */
    constructor(x, y, protocolId, name) {
        const protocol = CONSTANTS.PROTOCOLS[protocolId] || CONSTANTS.PROTOCOLS.HACKER;
        const radius = CONSTANTS.INITIAL_RADIUS * Math.sqrt(protocol.massMultiplier);

        super(x, y, radius, protocol.color);

        this.protocol = protocol;
        this.name = name || "Unit 734";
        this.targetX = x;
        this.targetY = y;
        this.velocity = { x: 0, y: 0 };
        this.speedBoost = 1;
        this.trail = [];
    }

    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    dash() {
        // Dash cooldown or cost can be protocol dependent
        // For now, keep standard
        const minMass = Utils.getMassFromRadius(CONSTANTS.INITIAL_RADIUS);
        if (this.mass > minMass * 1.2) {
            this.mass *= 0.8;
            this.radius = Utils.getRadiusFromMass(this.mass);
            this.speedBoost = 3.0;
            return true;
        }
        return false;
    }

    update(worldWidth, worldHeight) {
        // Decay speed boost
        if (this.speedBoost > 1) {
            this.speedBoost *= 0.96;
            if (this.speedBoost < 1.05) this.speedBoost = 1;
            this.trail.push({ x: this.x, y: this.y, radius: this.radius, alpha: 0.6 });
        }

        // Update Trail
        for (let i = this.trail.length - 1; i >= 0; i--) {
            this.trail[i].alpha -= 0.05;
            this.trail[i].radius *= 0.95;
            if (this.trail[i].alpha <= 0) this.trail.splice(i, 1);
        }

        // Movement Logic
        const dist = Utils.getDistance(this.x, this.y, this.targetX, this.targetY);
        const speedDecay = Math.pow(CONSTANTS.INITIAL_RADIUS / this.radius, 0.4);

        // Apply Protocol Speed Multiplier
        const maxSpeed = CONSTANTS.PLAYER_SPEED_BASE * speedDecay * this.speedBoost * this.protocol.speedMultiplier;

        if (dist > 0) {
            if (dist < 5) {
                this.velocity.x = 0;
                this.velocity.y = 0;
            } else {
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                this.velocity.x = (dx / dist) * maxSpeed;
                this.velocity.y = (dy / dist) * maxSpeed;
            }
        }

        // Corruption / Glitch Logic
        const corruptionFactor = Math.max(0, (this.mass - 500) / 2000);
        if (corruptionFactor > 0 && this.speedBoost <= 1.2) {
            this.velocity.x += (Math.random() - 0.5) * corruptionFactor * 2;
            this.velocity.y += (Math.random() - 0.5) * corruptionFactor * 2;
            this.isGlitching = (Math.random() < corruptionFactor * 0.1);
        } else {
            this.isGlitching = false;
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
        // Draw Trail
        if (this.trail.length > 0) {
            ctx.save();
            this.trail.forEach(t => {
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = t.alpha * 0.5;
                ctx.fill();
            });
            ctx.restore();
        }

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
