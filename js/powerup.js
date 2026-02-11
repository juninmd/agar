import { Food } from './food.js';
import { CONSTANTS } from './constants.js';

export class PowerUp extends Food {
    constructor(x, y, typeKey) {
        const type = CONSTANTS.POWERUP_TYPES[typeKey] || CONSTANTS.POWERUP_TYPES.MASS;
        super(x, y, CONSTANTS.POWERUP.RADIUS, type.color);
        this.pulse = 0;
        this.pulseSpeed = 0.1;
        this.originalRadius = CONSTANTS.POWERUP.RADIUS;
        this.powerUpType = type; // Store the full type object
        this.typeKey = typeKey; // Store the key (MASS, SPEED, SHIELD)
    }

    update() {
        super.update();
        this.pulse += this.pulseSpeed;
        // Pulse size
        this.radius = this.originalRadius + Math.sin(this.pulse) * 2;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15 + Math.sin(this.pulse) * 10;

        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;

        // Diamond shape for Cache
        ctx.beginPath();
        ctx.moveTo(0, -this.radius * 1.3);
        ctx.lineTo(this.radius * 1.3, 0);
        ctx.lineTo(0, this.radius * 1.3);
        ctx.lineTo(-this.radius * 1.3, 0);
        ctx.closePath();
        ctx.fill();

        // Inner symbol
        ctx.fillStyle = '#000'; // Black text for better contrast on neon colors
        ctx.font = 'bold 9px "Courier New"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.rotate(-this.angle); // Cancel rotation for text
        ctx.fillText(this.powerUpType.symbol, 0, 0);

        ctx.restore();
    }
}
