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
            SYNDICATE: { cooldown: 600, duration: 120 }, // 10s / 2s
            MIRAGE: { cooldown: 600, duration: 180 }     // 10s / 3s
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
        if (this.protocolId === 'MIRAGE') this.triggerMirage(player, bots);

        return true;
    }

    triggerMirage(player, bots) {
        // Spawn 2 Decoy bots that look like the player
        for (let i = 0; i < 2; i++) {
            // Create a fake bot but using the Bot class pattern.
            // We have to dynamically import Bot or assume it's available via window if we want to avoid circular deps.
            // Fortunately, bots array contains Bot instances. We can instantiate one using the same constructor if needed.
            // Or simply rely on the fact that window.Bot is exposed in main.js.
            const decoy = new window.Bot(player.x, player.y, player.radius, player.color, 'DECOY');
            decoy.mass = player.mass;
            decoy.alpha = 0.5; // Visual cue that it's a decoy
            decoy.isDecoy = true;
            decoy.setTarget(player.x + (Math.random() - 0.5) * 500, player.y + (Math.random() - 0.5) * 500);
            bots.push(decoy);
        }
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
