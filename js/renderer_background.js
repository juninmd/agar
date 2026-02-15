import { CONSTANTS } from './constants.js';

export class RendererBackground {
    static drawGrid(ctx, camX, camY, canvasWidth, canvasHeight) {
        ctx.save();
        ctx.strokeStyle = '#00f3ff';
        ctx.globalAlpha = 0.1;
        ctx.lineWidth = 1;

        const gridSize = CONSTANTS.GRID_SIZE;

        // Calculate visible grid area optimization
        const startX = Math.floor(-camX / gridSize) * gridSize;
        const endX = startX + canvasWidth + gridSize;
        const startY = Math.floor(-camY / gridSize) * gridSize;
        const endY = startY + canvasHeight + gridSize;

        ctx.beginPath();
        for (let x = startX; x < endX; x += gridSize) {
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
        }
        for (let y = startY; y < endY; y += gridSize) {
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
        }
        ctx.stroke();

        // World Borders
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 5;
        ctx.globalAlpha = 0.5;
        ctx.strokeRect(0, 0, CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT);
        ctx.restore();
    }

    static drawSingularity(ctx, player) {
        ctx.save();
        const time = Date.now() / 1000;
        const x = player.x;
        const y = player.y;
        // Visual radius is larger than physical collider
        const radius = player.radius * 1.5;

        // 1. Accretion Disk (Swirling Lines)
        const diskRadius = radius * 6;
        ctx.lineWidth = 2;

        // Draw multiple spiral arms
        for (let i = 0; i < 12; i++) {
            const angleOffset = (Math.PI * 2 / 12) * i - time * 2; // Rotate counter-clockwise

            ctx.beginPath();
            // Color gradient from purple to transparent
            const hue = 280 + Math.sin(time + i) * 20;
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
        ctx.fillStyle = '#000000';
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
