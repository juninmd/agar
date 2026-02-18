export class SingularityVisuals {
    static drawSingularity(ctx, player) {
        ctx.save();
        const time = Date.now() / 1000;
        const x = player.x;
        const y = player.y;
        // Visual radius is larger than physical collider
        const radius = player.radius * 1.5;

        const instability = player.instability || 0;
        const pulseSpeed = 1 + (instability / 20);

        // 1. Accretion Disk (Swirling Lines)
        const diskRadius = radius * 6;
        ctx.lineWidth = 2;

        // Draw multiple spiral arms
        for (let i = 0; i < 12; i++) {
            const angleOffset = (Math.PI * 2 / 12) * i - time * (2 * pulseSpeed); // Rotate counter-clockwise

            ctx.beginPath();
            // Color gradient from purple (280) to red (0) based on instability
            const baseHue = 280 * (1 - instability / 100);
            const hue = baseHue + Math.sin(time * pulseSpeed + i) * 20;
            ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.4)`;

            for (let r = radius; r < diskRadius; r += 20) {
                // Logarithmic spiral equation approximation
                const angle = angleOffset + Math.log(r/radius) * 4;
                const px = x + Math.cos(angle) * r;
                const py = y + Math.sin(angle) * r;

                if (r === radius) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }

        // 2. Photon Ring (Glowing Rim)
        const glow = ctx.createRadialGradient(x, y, radius * 0.9, x, y, radius * 1.2);
        glow.addColorStop(0, 'rgba(0, 0, 0, 0)');
        glow.addColorStop(0.5, 'rgba(255, 0, 255, 0.8)'); // Intense Purple/Pink
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 3. Event Horizon (The Void)
        const coreLightness = instability; // 0 to 100
        ctx.fillStyle = `hsl(0, 0%, ${coreLightness}%)`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner rim (white hot)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();

        // 4. Instability (Glitch effect on the core)
        if (Math.random() > 0.95) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            const glitchR = radius * (0.8 + Math.random() * 0.4);
            ctx.beginPath();
            ctx.arc(x, y, glitchR, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
