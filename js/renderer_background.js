import { CONSTANTS } from './constants.js';

export class RendererBackground {
    static drawGrid(ctx, gameState, camX, camY, width, height) {
        const time = Date.now();
        const integrity = gameState.systemIntegrity;
        const isPurge = gameState.purgeSystem && gameState.purgeSystem.isActive;
        const isCypher = gameState.player && gameState.player.protocol.id === 'CYPHER';

        let r = 0, g = 243, b = 255; // Default Cyan

        if (isPurge || integrity < 30) {
            r = 255; g = 0; b = 0; // Red Alert
        } else if (isCypher) {
            r = 255; g = 215; b = 0; // Gold
        }

        ctx.save();

        // Digital Void / Data Streams (Screen Space Background)
        this._drawDataStreams(ctx, camX, camY, width, height, r, g, b, time);

        // Grid (World Space)
        const pulse = Math.sin(time / 500) * 0.2 + 0.8;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.15 * pulse})`;
        ctx.lineWidth = 1;

        const gridSize = CONSTANTS.GRID_SIZE;
        const startX = Math.floor(-camX / gridSize) * gridSize;
        const endX = startX + width + gridSize;
        const startY = Math.floor(-camY / gridSize) * gridSize;
        const endY = startY + height + gridSize;

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
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT);

        ctx.restore();
    }

    static _drawDataStreams(ctx, camX, camY, width, height, r, g, b, time) {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.03)`;
        const streamSpacing = 150;

        // Screen Space Coordinates
        const screenLeft = -camX;
        const screenTop = -camY;

        // Calculate offset based on time
        const offset = (time * 0.05) % streamSpacing;

        for (let x = 0; x < width; x += streamSpacing) {
             const drawX = screenLeft + x + offset;
             // Random noise
             if (Math.sin(drawX * 0.01 + time * 0.002) > 0.5) {
                 ctx.fillRect(drawX, screenTop, 2, height);
             }
        }

        // Horizontal Scanline
        const scanY = (time * 0.2) % height;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.05)`;
        ctx.fillRect(screenLeft, screenTop + scanY, width, 50);
    }
}
