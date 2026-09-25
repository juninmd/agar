import { Utils } from '../utils.js';

export class TargetingVisuals {
    /**
     * Draws the diagnostic targeting overlay (closest bot brackets).
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} player
     * @param {Array} bots
     * @param {number} camX
     * @param {number} camY
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    static drawTargetingSystem(ctx, player, bots, camX, camY, canvasWidth, canvasHeight) {
        if (!player || bots.length === 0) return;

        let closestBot = null;
        let minDistance = Infinity;

        for (const bot of bots) {
            if (bot.markedForDeletion) continue;
            // Using Math.hypot directly to avoid external dependencies breaking
            const dist = Math.hypot(bot.x - player.x, bot.y - player.y);
            if (dist < minDistance) {
                minDistance = dist;
                closestBot = bot;
            }
        }

        if (closestBot && Utils.isInViewport(closestBot.x, closestBot.y, closestBot.radius, camX, camY, canvasWidth, canvasHeight)) {
            const time = performance.now();
            const pulse = (Math.sin(time / 200) + 1) / 2; // 0 to 1
            const br = closestBot.radius + 15 + (pulse * 5); // Brackets pulse outward slightly

            ctx.save();
            ctx.translate(closestBot.x, closestBot.y);

            // Draw futuristic cyan brackets with pulsating opacity
            ctx.globalAlpha = 0.5 + (pulse * 0.5);
            ctx.strokeStyle = '#00ffcc';
            ctx.lineWidth = 2 + (pulse * 1);
            ctx.shadowColor = '#00ffcc';
            ctx.shadowBlur = 10 + (pulse * 10);

            const len = 10 + (pulse * 5); // Bracket arms pulse in length

            // Top Left
            ctx.beginPath();
            ctx.moveTo(-br, -br + len);
            ctx.lineTo(-br, -br);
            ctx.lineTo(-br + len, -br);
            ctx.stroke();

            // Top Right
            ctx.beginPath();
            ctx.moveTo(br - len, -br);
            ctx.lineTo(br, -br);
            ctx.lineTo(br, -br + len);
            ctx.stroke();

            // Bottom Left
            ctx.beginPath();
            ctx.moveTo(-br, br - len);
            ctx.lineTo(-br, br);
            ctx.lineTo(-br + len, br);
            ctx.stroke();

            // Bottom Right
            ctx.beginPath();
            ctx.moveTo(br - len, br);
            ctx.lineTo(br, br);
            ctx.lineTo(br, br - len);
            ctx.stroke();

            ctx.restore();
        }
    }
}
