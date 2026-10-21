import { CONSTANTS } from './constants.js';

/** Matrix-rain data streams drawn behind the grid. */
export class RendererStreams {
    static draw(ctx, camX, camY, width, height, r, g, b, time) {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
        const streamSpacing = 150;

        // Screen Space Coordinates
        const screenLeft = -camX;
        const screenTop = -camY;

        // Calculate offset based on time
        const offset = (time * 0.05) % streamSpacing;

        // Matrix Rain Vertical Drops
        for (let x = 0; x < width; x += streamSpacing) {
             const drawX = screenLeft + x + offset;
             const speed = 0.1 + ((x % 3) * 0.05); // Varying fall speeds
             const dropLength = 100 + ((x % 5) * 50); // Varying line lengths
             const fallOffset = (time * speed) % (height + dropLength);
             const drawY = screenTop + fallOffset - dropLength;

             ctx.fillRect(drawX, drawY, 2, dropLength);

             // Glowing head of the stream
             ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
             ctx.fillRect(drawX, drawY + dropLength - 10, 2, 10);
             ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
        }

        // Horizontal Scanline
        const scanY = (time * 0.2) % height;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.08)`;
        ctx.fillRect(screenLeft, screenTop + scanY, width, 100);

        // Fractal Zones (Phase 6)
        // If the color implies Eclipse (cyan/dark theme) or random conditions
        // Let's draw some fractal triangles drifting
        if (r === 0 && g === 243 && b === 255) { // Default color, Eclipse uses default grid mostly
             ctx.strokeStyle = `rgba(0, 255, 255, 0.1)`;
             ctx.lineWidth = 1;
             for (let i = 0; i < 5; i++) {
                 const t = time * 0.001 + i * 100;
                 const fx = screenLeft + ((Math.sin(t) + 1) * 0.5 * width);
                 const fy = screenTop + ((Math.cos(t * 0.8) + 1) * 0.5 * height);
                 const size = 50 + Math.sin(t * 2) * 20;

                 ctx.beginPath();
                 ctx.moveTo(fx, fy - size);
                 ctx.lineTo(fx + size * 0.866, fy + size * 0.5);
                 ctx.lineTo(fx - size * 0.866, fy + size * 0.5);
                 ctx.closePath();
                 ctx.stroke();

                 // Inner fractal
                 ctx.beginPath();
                 ctx.moveTo(fx, fy + size * 0.5);
                 ctx.lineTo(fx + size * 0.433, fy - size * 0.25);
                 ctx.lineTo(fx - size * 0.433, fy - size * 0.25);
                 ctx.closePath();
                 ctx.stroke();
             }
        }
    }
}
