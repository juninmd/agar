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
            ARCHITECT: { cooldown: 1200, duration: 300 }, // 20s / 5s
            SOULBOUND: { cooldown: 600, duration: 240 }, // 10s / 4s
            SYNDICATE: { cooldown: 600, duration: 120 }  // 10s / 2s
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
        if (this.protocolId === 'SYNDICATE') this.triggerSyndicate(player);

        return true;
    }

    triggerSyndicate(player) {
        // Syndicate pays mass to spawn a temporary buff
        if (player.mass > 500) {
            player.mass -= 300;
            player.radius = Utils.getRadiusFromMass(player.mass);
            player.applyPowerUp({ id: 'SHIELD', duration: 180, value: 0 }); // 3 seconds invulnerability
            // Extra power-up effects can be added dynamically
        }
    }

    triggerArchitect(bots) {
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
                if (this.protocolId === 'SOULBOUND') this.updateSoulStorm(player, bots);
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

    updateSoulStorm(player, bots) {
        const range = 400 + player.radius;
        this.tetheredBots = [];
        bots.forEach(bot => {
            const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
            if (dist < range && !bot.markedForDeletion) {
                bot.isSlowed = true; // Apply slow effect
                const drain = 0.5; // Constant drain amount
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
        VisualEffects.drawAbility(ctx, player, this);
    }

    getCooldownPercent() {
        if (this.isActive) return 100;
        if (this.cooldown <= 0) return 0;
        return (this.cooldown / this.maxCooldown) * 100;
    }
}
