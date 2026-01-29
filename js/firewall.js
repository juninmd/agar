import { CONSTANTS } from './constants.js';

export class Firewall {
    constructor() {
        this.active = false;
        this.x = -1000;
        this.speed = 10;
        this.width = 200; // Visual width
        this.warningTimer = 0;
    }

    start() {
        this.active = true;
        this.x = -this.width;
        // Speed should be enough to outrun slow entities but not impossible
        // Player base speed is 5. Larger players are slower.
        // Firewall should be scary. Let's make it 8.
        this.speed = 8;
    }

    update() {
        if (!this.active) return;

        this.x += this.speed;

        // Deactivate when it passes the world
        if (this.x > CONSTANTS.WORLD_WIDTH + 500) {
            this.active = false;
        }
    }

    checkCollision(entity) {
        if (!this.active) return false;

        // The firewall "consumes" everything behind its leading edge (this.x)
        // We add a small buffer so it touches the visual edge
        // If the entity's rightmost point (x + radius) is less than this.x, it is fully engulfed.
        // Or if the entity touches the line?
        // Let's say if the center is passed.
        return (entity.x < this.x);
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();

        // Draw the wall (Gradient from transparent to red)
        const gradient = ctx.createLinearGradient(this.x - this.width, 0, this.x, 0);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
        gradient.addColorStop(0.2, 'rgba(255, 0, 0, 0.2)');
        gradient.addColorStop(0.8, 'rgba(255, 0, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0.9)');

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.width, 0, this.width, CONSTANTS.WORLD_HEIGHT);

        // Leading edge
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 30;

        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x, CONSTANTS.WORLD_HEIGHT);
        ctx.stroke();

        // Scanline effect inside the firewall
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        for (let i = 0; i < CONSTANTS.WORLD_HEIGHT; i += 20) {
            if (Math.random() > 0.5) {
                 ctx.fillRect(this.x - this.width, i, this.width, 2);
            }
        }

        ctx.restore();
    }
}
