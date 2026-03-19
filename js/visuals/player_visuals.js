import { GlitchVisuals } from './glitch_visuals.js';

export class PlayerVisuals {
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

    static drawOrganicShape(ctx, player) {
        const time = Date.now() * 0.002;
        const numPoints = 12;
        const radius = player.radius;
        const angleStep = (Math.PI * 2) / numPoints;

        ctx.beginPath();
        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleStep;
            // Create a wobbly effect that pulsates
            const offset = Math.sin(angle * 3 + time) * (radius * 0.15);
            const r = radius + offset;
            const x = player.x + Math.cos(angle) * r;
            const y = player.y + Math.sin(angle) * r;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();

        // Inner glowing core
        const gradient = ctx.createRadialGradient(
            player.x, player.y, radius * 0.2,
            player.x, player.y, radius * 1.2
        );
        gradient.addColorStop(0, '#FFFFFF'); // Hot inner core
        gradient.addColorStop(0.4, player.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.shadowColor = player.color;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = player.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    static drawPlayer(ctx, player) {
        if (player.abilities) player.abilities.draw(ctx, player);
        this.drawShield(ctx, player);
        this.drawSpeedEffect(ctx, player);
        this.drawTrail(ctx, player);
        const originalAlpha = ctx.globalAlpha;
        // Ghosts are semi-transparent
        ctx.globalAlpha = (player.type === 'GHOST') ? 0.4 : player.alpha;

        const isOrganic = (player.protocol && player.protocol.id === 'SYMBIOTE') || (player.type === 'PARASITE');

        if (player.isGlitching) {
            GlitchVisuals.drawGlitch(ctx, player);
        } else if (player.type === 'MIMIC') {
            // Draw as a pulsing star/square to mimic lore/powerups
            const time = Date.now() * 0.005;
            const size = player.radius * (0.8 + Math.sin(time) * 0.2);
            ctx.fillStyle = player.color;
            ctx.shadowColor = player.color;
            ctx.shadowBlur = 15;
            ctx.fillRect(player.x - size, player.y - size, size * 2, size * 2);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#FFFFFF';
            ctx.strokeRect(player.x - size, player.y - size, size * 2, size * 2);
        } else if (isOrganic) {
            this.drawOrganicShape(ctx, player);
        } else {
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = player.color;
            ctx.fill();
            ctx.shadowColor = player.color;
            ctx.shadowBlur = (player.type === 'GHOST') ? 5 : 15;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        this.drawName(ctx, player);

        // Ghosts and organics don't get the standard decorative ring
        if (player.type !== 'GHOST' && !isOrganic) {
            this.drawDecorativeRing(ctx, player);
        }
        ctx.globalAlpha = originalAlpha;
    }
}
