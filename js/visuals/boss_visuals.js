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
        // We need CONSTANTS for WORLD_HEIGHT. Assuming it's accessible or we just draw extremely tall.
        // It's better to pass it or rely on the game bounds. The original used CONSTANTS.WORLD_HEIGHT.
        const WORLD_HEIGHT = CONSTANTS.WORLD_HEIGHT;

        ctx.save();

        // Draw the sweeping laser beam (the wall itself)
        const wallAlpha = 0.4 + Math.sin(Date.now() / 200) * 0.2;
        ctx.fillStyle = `rgba(255, 69, 0, ${wallAlpha})`;
        ctx.fillRect(firewall.x - firewall.width / 2, 0, firewall.width, WORLD_HEIGHT);

        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(firewall.x, 0);
        ctx.lineTo(firewall.x, WORLD_HEIGHT);
        ctx.stroke();

        // Draw active nodes
        firewall.nodes.forEach(node => {
            if (!node.active) return;

            ctx.beginPath();
            ctx.arc(firewall.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();

            // Core pulsing
            const pulse = 1 + Math.sin(Date.now() / 150 + node.y) * 0.2;
            ctx.beginPath();
            ctx.arc(firewall.x, node.y, node.radius * 0.5 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            // Name tag
            ctx.fillStyle = '#FFF';
            ctx.font = '14px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText("CORE NODE", firewall.x, node.y - node.radius - 10);
        });

        ctx.restore();
    }
}
