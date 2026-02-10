import { Utils } from './utils.js';

/**
 * Manages active abilities for players based on their protocol.
 */
export class AbilitySystem {
    constructor(protocolId) {
        this.protocolId = protocolId;
        this.cooldown = 0;
        this.maxCooldown = 0;
        this.activeTime = 0;
        this.isActive = false;

        // Configuration (Frames @ 60FPS)
        this.config = {
            BASTION: { cooldown: 900, duration: 180 }, // 15s / 3s
            PHANTOM: { cooldown: 600, duration: 180 }, // 10s / 3s
            HACKER: { cooldown: 720, duration: 120 }   // 12s / 2s
        };

        this.currentConfig = this.config[protocolId] || this.config.HACKER;
        this.maxCooldown = this.currentConfig.cooldown;
    }

    /**
     * Attempts to activate the ability.
     * @param {Player} player
     * @param {Array<Bot>} bots
     * @returns {boolean} Success
     */
    activate(player, bots) {
        if (this.cooldown > 0 || this.isActive) return false;

        this.isActive = true;
        this.activeTime = this.currentConfig.duration;
        this.cooldown = this.maxCooldown;

        // Trigger Immediate Effects
        if (this.protocolId === 'HACKER') {
            this.triggerVirus(player, bots);
        }

        return true;
    }

    triggerVirus(player, bots) {
        const range = 300 + player.radius;
        bots.forEach(bot => {
            if (Utils.getDistance(player.x, player.y, bot.x, bot.y) < range) {
                bot.frozen = true;
                bot.frozenTimer = 120; // 2 seconds
            }
        });
    }

    update(player) {
        if (this.cooldown > 0) this.cooldown--;

        if (this.isActive) {
            this.activeTime--;
            if (this.activeTime <= 0) {
                this.isActive = false;
                // Deactivate Effects
                if (this.protocolId === 'PHANTOM') player.alpha = 1.0;
                if (this.protocolId === 'BASTION') player.invulnerable = false;
            } else {
                // Continuous Effects
                if (this.protocolId === 'PHANTOM') player.alpha = 0.4;
                if (this.protocolId === 'BASTION') player.invulnerable = true;
            }
        } else {
            // Ensure state is reset if interrupted
            player.invulnerable = false;
            if (this.protocolId === 'PHANTOM') player.alpha = 1.0;
        }
    }

    draw(ctx, player) {
        if (!this.isActive) return;

        ctx.save();
        ctx.translate(player.x, player.y);

        if (this.protocolId === 'BASTION') {
            ctx.beginPath();
            ctx.arc(0, 0, player.radius + 15, 0, Math.PI * 2);
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 4;
            ctx.setLineDash([10, 5]);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.fill();
        } else if (this.protocolId === 'HACKER') {
             // Shockwave effect
             const progress = 1 - (this.activeTime / this.currentConfig.duration);
             const radius = (300 + player.radius) * progress;
             ctx.beginPath();
             ctx.arc(0, 0, radius, 0, Math.PI * 2);
             ctx.strokeStyle = `rgba(0, 255, 65, ${1 - progress})`;
             ctx.lineWidth = 4 * (1-progress);
             ctx.stroke();
        }

        ctx.restore();
    }

    getCooldownPercent() {
        if (this.isActive) return 100;
        if (this.cooldown <= 0) return 0;
        return (this.cooldown / this.maxCooldown) * 100;
    }
}
