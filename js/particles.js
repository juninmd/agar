/**
 * Particle System for visual effects.
 * Handles explosions, trails, and other temporary visual elements.
 */

import { Utils } from './utils.js';

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

    update() {
        if (!this.active) return;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life--;
        this.size *= 0.95;
        this.rotation += this.rotationSpeed;
    }

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

export class ParticleSystem {
    constructor(poolSize = 2000) {
        this.pool = Array(poolSize).fill().map(() => new Particle());
        this.activeParticles = [];
    }

    _getParticle() {
        for (let i = 0; i < this.pool.length; i++) {
            if (!this.pool[i].active) {
                return this.pool[i];
            }
        }
        // If pool is full, just overwrite the first one (oldest) to avoid allocations
        const p = this.pool[0];
        p.active = false;
        return p;
    }

    emitExplosion(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            const p = this._getParticle();
            p.init(x, y, color, 5, 30);
            if (!this.activeParticles.includes(p)) this.activeParticles.push(p);
        }
    }

    emitDash(x, y, color) {
        for (let i = 0; i < 10; i++) {
            const p = this._getParticle();
            p.init(x, y, color, 3, 20);
            if (!this.activeParticles.includes(p)) this.activeParticles.push(p);
        }
    }

    emit(x, y, color, count, speed, size, life) {
        for (let i = 0; i < count; i++) {
            const p = this._getParticle();
            const sizeMultiplier = size ? (0.5 + Math.random()) * size / 2 : 1;
            p.init(x, y, color, speed, life, sizeMultiplier);
            if (!this.activeParticles.includes(p)) this.activeParticles.push(p);
        }
    }

    update() {
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const p = this.activeParticles[i];
            p.update();
            if (p.life <= 0) {
                p.active = false;
                // Swap with last element and pop to avoid O(N) splice
                const last = this.activeParticles[this.activeParticles.length - 1];
                this.activeParticles[i] = last;
                this.activeParticles.pop();
            }
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.activeParticles.length; i++) {
            this.activeParticles[i].draw(ctx);
        }
    }
}
