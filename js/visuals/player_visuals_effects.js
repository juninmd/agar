export class PlayerVisualsEffects {
    static drawShield(ctx, player) {
        if (player.shieldEffectTimer > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius + 10, 0, Math.PI * 2);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.restore();
        }
    }

    static drawConfused(ctx, player) {
        if (player.confusedTimer > 0) {
            ctx.save();
            ctx.fillStyle = '#FF007F';
            ctx.font = `bold ${Math.max(16, player.radius)}px 'Orbitron'`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Wobble
            const offsetY = Math.sin(Date.now() / 100) * 5;
            ctx.fillText('?', player.x, player.y - player.radius - 15 + offsetY);
            ctx.restore();
        }
    }

    static drawSpeedEffect(ctx, player) {
        if (player.speedEffectTimer > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
    }

    static drawTrail(ctx, player) {
        if (player.trail.length > 0) {
            ctx.save();
            player.trail.forEach(t => {
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
                ctx.fillStyle = player.color;
                ctx.globalAlpha = t.alpha * 0.5 * player.alpha;
                ctx.fill();
            });
            ctx.restore();
        }
    }

    static updateTrail(player) {
        if (player.speedBoost > 1.1) {
            player.trail.push({ x: player.x, y: player.y, radius: player.radius, alpha: 0.6 * player.alpha });
        }
        for (let i = player.trail.length - 1; i >= 0; i--) {
            player.trail[i].alpha -= 0.05;
            player.trail[i].radius *= 0.95;
            if (player.trail[i].alpha <= 0) player.trail.splice(i, 1);
        }
    }

    static drawName(ctx, player) {
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${Math.max(12, player.radius / 2)}px 'Orbitron'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(player.name, player.x, player.y);
    }

    static drawDecorativeRing(ctx, player) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius - 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    /**
     * Renders cosmetic skin effects (like MATRIX data streams or GLITCH lines) over the player.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {Player} player - The player entity to draw effects on.
     */
    static drawSkinEffects(ctx, player) {
        if (!player.skin || player.skin === 'DEFAULT') return;

        ctx.save();
        if (player.skin === 'GLITCH') {
            if (Math.random() < 0.3) {
                const offsetX = (Math.random() - 0.5) * 10;
                const offsetY = (Math.random() - 0.5) * 10;
                ctx.fillStyle = Math.random() < 0.5 ? '#00ffff' : '#ff00ff';
                ctx.globalAlpha = 0.5;
                ctx.fillRect(player.x + offsetX - player.radius, player.y + offsetY, player.radius * 2, 4);
            }
        } else if (player.skin === 'MATRIX') {
            ctx.fillStyle = '#00ff41';
            ctx.font = `${player.radius * 0.8}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const char = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.globalAlpha = 0.7;
            ctx.fillText(char, player.x, player.y + player.radius * 0.5);
        } else if (player.skin === 'NEON_PULSE') {
            const time = Date.now() * 0.005;
            const pulse = (Math.sin(time) + 1) * 0.5; // 0 to 1
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius + 10 + (pulse * 15), 0, Math.PI * 2);
            ctx.strokeStyle = player.color;
            ctx.globalAlpha = 1.0 - pulse;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        ctx.restore();
    }
}
