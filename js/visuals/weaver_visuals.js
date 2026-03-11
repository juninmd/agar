/**
 * Visual effects and rendering logic for the Glitch Weaver boss.
 */
export class WeaverVisuals {
    /**
     * Renders the Weaver boss entity and its threads.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {Object} weaver - The weaver entity to draw.
     */
    static drawWeaver(ctx, weaver) {
        // Core
        ctx.beginPath();
        ctx.arc(weaver.x, weaver.y, weaver.radius, 0, Math.PI * 2);
        ctx.fillStyle = weaver.color;
        ctx.fill();

        // Web/Threads Ring
        ctx.save();
        ctx.translate(weaver.x, weaver.y);
        ctx.rotate(Date.now() / 1000);

        ctx.strokeStyle = 'rgba(138, 43, 226, 0.8)'; // Purple
        ctx.lineWidth = 2;
        ctx.beginPath();

        const points = 8;
        for (let i = 0; i < points; i++) {
            const angle = (Math.PI * 2 / points) * i;
            const px = Math.cos(angle) * weaver.radius * 1.5;
            const py = Math.sin(angle) * weaver.radius * 1.5;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Cross threads
        ctx.beginPath();
        for (let i = 0; i < points; i++) {
            const angle = (Math.PI * 2 / points) * i;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * weaver.radius * 1.5, Math.sin(angle) * weaver.radius * 1.5);
        }
        ctx.stroke();
        ctx.restore();

        // Inner Glitch Eye
        ctx.beginPath();
        ctx.arc(weaver.x, weaver.y, weaver.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Name
        ctx.fillStyle = '#8A2BE2';
        ctx.font = 'bold 20px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText("THE GLITCH WEAVER", weaver.x, weaver.y - weaver.radius * 1.6 - 10);
    }
}
