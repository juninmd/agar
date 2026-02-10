import { Food } from './food.js';

export class LoreFragment extends Food {
    constructor(x, y) {
        super(x, y, 12, '#FFD700'); // Gold color, slightly larger
        this.pulse = 0;
    }

    draw(ctx) {
        this.pulse += 0.05;
        const scale = 1 + Math.sin(this.pulse) * 0.1;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(scale, scale);
        ctx.rotate(this.angle); // Inherited from Food

        // Draw Cube (Square with border)
        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.fill();
        ctx.stroke();

        // Inner detail
        ctx.beginPath();
        ctx.rect(-this.radius * 0.5, -this.radius * 0.5, this.radius, this.radius);
        ctx.stroke();

        ctx.restore();
    }
}
