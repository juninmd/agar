/**
 * Particle System for visual effects.
 * Handles explosions, trails, and other temporary visual elements.
 */

import { Utils } from './utils.js';

export class Particle {
    constructor(x, y, color, speed, life) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        const angle = Math.random() * Math.PI * 2;
        this.velocity = {
            x: Math.cos(angle) * speed * Math.random(),
            y: Math.sin(angle) * speed * Math.random()
        };
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life--;
        this.size *= 0.95;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emitExplosion(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color, 5, 30));
        }
    }

    emitDash(x, y, color) {
        // Directional burst opposite to movement would be cool, but radial is easier for generic generic
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(x, y, color, 3, 20));
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}
