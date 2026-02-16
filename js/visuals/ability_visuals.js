export class AbilityVisuals {
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
