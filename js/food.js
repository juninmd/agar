import { Entity } from './entity.js';
import { Utils } from './utils.js';

export class Food extends Entity {
    constructor(x, y, radius, color) {
        super(x, y, radius, color);
        // Random rotation for visual variety
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = Utils.randomRange(-0.02, 0.02);
        this.shape = Math.random() > 0.5 ? 'square' : 'hex';
    }

    update() {
        this.angle += this.rotationSpeed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        if (this.shape === 'square') {
            ctx.rect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        } else {
            // Hexagon
            for (let i = 0; i < 6; i++) {
                ctx.lineTo(this.radius * Math.cos(i * Math.PI / 3), this.radius * Math.sin(i * Math.PI / 3));
            }
        }
        ctx.fill();
        ctx.restore();
    }
}
