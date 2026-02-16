import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';
import { RendererBackground } from './renderer_background.js';
import { VisualEffects } from './visual_effects.js';

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

    clear() {
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateCamera(player) {
        this.camX = this.canvas.width / 2 - player.x;
        this.camY = this.canvas.height / 2 - player.y;
    }

    applyTransform(systemIntegrity) {
        this.ctx.save();
        let jitterX = 0;
        let jitterY = 0;

        if (systemIntegrity < 30) {
            const intensity = (30 - systemIntegrity) * 0.5;
            jitterX = (Math.random() - 0.5) * intensity;
            jitterY = (Math.random() - 0.5) * intensity;
        }

        if (this.screenShake > 0) {
            jitterX += (Math.random() - 0.5) * this.screenShake;
            jitterY += (Math.random() - 0.5) * this.screenShake;
            this.screenShake *= 0.9;
            if (this.screenShake < 0.5) this.screenShake = 0;
        }

        this.ctx.translate(this.camX + jitterX, this.camY + jitterY);
    }

    render(gameState) {
        this.clear();
        this.applyTransform(gameState.systemIntegrity);

        RendererBackground.drawGrid(this.ctx, this.camX, this.camY, this.canvas.width, this.canvas.height);

        if (gameState.singularityActive) {
            VisualEffects.drawSingularity(this.ctx, gameState.player);
        }

        if (gameState.firewall.active) {
            gameState.firewall.draw(this.ctx);
        }

        gameState.particleSystem.draw(this.ctx);

        gameState.foods.forEach(food => {
            if (Utils.isInViewport(food.x, food.y, food.radius, this.camX, this.camY, this.canvas.width, this.canvas.height)) {
                food.draw(this.ctx);
            }
        });

        const entities = [gameState.player, ...gameState.bots].sort((a, b) => a.mass - b.mass);
        entities.forEach(e => {
            if (!e.markedForDeletion && Utils.isInViewport(e.x, e.y, e.radius, this.camX, this.camY, this.canvas.width, this.canvas.height)) {
                e.draw(this.ctx);
            }
        });

        this.ctx.restore();
    }
}
