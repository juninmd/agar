/**
 * Visual effects and rendering logic for the Null Void Titan raid boss.
 */
export class TitanVisuals {
    /**
     * Renders the Titan boss entity and its black hole effect.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {Object} titan - The titan entity to draw.
     */
    static drawTitan(ctx, titan) {
        // Dark Matter Core (Black Hole Effect)
        ctx.beginPath();
        ctx.arc(titan.x, titan.y, titan.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();

        // Event Horizon (Purple Pulse)
        ctx.shadowBlur = 50 + Math.sin(Date.now() / 500) * 20;
        ctx.shadowColor = '#9D00FF';
        ctx.strokeStyle = '#9D00FF';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Gravity Waves
        const waveCount = 3;
        const time = Date.now() / 1000;
        for(let i=0; i<waveCount; i++) {
             const waveRadius = titan.radius * (1.2 + (Math.sin(time + i) * 0.1));
             ctx.beginPath();
             ctx.arc(titan.x, titan.y, waveRadius, 0, Math.PI * 2);
             ctx.strokeStyle = `rgba(157, 0, 255, ${0.3 - (i * 0.1)})`;
             ctx.stroke();
        }

        // Name
        ctx.fillStyle = '#9D00FF';
        ctx.font = 'bold 24px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText("NULL VOID TITAN", titan.x, titan.y - titan.radius - 30);
    }
}
