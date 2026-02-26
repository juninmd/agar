export class BossVisuals {
    static drawSentinel(ctx, boss) {
        // Base Circle
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, boss.radius, 0, Math.PI * 2);
        ctx.fillStyle = boss.color;
        ctx.fill();

        // Inner Core (Pulsing)
        const pulse = 1 + Math.sin(Date.now() / 200) * 0.1;
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, boss.radius * 0.4 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Rotating Shields
        const shieldCount = 3;
        const shieldDist = boss.radius * 1.5;
        const shieldSize = boss.radius * 0.3;

        for (let i = 0; i < shieldCount; i++) {
            const angle = boss.shieldRotation + (Math.PI * 2 / shieldCount) * i;
            const sx = boss.x + Math.cos(angle) * shieldDist;
            const sy = boss.y + Math.sin(angle) * shieldDist;

            ctx.beginPath();
            ctx.arc(sx, sy, shieldSize, 0, Math.PI * 2);
            ctx.fillStyle = '#FF0000'; // Shield Color
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#FF0000';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Warning Radius (only in CHARGE state)
        if (boss.aiState === 'CHARGE') {
            ctx.beginPath();
            ctx.arc(boss.x, boss.y, boss.radius * 2.5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Name
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 20px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText("SENTINEL", boss.x, boss.y - boss.radius - 20);
    }
}
