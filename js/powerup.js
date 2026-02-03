import { Food } from './food.js';

export class PowerUp extends Food {
    constructor(x, y, radius, color) {
        super(x, y, radius, color);
        this.pulse = 0;
        this.pulseSpeed = 0.1;
        this.originalRadius = radius;
        this.type = "CACHE";
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
        ctx.shadowBlur = 20 + Math.sin(this.pulse) * 10;

        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;

        // Diamond shape for Cache
        ctx.beginPath();
        ctx.moveTo(0, -this.radius * 1.5);
        ctx.lineTo(this.radius, 0);
        ctx.lineTo(0, this.radius * 1.5);
        ctx.lineTo(-this.radius, 0);
        ctx.closePath();
        ctx.fill();

        // Inner symbol
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.rotate(-this.angle); // Cancel rotation for text
        ctx.fillText("DATA", 0, 0);

        ctx.restore();
    }
}
