/**
 * Particle System for visual effects.
 * Handles explosions, trails, and other temporary visual elements.
 */

import { Particle } from './particle.js';

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

    emitDash(x, y, color, vx = 0, vy = 0) {
        // Calculate the opposite direction of the player's movement
        const speed = Math.hypot(vx, vy);
        let nx = speed > 0 ? -vx / speed : Math.cos(Math.random() * Math.PI * 2);
        let ny = speed > 0 ? -vy / speed : Math.sin(Math.random() * Math.PI * 2);

        // Emit a richer burst of cyberpunk-colored particles
        const dashColors = [color, '#00ffcc', '#ff00ff', '#ffffff'];
        const numParticles = 25;

        for (let i = 0; i < numParticles; i++) {
            const p = this._getParticle();

            // Random spread angle (cone opposite to movement)
            const spread = (Math.random() - 0.5) * Math.PI;
            const angle = Math.atan2(ny, nx) + spread;

            // Randomly pick a color from the cyberpunk palette
            const pColor = dashColors[Math.floor(Math.random() * dashColors.length)];

            p.init(x, y, pColor, Math.random() * 5 + 2, Math.random() * 15 + 15, Math.random() * 1.5 + 0.5);

            // Override init velocity to point in the cone direction
            const pSpeed = Math.random() * 6 + 2;
            p.velocity.x = Math.cos(angle) * pSpeed;
            p.velocity.y = Math.sin(angle) * pSpeed;

            // Vary shapes for a glitched/cyberpunk look
            p.shape = Math.random() > 0.5 ? 'square' : 'line';

            if (!this.activeParticles.includes(p)) this.activeParticles.push(p);
        }
    }

    emitGlitchEffect(x, y, color, count = 30) {
        for (let i = 0; i < count; i++) {
            const p = this._getParticle();
            // High speed, short life, square shape for glitch effect
            p.init(x, y, color, 8, 15, 2);
            p.shape = 'square';
            p.rotationSpeed = (Math.random() - 0.5) * 1.5; // fast spin
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
        // Grouping particles isn't highly beneficial since each has its own translate/rotate/alpha.
        // We will just iterate and draw to keep it clean.
        for (let i = 0; i < this.activeParticles.length; i++) {
            this.activeParticles[i].draw(ctx);
        }
    }
}
