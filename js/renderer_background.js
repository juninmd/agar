import { CONSTANTS } from './constants.js';
import { RendererStreams } from './renderer_streams.js';

export class RendererBackground {
    static drawGrid(ctx, gameState, camX, camY, width, height) {
        const time = Date.now();
        const integrity = gameState.systemIntegrity;
        const isPurge = gameState.purgeSystem && gameState.purgeSystem.isActive;
        const isCypher = gameState.player && gameState.player.protocol.id === 'CYPHER';
        const isWeaverActive = gameState.weaverSystem && gameState.weaverSystem.isActive;

        let r = 0, g = 243, b = 255; // Default Cyan

        if (isPurge || integrity < 30) {
            r = 255; g = 0; b = 0; // Red Alert
        } else if (isWeaverActive) {
            r = 138; g = 43; b = 226; // BlueViolet / Purple
        } else if (isCypher) {
            r = 255; g = 215; b = 0; // Gold
        }

        ctx.save();

        // Digital Void / Data Streams (Screen Space Background)
        RendererStreams.draw(ctx, camX, camY, width, height, r, g, b, time);

        // Grid (Parallax Space)
        const pulse = Math.sin(time / 500) * 0.2 + 0.8;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.15 * pulse})`;
        ctx.lineWidth = 1;

        const gridSize = CONSTANTS.GRID_SIZE;
        // Apply a fractional multiplier (e.g., 0.5) to camX/Y for the parallax effect
        const parallaxFactor = 0.5;
        const parallaxX = -camX * parallaxFactor;
        const parallaxY = -camY * parallaxFactor;

        // The grid must cover the entire viewport, so start from the screen edges
        const screenLeft = -camX;
        const screenTop = -camY;

        // Offset the start positions by the parallax offset modulo gridSize
        const startX = screenLeft - (parallaxX % gridSize) - gridSize;
        const endX = screenLeft + width + gridSize;
        const startY = screenTop - (parallaxY % gridSize) - gridSize;
        const endY = screenTop + height + gridSize;

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

                // Draw Abyss Zones
        if (gameState.abyssSystem && gameState.abyssSystem.zones) {
            gameState.abyssSystem.zones.forEach(zone => {
                const alpha = zone.getAlpha();
                if (alpha > 0) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(10, 10, 10, ${alpha * 0.8})`;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(zone.x, zone.y, zone.radius * 0.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                    ctx.fill();

                    // Add some noise/flicker effect
                    if (Math.random() < 0.1) {
                         ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.1})`;
                         ctx.fillRect(zone.x + Math.random() * zone.radius - zone.radius*0.5,
                                      zone.y + Math.random() * zone.radius - zone.radius*0.5,
                                      10, 2);
                    }
                    ctx.restore();
                }
            });
        }
ctx.restore();
    }
}
