import { Utils } from './utils.js';
import { VisualEffects } from './visual_effects.js';
import { AbilityEffects } from './ability_effects.js';
import { ABILITY_CONFIG } from './effects/ability_config.js';
import { AbilityActivator } from './effects/ability_activator.js';

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

        this.currentConfig = ABILITY_CONFIG[protocolId] || ABILITY_CONFIG.HACKER;
        this.maxCooldown = this.currentConfig.cooldown;
    }

    activate(player, bots) {
        return AbilityActivator.activate(this, player, bots);
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
                if (this.protocolId === 'BREAKER') player.breakerAura = false;
                if (this.protocolId === 'SPECTER') {
                    player.isTangible = true;
                    player.alpha = 1.0;
                }
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
                if (this.protocolId === 'MAGNETAR') {
                    // Assuming foods array is available via the window.game context for this scope.
                    // A better architecture would pass game directly into update, but we work within constraints.
                    const foods = (window.game && window.game.foods) ? window.game.foods : [];
                    AbilityEffects.updateMagnetar(player, bots, foods);
                }
                if (this.protocolId === 'VAMPYR') {
                    this.tetheredBots = [];
                    AbilityEffects.updateVampyr(player, bots, this.tetheredBots);
                }
            }
        } else {
            player.invulnerable = false;
            if (this.protocolId === 'PHANTOM') player.alpha = 1.0;
            if (this.protocolId === 'BREAKER') player.breakerAura = false;
            if (this.protocolId === 'SPECTER') {
                player.isTangible = true;
                player.alpha = 1.0;
            }
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
