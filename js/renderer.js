import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';
import { RendererBackground } from './renderer_background.js';
import { VisualEffects } from './visual_effects.js';
import { TargetingVisuals } from './visuals/targeting_visuals.js';

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
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
    }

    clear(zoomLevel = 1) {
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.canvas.width / zoomLevel, this.canvas.height / zoomLevel);
    }

    updateCamera(player) {
        const targetX = this.canvas.width / 2 - player.x;
        const targetY = this.canvas.height / 2 - player.y;

        // If camera is uninitialized, snap to target immediately
        if (this.camX === 0 && this.camY === 0) {
            this.camX = targetX;
            this.camY = targetY;
        } else {
            this.camX += (targetX - this.camX) * 0.1;
            this.camY += (targetY - this.camY) * 0.1;
        }
    }

    applyTransform(systemIntegrity, zoomLevel = 1) {
        this.ctx.save();
        // Scale around the center of the screen
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(zoomLevel, zoomLevel);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);

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
        const zoomLevel = gameState.input ? gameState.input.zoomLevel : 1;
        const viewportWidth = this.canvas.width / zoomLevel;
        const viewportHeight = this.canvas.height / zoomLevel;

        const now = performance.now();
        this.frameCount++;
        if (now - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;
        }

        this.clear(zoomLevel);
        this.applyTransform(gameState.systemIntegrity, zoomLevel);

        RendererBackground.drawGrid(this.ctx, gameState, this.camX, this.camY, viewportWidth, viewportHeight);

        if (gameState.purgeSystem && gameState.purgeSystem.sanctuaries) {
            gameState.purgeSystem.sanctuaries.forEach(s => s.draw(this.ctx));
        }

        if (gameState.singularityActive) {
            VisualEffects.drawSingularity(this.ctx, gameState.player);
        }

        if (gameState.firewall.active) {
            gameState.firewall.draw(this.ctx);
        }

        gameState.particleSystem.draw(this.ctx);

        if (gameState.bossSystem) {
            gameState.bossSystem.draw(this.ctx);
        }

        if (gameState.riftSystem) {
            gameState.riftSystem.draw(this.ctx);
        }

        gameState.foods.forEach(food => {
            if (Utils.isInViewport(food.x, food.y, food.radius, this.camX, this.camY, viewportWidth, viewportHeight)) {
                food.draw(this.ctx);
            }
        });

        if (gameState.network && gameState.network.otherPlayers) {
            for (const [id, remote] of gameState.network.otherPlayers.entries()) {
                const rRadius = Utils.getRadiusFromMass(remote.mass);
                if (Utils.isInViewport(remote.x, remote.y, rRadius, this.camX, this.camY, viewportWidth, viewportHeight)) {
                    this.ctx.beginPath();
                    this.ctx.arc(remote.x, remote.y, rRadius, 0, Math.PI * 2);
                    this.ctx.strokeStyle = remote.color;
                    this.ctx.lineWidth = 3;
                    this.ctx.setLineDash([5, 5]);
                    this.ctx.stroke();
                    this.ctx.setLineDash([]);
                    this.ctx.closePath();
                }
            }
        }

        const entities = [gameState.player, ...gameState.bots].sort((a, b) => a.mass - b.mass);
        entities.forEach(e => {
            if (!e.markedForDeletion && Utils.isInViewport(e.x, e.y, e.radius, this.camX, this.camY, viewportWidth, viewportHeight)) {
                e.draw(this.ctx);
            }
        });

        TargetingVisuals.drawTargetingSystem(this.ctx, gameState.player, gameState.bots, this.camX, this.camY, viewportWidth, viewportHeight);

        this.ctx.restore();
    }
}
