import { Utils } from './utils.js';
import { VisualEffects } from './visual_effects.js';

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
        this.tetheredBots = [];

        this.config = {
            BASTION: { cooldown: 900, duration: 180 }, // 15s / 3s
            PHANTOM: { cooldown: 600, duration: 180 }, // 10s / 3s
            HACKER: { cooldown: 720, duration: 120 },  // 12s / 2s
            VIRAL:   { cooldown: 600, duration: 300 }, // 10s / 5s
            CYPHER:  { cooldown: 900, duration: 300 }, // 15s / 5s
            ARCHITECT: { cooldown: 1200, duration: 300 } // 20s / 5s
        };

        this.currentConfig = this.config[protocolId] || this.config.HACKER;
        this.maxCooldown = this.currentConfig.cooldown;
    }

    activate(player, bots) {
        if (this.cooldown > 0 || this.isActive) return false;

        this.isActive = true;
        this.activeTime = this.currentConfig.duration;
        this.cooldown = this.maxCooldown;

        if (this.protocolId === 'HACKER') this.triggerVirus(player, bots);
        if (this.protocolId === 'ARCHITECT') this.triggerArchitect(player, bots);

        return true;
    }

    triggerArchitect(player, bots) {
        // Halt all bots on the screen, global freeze
        bots.forEach(bot => {
            bot.frozen = true;
            bot.frozenTimer = 300; // 5 seconds freeze
        });
    }

    triggerVirus(player, bots) {
        const range = 300 + player.radius;
        bots.forEach(bot => {
            if (Utils.getDistance(player.x, player.y, bot.x, bot.y) < range) {
                bot.frozen = true;
                bot.frozenTimer = 120;
            }
        });
    }

    update(player, bots = []) {
        if (this.cooldown > 0) this.cooldown--;

        if (this.isActive) {
            this.activeTime--;
            if (this.activeTime <= 0) {
                this.isActive = false;
                this.tetheredBots = [];
                if (this.protocolId === 'PHANTOM') player.alpha = 1.0;
                if (this.protocolId === 'BASTION') player.invulnerable = false;
            } else {
                if (this.protocolId === 'PHANTOM') player.alpha = 0.4;
                if (this.protocolId === 'BASTION') player.invulnerable = true;
                if (this.protocolId === 'VIRAL') this.updateOutbreak(player, bots);
                if (this.protocolId === 'CYPHER') {
                     player.speedBoost = Math.max(player.speedBoost, 2.0);
                     bots.forEach(b => b.isSlowed = true);
                }
            }
        } else {
            player.invulnerable = false;
            if (this.protocolId === 'PHANTOM') player.alpha = 1.0;
        }
    }

    updateOutbreak(player, bots) {
        const range = 400 + player.radius;
        this.tetheredBots = [];
        bots.forEach(bot => {
            const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
            if (dist < range && !bot.markedForDeletion) {
                const drain = bot.mass * 0.015; // Drain 1.5% per frame
                if (bot.mass > 10) {
                    bot.mass -= drain;
                    bot.radius = Utils.getRadiusFromMass(bot.mass);
                    player.mass += drain;
                    player.radius = Utils.getRadiusFromMass(player.mass);
                    this.tetheredBots.push(bot);
                }
            }
        });
    }

    draw(ctx, player) {
        if (!this.isActive) return;

        if (this.protocolId === 'VIRAL' && this.tetheredBots) {
            this.tetheredBots.forEach(bot => {
                VisualEffects.drawViralTether(ctx, player.x, player.y, bot.x, bot.y);
            });
        }

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
        } else if (this.protocolId === 'CYPHER') {
             const pulse = Math.sin(Date.now() / 100) * 0.2 + 1.0;
             ctx.beginPath();
             ctx.arc(0, 0, player.radius * 1.5 * pulse, 0, Math.PI * 2);
             ctx.strokeStyle = '#FFD700';
             ctx.lineWidth = 3;
             ctx.setLineDash([5, 10]);
             ctx.stroke();
        } else if (this.protocolId === 'HACKER') {
             const progress = 1 - (this.activeTime / this.currentConfig.duration);
             const radius = (300 + player.radius) * progress;
             ctx.beginPath();
             ctx.arc(0, 0, radius, 0, Math.PI * 2);
             ctx.strokeStyle = `rgba(0, 255, 65, ${1 - progress})`;
             ctx.lineWidth = 4 * (1-progress);
             ctx.stroke();
        } else if (this.protocolId === 'ARCHITECT') {
             const pulse = Math.sin(Date.now() / 200) * 0.3 + 1.0;
             ctx.beginPath();
             ctx.arc(0, 0, player.radius * 2 * pulse, 0, Math.PI * 2);
             ctx.strokeStyle = '#FFFFFF';
             ctx.lineWidth = 5;
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
