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

    static drawTitan(ctx, titan) {
        // Dark Matter Core (Black Hole Effect)
        ctx.beginPath();
        ctx.arc(titan.x, titan.y, titan.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();

        // Event Horizon (Purple Pulse)
        ctx.shadowBlur = 50 + Math.sin(Date.now() / 500) * 20;
        ctx.shadowColor = '#9D00FF';
        ctx.strokeStyle = '#9D00FF';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Gravity Waves
        const waveCount = 3;
        const time = Date.now() / 1000;
        for(let i=0; i<waveCount; i++) {
             const waveRadius = titan.radius * (1.2 + (Math.sin(time + i) * 0.1));
             ctx.beginPath();
             ctx.arc(titan.x, titan.y, waveRadius, 0, Math.PI * 2);
             ctx.strokeStyle = `rgba(157, 0, 255, ${0.3 - (i * 0.1)})`;
             ctx.stroke();
        }

        // Name
        ctx.fillStyle = '#9D00FF';
        ctx.font = 'bold 24px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText("NULL VOID TITAN", titan.x, titan.y - titan.radius - 30);
    }

    static drawGreatFirewall(ctx, firewall) {
        // firewall is x, y, width, sweepDirection, gapY, gapHeight
        const halfWidth = firewall.width / 2;
        const leftX = firewall.x - halfWidth;
        const topHeight = firewall.gapY - (firewall.gapHeight / 2);
        const bottomY = firewall.gapY + (firewall.gapHeight / 2);
        const bottomHeight = firewall.height - bottomY;

        ctx.fillStyle = 'rgba(255, 68, 0, 0.8)';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FF4400';

        // Draw top part
        if (topHeight > 0) {
            ctx.fillRect(leftX, 0, firewall.width, topHeight);
        }

        // Draw bottom part
        if (bottomHeight > 0) {
            ctx.fillRect(leftX, bottomY, firewall.width, bottomHeight);
        }

        ctx.shadowBlur = 0;

        // Draw warning signs on the wall
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 30px Orbitron';
        ctx.textAlign = 'center';

        ctx.fillText("GREAT FIREWALL", firewall.x, 100);
        ctx.fillText("GREAT FIREWALL", firewall.x, firewall.height - 100);
    }
}
