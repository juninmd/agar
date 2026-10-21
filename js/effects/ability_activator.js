import { AbilityEffects } from '../ability_effects.js';

/**
 * Handles the logic for activating player abilities.
 */
export class AbilityActivator {
    /**
     * Attempts to trigger the active ability of a given protocol system.
     * @param {AbilitySystem} system - The ability system instance tracking state.
     * @param {Player} player - The player initiating the ability.
     * @param {Array} bots - Array of bots currently on the map.
     * @returns {boolean} True if the ability was successfully activated, false otherwise.
     */
    static activate(system, player, bots) {
        if (system.cooldown > 0 || system.isActive) return false;

        system.isActive = true;
        system.activeTime = system.currentConfig.duration;
        system.cooldown = system.maxCooldown;

        if (system.protocolId === 'HACKER') AbilityEffects.triggerVirus(player, bots);
        if (system.protocolId === 'ARCHITECT') AbilityEffects.triggerArchitect(bots);
        if (system.protocolId === 'SYNDICATE') AbilityEffects.triggerSyndicate(player);
        if (system.protocolId === 'MIRAGE') AbilityEffects.triggerMirage(player, bots);
        if (system.protocolId === 'CHRONOS') {
            AbilityEffects.triggerChronos(player);
            system.isActive = false;
        }
        if (system.protocolId === 'SWARM') {
            if (player.mass > 500) {
                AbilityEffects.triggerSwarm(player, bots);
                system.isActive = false;
            } else return false;
        }
        if (system.protocolId === 'NEXUS') {
            if (player.mass > 250) {
                AbilityEffects.triggerNexus(player, bots);
                system.isActive = false;
            } else return false;
        }
        if (system.protocolId === 'KINETIC') {
            if (AbilityEffects.triggerKinetic(player, bots)) system.isActive = false;
            else return false;
        }
        if (system.protocolId === 'AEON') {
            AbilityEffects.triggerAeon(player);
            system.isActive = false;
        }
        if (system.protocolId === 'FORGE') {
            if (player.mass > 150) {
                AbilityEffects.triggerForge(player, bots);
                system.isActive = false;
            } else return false;
        }
        if (system.protocolId === 'SYNAPSE') {
            if (AbilityEffects.triggerSynapse(player, bots)) {
                system.isActive = true;
                system.activeTime = system.currentConfig.duration;
                system.cooldown = system.currentConfig.cooldown;
            } else return false;
        }
        if (system.protocolId === 'MAGNETAR' || system.protocolId === 'VAMPYR') {
            system.isActive = true;
            system.activeTime = system.currentConfig.duration;
            system.cooldown = system.currentConfig.cooldown;
        }
        if (system.protocolId === 'BREAKER') {
            player.breakerAura = true;
            system.isActive = true;
            system.activeTime = system.currentConfig.duration;
            system.cooldown = system.currentConfig.cooldown;
        }
        if (system.protocolId === 'HARVEST') {
            AbilityEffects.triggerHarvest(player, window.game.foods);
            system.isActive = false;
        }
        if (system.protocolId === 'SPECTER') {
            AbilityEffects.triggerSpecter(player);
            system.isActive = true;
            system.activeTime = system.currentConfig.duration;
            system.cooldown = system.currentConfig.cooldown;
        }

        return true;
    }
}
