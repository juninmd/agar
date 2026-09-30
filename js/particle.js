/**
 * Represents a single visual particle in the particle system.
 * Handles its own lifecycle, movement, and rendering.
 */
export class Particle {
    constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.color = '#FFF';
        this.life = 0;
        this.maxLife = 0;
        this.velocity = { x: 0, y: 0 };
        this.size = 0;
        this.shape = 'circle';
        this.rotation = 0;
        this.rotationSpeed = 0;
    }

    /**
     * Initializes the particle with specific parameters for emission.
     * @param {number} x - The starting x coordinate.
     * @param {number} y - The starting y coordinate.
     * @param {string} color - The hex color code of the particle.
     * @param {number} speed - The initial speed of the particle.
     * @param {number} life - The lifespan in frames.
     * @param {number} sizeMultiplier - Multiplier for the particle's size.
     */
    init(x, y, color, speed, life, sizeMultiplier = 1) {
        this.active = true;
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        const angle = Math.random() * Math.PI * 2;
        this.velocity.x = Math.cos(angle) * speed * Math.random();
        this.velocity.y = Math.sin(angle) * speed * Math.random();
        this.size = (Math.random() * 3 + 1) * sizeMultiplier;
        this.shape = Math.random() > 0.6 ? 'square' : (Math.random() > 0.5 ? 'line' : 'circle');
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    }

    /**
     * Updates the particle's position, rotation, and lifecycle.
     */
    update() {
        if (!this.active) return;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life--;
        this.size *= 0.95;
        this.rotation += this.rotationSpeed;
    }

    /**
     * Draws the particle on the given canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        if (this.shape === 'square') {
            ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.fill();
        } else if (this.shape === 'triangle') {
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size * 0.866, this.size * 0.5); // 0.866 is approx sin(60)
            ctx.lineTo(-this.size * 0.866, this.size * 0.5);
            ctx.closePath();
            ctx.fill();
        } else if (this.shape === 'line') {
            ctx.moveTo(-this.size, 0);
            ctx.lineTo(this.size, 0);
            ctx.lineWidth = Math.max(1, this.size / 2);
            ctx.stroke();
        } else {
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
