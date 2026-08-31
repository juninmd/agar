export class UIMinimap {
    constructor() {
        this.container = document.getElementById('minimap-container');
        this.canvas = document.getElementById('minimap-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }
        this.radarAngle = 0;
    }

    show(active) {
        if (!this.container) return;
        if (active) {
            this.container.classList.remove('hidden');
        } else {
            this.container.classList.add('hidden');
        }
    }

    update(player, bots, worldWidth, worldHeight) {
        if (!this.ctx) return;

        // Clear minimap
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw grid/border
        this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, this.width, this.height);

        // Draw radar sweep
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.max(this.width, this.height);

        this.radarAngle += 0.05;
        if (this.radarAngle > Math.PI * 2) this.radarAngle -= Math.PI * 2;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.radarAngle);

        const gradient = this.ctx.createConicGradient(0, 0, 0);
        gradient.addColorStop(0, 'rgba(0, 243, 255, 0.4)');
        gradient.addColorStop(0.2, 'rgba(0, 243, 255, 0)');
        gradient.addColorStop(1, 'rgba(0, 243, 255, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(radius, 0);
        this.ctx.stroke();
        this.ctx.restore();

        const scaleX = this.width / worldWidth;
        const scaleY = this.height / worldHeight;

        // Draw bots
        bots.forEach(bot => {
            if (bot.markedForDeletion) return;
            const minimapX = bot.x * scaleX;
            const minimapY = bot.y * scaleY;
            const minimapRadius = Math.max(1, bot.radius * scaleX);

            this.ctx.beginPath();
            this.ctx.arc(minimapX, minimapY, minimapRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = bot.color;
            this.ctx.fill();
        });

        // Draw player
        if (player && !player.markedForDeletion) {
            const minimapX = player.x * scaleX;
            const minimapY = player.y * scaleY;
            const minimapRadius = Math.max(2, player.radius * scaleX);

            this.ctx.beginPath();
            this.ctx.arc(minimapX, minimapY, minimapRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = '#FFFFFF';
            this.ctx.fill();
            this.ctx.shadowBlur = 0; // Reset

            // Draw a crosshair or indicator over player
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(minimapX - 5, minimapY);
            this.ctx.lineTo(minimapX + 5, minimapY);
            this.ctx.moveTo(minimapX, minimapY - 5);
            this.ctx.lineTo(minimapX, minimapY + 5);
            this.ctx.stroke();
        }
    }
}
