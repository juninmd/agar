export class VisualEffects {
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

    static updateTrail(player) {
        // Generate trail
        if (player.speedBoost > 1.1) {
            player.trail.push({ x: player.x, y: player.y, radius: player.radius, alpha: 0.6 * player.alpha });
        }

        // Update Trail
        for (let i = player.trail.length - 1; i >= 0; i--) {
            player.trail[i].alpha -= 0.05;
            player.trail[i].radius *= 0.95;
            if (player.trail[i].alpha <= 0) player.trail.splice(i, 1);
        }
    }
}
