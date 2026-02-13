import { CONSTANTS } from './constants.js';

export class RendererBackground {
    static drawGrid(ctx, camX, camY, canvasWidth, canvasHeight) {
        ctx.save();
        ctx.strokeStyle = '#00f3ff';
        ctx.globalAlpha = 0.1;
        ctx.lineWidth = 1;

        const gridSize = CONSTANTS.GRID_SIZE;
        // Calculate visible grid area
        // We need to cover the entire canvas, but grid lines are fixed in world space.
        // The camera transform is already applied? No, wait.
        // In Renderer.js: this.ctx.translate(this.camX + jitterX, ...);
        // So the context is transformed. We should draw from (0,0) to (WorldWidth, WorldHeight)?
        // No, drawing the whole world grid is inefficient.
        // We should draw only visible lines.

        // But if context is transformed, (0,0) is world (0,0).
        // The canvas viewport is at (-camX, -camY) relative to world origin.
        // So we draw from -camX to -camX + width.

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
        const maxR = player.radius * 10;
        const gradient = ctx.createRadialGradient(player.x, player.y, player.radius, player.x, player.y, maxR);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(player.x - maxR, player.y - maxR, maxR * 2, maxR * 2);

        // Warping lines
        ctx.beginPath();
        const time = Date.now() / 1000;
        for(let i=0; i<12; i++) {
            const angle = time + (i * Math.PI / 6);
            const r = player.radius * 2 + Math.sin(time * 5 + i) * 20;
            const x = player.x + Math.cos(angle) * r;
            const y = player.y + Math.sin(angle) * r;
            ctx.moveTo(player.x, player.y);
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}
