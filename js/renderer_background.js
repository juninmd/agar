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
}
