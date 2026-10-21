import { AbilityEffectsCombat } from './effects/ability_effects_combat.js';
import { AbilityEffectsCombat2 } from './effects/ability_effects_combat2.js';
import { AbilityEffectsTime } from './effects/ability_effects_time.js';

export class AbilityEffects {
    static triggerCypher(player, bots) { AbilityEffectsTime.triggerCypher(player, bots); }
    static updateChronos(player) { AbilityEffectsTime.updateChronos(player); }
    static triggerAeon(player) { AbilityEffectsTime.triggerAeon(player); }
    static triggerChronos(player) { AbilityEffectsTime.triggerChronos(player); }
    static triggerArchitect(bots) { AbilityEffectsTime.triggerArchitect(bots); }
    static updateMagnetar(player, bots, foods = []) { AbilityEffectsTime.updateMagnetar(player, bots, foods); }
    static triggerHarvest(player, foods) { AbilityEffectsTime.triggerHarvest(player, foods); }
    static triggerSpecter(player) { AbilityEffectsTime.triggerSpecter(player); }

    static triggerSwarm(player, bots) { AbilityEffectsCombat.triggerSwarm(player, bots); }
    static triggerMirage(player, bots) { AbilityEffectsCombat.triggerMirage(player, bots); }
    static triggerSyndicate(player) { AbilityEffectsCombat.triggerSyndicate(player); }
    static triggerVirus(player, bots) { AbilityEffectsCombat.triggerVirus(player, bots); }
    static updateOutbreak(player, bots, tetheredBots) { AbilityEffectsCombat.updateOutbreak(player, bots, tetheredBots); }
    static updateSoulStorm(player, bots, tetheredBots) { AbilityEffectsCombat.updateSoulStorm(player, bots, tetheredBots); }

    static triggerNexus(player, bots) { AbilityEffectsCombat2.triggerNexus(player, bots); }
    static triggerForge(player, bots) { return AbilityEffectsCombat2.triggerForge(player, bots); }
    static triggerSynapse(player, bots, cost = 100) { return AbilityEffectsCombat2.triggerSynapse(player, bots, cost); }
    static triggerKinetic(player, bots) { return AbilityEffectsCombat2.triggerKinetic(player, bots); }
    static updateVampyr(player, bots, tetheredBots) { AbilityEffectsCombat2.updateVampyr(player, bots, tetheredBots); }
}
