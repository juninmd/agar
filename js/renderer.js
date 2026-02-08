import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';

/**
 * Handles all canvas rendering operations.
 */
export class Renderer {
    /**
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {CanvasRenderingContext2D} ctx - The 2D context.
     */
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.screenShake = 0;
        this.camX = 0;
        this.camY = 0;
    }

    /**
     * Clear the canvas and prepare for drawing.
     */
    clear() {
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Set camera position based on player.
     * @param {Player} player - The player entity.
     */
    updateCamera(player) {
        this.camX = this.canvas.width / 2 - player.x;
        this.camY = this.canvas.height / 2 - player.y;
    }

    /**
     * Apply screen shake and camera transform.
     * @param {number} systemIntegrity - Current integrity (0-100).
     */
    applyTransform(systemIntegrity) {
        this.ctx.save();

        let jitterX = 0;
        let jitterY = 0;

        // Low integrity jitter
        if (systemIntegrity < 30) {
            const intensity = (30 - systemIntegrity) * 0.5;
            jitterX = (Math.random() - 0.5) * intensity;
            jitterY = (Math.random() - 0.5) * intensity;
        }

        // Screen shake
        if (this.screenShake > 0) {
            jitterX += (Math.random() - 0.5) * this.screenShake;
            jitterY += (Math.random() - 0.5) * this.screenShake;
            this.screenShake *= 0.9;
            if (this.screenShake < 0.5) this.screenShake = 0;
        }

        this.ctx.translate(this.camX + jitterX, this.camY + jitterY);
    }

    /**
     * Draw the background grid and world borders.
     */
    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.globalAlpha = 0.1;
        this.ctx.lineWidth = 1;

        const gridSize = CONSTANTS.GRID_SIZE;
        const startX = Math.floor(-this.camX / gridSize) * gridSize;
        const endX = startX + this.canvas.width + gridSize;
        const startY = Math.floor(-this.camY / gridSize) * gridSize;
        const endY = startY + this.canvas.height + gridSize;

        this.ctx.beginPath();
        for (let x = startX; x < endX; x += gridSize) {
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
        }
        for (let y = startY; y < endY; y += gridSize) {
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
        }
        this.ctx.stroke();

        // World Borders
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 5;
        this.ctx.globalAlpha = 0.5;
        this.ctx.strokeRect(0, 0, CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT);
        this.ctx.restore();
    }

    /**
     * Render the entire game frame.
     * @param {Object} gameState - Contains entities, particleSystem, firewall, etc.
     */
    render(gameState) {
        this.clear();
        this.applyTransform(gameState.systemIntegrity);

        if (gameState.singularityActive) {
            this.drawSingularity(gameState.player);
        }

        this.drawGrid();

        if (gameState.firewall.active) {
            gameState.firewall.draw(this.ctx);
        }

        gameState.particleSystem.draw(this.ctx);

        // Draw Foods
        gameState.foods.forEach(food => {
            if (Utils.isInViewport(food.x, food.y, food.radius, this.camX, this.camY, this.canvas.width, this.canvas.height)) {
                food.draw(this.ctx);
            }
        });

        // Draw Entities (Player + Bots)
        const entities = [gameState.player, ...gameState.bots].sort((a, b) => a.mass - b.mass);
        entities.forEach(e => {
            if (!e.markedForDeletion && Utils.isInViewport(e.x, e.y, e.radius, this.camX, this.camY, this.canvas.width, this.canvas.height)) {
                e.draw(this.ctx);
            }
        });

        this.ctx.restore();
    }

    drawSingularity(player) {
        this.ctx.save();
        const maxR = player.radius * 10;
        const gradient = this.ctx.createRadialGradient(player.x, player.y, player.radius, player.x, player.y, maxR);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(player.x - maxR, player.y - maxR, maxR * 2, maxR * 2);

        // Warping lines
        this.ctx.beginPath();
        const time = Date.now() / 1000;
        for(let i=0; i<12; i++) {
            const angle = time + (i * Math.PI / 6);
            const r = player.radius * 2 + Math.sin(time * 5 + i) * 20;
            const x = player.x + Math.cos(angle) * r;
            const y = player.y + Math.sin(angle) * r;
            this.ctx.moveTo(player.x, player.y);
            this.ctx.lineTo(x, y);
        }
        this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.restore();
    }
}
