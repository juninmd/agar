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
        if (player.speedBoost > 1.1) {
            player.trail.push({ x: player.x, y: player.y, radius: player.radius, alpha: 0.6 * player.alpha });
        }
        for (let i = player.trail.length - 1; i >= 0; i--) {
            player.trail[i].alpha -= 0.05;
            player.trail[i].radius *= 0.95;
            if (player.trail[i].alpha <= 0) player.trail.splice(i, 1);
        }
    }

    static drawGlitch(ctx, entity) {
        const numSlices = 5;
        const maxOffset = 5;
        for (let i = 0; i < numSlices; i++) {
            const sliceHeight = (entity.radius * 2) / numSlices;
            const yPos = entity.y - entity.radius + (i * sliceHeight);
            const offsetX = (Math.random() - 0.5) * maxOffset;
            ctx.save();
            ctx.beginPath();
            ctx.rect(entity.x - entity.radius - maxOffset, yPos, (entity.radius * 2) + maxOffset * 2, sliceHeight);
            ctx.clip();
            ctx.beginPath();
            ctx.arc(entity.x + offsetX, entity.y, entity.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = entity.color;
            ctx.fill();
            ctx.restore();
        }
        if (Math.random() > 0.7) {
            ctx.fillStyle = '#FFF';
            ctx.fillRect(
                entity.x + (Math.random() - 0.5) * entity.radius,
                entity.y + (Math.random() - 0.5) * entity.radius,
                Math.random() * 10,
                Math.random() * 5
            );
        }
    }

    static drawViralTether(ctx, startX, startY, endX, endY, intensity = 1.0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 20;
        const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 20;
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        ctx.strokeStyle = `rgba(157, 0, 255, ${intensity})`;
        ctx.lineWidth = 2 + Math.random() * 2;
        ctx.shadowColor = '#9D00FF';
        ctx.shadowBlur = 10 * intensity;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
    }

    static drawPlayer(ctx, player) {
        if (player.abilities) player.abilities.draw(ctx, player);
        this.drawShield(ctx, player);
        this.drawSpeedEffect(ctx, player);
        this.drawTrail(ctx, player);
        const originalAlpha = ctx.globalAlpha;
        ctx.globalAlpha = player.alpha;

        if (player.isGlitching) {
            this.drawGlitch(ctx, player);
        } else {
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = player.color;
            ctx.fill();
            ctx.shadowColor = player.color;
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        this.drawName(ctx, player);
        this.drawDecorativeRing(ctx, player);
        ctx.globalAlpha = originalAlpha;
    }
}
