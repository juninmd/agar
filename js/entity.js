import { Utils } from './utils.js';

export class Entity {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.markedForDeletion = false;
        this.isGlitching = false;
        this.firewallHitTimer = 0;
        // Calculate initial mass based on radius
        this.mass = Utils.getMassFromRadius(radius);
    }

    update() {
        // Base update logic
    }

    drawGlitch(ctx) {
        const numSlices = 5;
        const maxOffset = 5;

        for (let i = 0; i < numSlices; i++) {
            const sliceHeight = (this.radius * 2) / numSlices;
            const yPos = this.y - this.radius + (i * sliceHeight);
            const offsetX = (Math.random() - 0.5) * maxOffset;

            ctx.save();
            ctx.beginPath();
            // Draw a rect strip instead of precise circle slice for performance/style
            // Actually, clipping is better for circle shape
            ctx.rect(this.x - this.radius - maxOffset, yPos, (this.radius * 2) + maxOffset * 2, sliceHeight);
            ctx.clip();

            ctx.beginPath();
            ctx.arc(this.x + offsetX, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }

        // Random colored rectangles
        if (Math.random() > 0.7) {
            ctx.fillStyle = '#FFF';
            ctx.fillRect(
                this.x + (Math.random() - 0.5) * this.radius,
                this.y + (Math.random() - 0.5) * this.radius,
                Math.random() * 10,
                Math.random() * 5
            );
        }
    }

    draw(ctx) {
        if (this.isGlitching) {
            this.drawGlitch(ctx);
            // Draw name and other stuff on top usually handled by subclass
            return;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.closePath();

        // Reset shadow for performance if needed, but for now we keep the neon look
        ctx.shadowBlur = 0;
    }

    getBounds() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
}
