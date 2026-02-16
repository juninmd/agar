export class GlitchVisuals {
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
}
