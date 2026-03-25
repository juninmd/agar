import { Utils } from './utils.js';
import { VisualEffects } from './visual_effects.js';
import { AbilityEffects } from './ability_effects.js';

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

        if (this.protocolId === 'HACKER') AbilityEffects.triggerVirus(player, bots);
        if (this.protocolId === 'ARCHITECT') AbilityEffects.triggerArchitect(bots);
        if (this.protocolId === 'SYNDICATE') AbilityEffects.triggerSyndicate(player);
        if (this.protocolId === 'MIRAGE') AbilityEffects.triggerMirage(player, bots);

        return true;
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

                if (this.protocolId === 'VIRAL') {
                    this.tetheredBots = [];
                    AbilityEffects.updateOutbreak(player, bots, this.tetheredBots);
                }
                if (this.protocolId === 'CYPHER') {
                     player.speedBoost = Math.max(player.speedBoost, 2.0);
                     bots.forEach(b => b.isSlowed = true);
                }
                if (this.protocolId === 'SOULBOUND') {
                    this.tetheredBots = [];
                    AbilityEffects.updateSoulStorm(player, bots, this.tetheredBots);
                }
            }
        } else {
            player.invulnerable = false;
            if (this.protocolId === 'PHANTOM') player.alpha = 1.0;
        }
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
