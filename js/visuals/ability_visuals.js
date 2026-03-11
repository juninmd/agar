export class AbilityVisuals {
    static drawAbility(ctx, player, system) {
        if (!system.isActive) return;

        if (system.protocolId === 'VIRAL' && system.tetheredBots) {
            system.tetheredBots.forEach(bot => {
                this.drawViralTether(ctx, player.x, player.y, bot.x, bot.y);
            });
        }

        ctx.save();
        ctx.translate(player.x, player.y);

        if (system.protocolId === 'BASTION') {
            ctx.beginPath();
            ctx.arc(0, 0, player.radius + 15, 0, Math.PI * 2);
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 4;
            ctx.setLineDash([10, 5]);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.fill();
        } else if (system.protocolId === 'CYPHER') {
             const pulse = Math.sin(Date.now() / 100) * 0.2 + 1.0;
             ctx.beginPath();
             ctx.arc(0, 0, player.radius * 1.5 * pulse, 0, Math.PI * 2);
             ctx.strokeStyle = '#FFD700';
             ctx.lineWidth = 3;
             ctx.setLineDash([5, 10]);
             ctx.stroke();
        } else if (system.protocolId === 'HACKER') {
             const progress = 1 - (system.activeTime / system.currentConfig.duration);
             const radius = (300 + player.radius) * progress;
             ctx.beginPath();
             ctx.arc(0, 0, radius, 0, Math.PI * 2);
             ctx.strokeStyle = `rgba(0, 255, 65, ${1 - progress})`;
             ctx.lineWidth = 4 * (1-progress);
             ctx.stroke();
        } else if (system.protocolId === 'ARCHITECT') {
             const pulse = Math.sin(Date.now() / 200) * 0.3 + 1.0;
             ctx.beginPath();
             ctx.arc(0, 0, player.radius * 2 * pulse, 0, Math.PI * 2);
             ctx.strokeStyle = '#FFFFFF';
             ctx.lineWidth = 5;
             ctx.stroke();
        }

        ctx.restore();
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
}
