/**
 * Handles rendering the visuals for Quantum Rifts (Portals).
 */
export class RiftVisuals {
    /**
     * Draws the spinning portal effect.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Rift} rift
     */
    static drawRift(ctx, rift) {
        ctx.save();
        ctx.translate(rift.x, rift.y);
        ctx.rotate(rift.rotation);

        const r = rift.radius;
        const innerRadius = r * 0.4;

        // Inner void core
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#050505'; // very dark background
        ctx.fill();

        // Neon Glow Setup
        ctx.shadowColor = rift.color;
        ctx.shadowBlur = 30;
        ctx.lineWidth = 4;
        ctx.strokeStyle = rift.color;

        // Outer swirling energy rings
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 1.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, r * 0.8, Math.PI * 0.5, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Particle/data fragments orbiting
        const numParticles = 6;
        for (let i = 0; i < numParticles; i++) {
            const angle = (Math.PI * 2 / numParticles) * i + rift.rotation * 2;
            const orbitDist = r * 0.6;
            const px = Math.cos(angle) * orbitDist;
            const py = Math.sin(angle) * orbitDist;

            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        }

        ctx.restore();
    }
}
