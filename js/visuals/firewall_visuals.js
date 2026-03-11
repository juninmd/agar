import { CONSTANTS } from '../constants.js';

/**
 * Visual effects and rendering logic for the Great Firewall boss encounter.
 */
export class FirewallVisuals {
    /**
     * Renders the Great Firewall and its core nodes on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {Object} firewall - The firewall entity to draw.
     */
    static drawGreatFirewall(ctx, firewall) {
        const WORLD_HEIGHT = CONSTANTS.WORLD_HEIGHT;

        ctx.save();

        // Draw the sweeping laser beam (the wall itself)
        const wallAlpha = 0.4 + Math.sin(Date.now() / 200) * 0.2;
        ctx.fillStyle = `rgba(255, 69, 0, ${wallAlpha})`;
        ctx.fillRect(firewall.x - firewall.width / 2, 0, firewall.width, WORLD_HEIGHT);

        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(firewall.x, 0);
        ctx.lineTo(firewall.x, WORLD_HEIGHT);
        ctx.stroke();

        // Draw active nodes
        firewall.nodes.forEach(node => {
            if (!node.active) return;

            ctx.beginPath();
            ctx.arc(firewall.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();

            // Core pulsing
            const pulse = 1 + Math.sin(Date.now() / 150 + node.y) * 0.2;
            ctx.beginPath();
            ctx.arc(firewall.x, node.y, node.radius * 0.5 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            // Name tag
            ctx.fillStyle = '#FFF';
            ctx.font = '14px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText("CORE NODE", firewall.x, node.y - node.radius - 10);
        });

        ctx.restore();
    }
}
