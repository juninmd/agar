import { AIStrategiesBasic } from './ai_strategies_basic.js';
import { AIStrategiesAdvanced } from './ai_strategies_advanced.js';
import { AIStrategiesCombat } from './ai_strategies_combat.js';
import { AIStrategiesExtra } from './ai_strategies_extra.js';
import { AIStrategiesPhysics } from './ai_strategies_physics.js';
import { AIStrategiesPhysicsAdvanced } from './ai_strategies_physics_advanced.js';

export class AIStrategies {
    static thinkStalker(bot, entities, foods) {
        AIStrategiesAdvanced.thinkStalker(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkMimic(bot, entities, foods) {
        AIStrategiesBasic.thinkMimic(bot, entities, foods);
    }

    static thinkWeaver(bot, entities, foods) {
        AIStrategiesBasic.thinkWeaver(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkMerchant(bot, entities, foods) {
        AIStrategiesBasic.thinkMerchant(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkVoidWalker(bot, entities) {
        AIStrategiesBasic.thinkVoidWalker(bot, entities, AIStrategiesBasic.wander);
    }

    static thinkSoulbinder(bot, entities, foods) {
        AIStrategiesAdvanced.thinkSoulbinder(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkAnomaly(bot, entities, foods) {
        AIStrategiesAdvanced.thinkAnomaly(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkCorrupter(bot, entities, foods) {
        AIStrategiesCombat.thinkCorrupter(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkIllusionist(bot, entities, foods) {
        AIStrategiesAdvanced.thinkIllusionist(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkWraith(bot, entities, foods) {
        AIStrategiesAdvanced.thinkWraith(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkDrone(bot, entities, foods) {
        AIStrategiesExtra.thinkDrone(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkFragmenter(bot, entities, foods) {
        AIStrategiesExtra.thinkFragmenter(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkOracle(bot, entities, foods) {
        AIStrategiesExtra.thinkOracle(bot, entities, foods, AIStrategiesBasic.wander);
    }


    static thinkNeuron(bot, entities, foods) {
        AIStrategiesExtra.thinkNeuron(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkBumper(bot, entities, foods) {
        AIStrategiesPhysics.thinkBumper(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkLodestone(bot, entities, foods) {
        AIStrategiesPhysicsAdvanced.thinkLodestone(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkSmith(bot, entities, foods) {
        AIStrategiesPhysics.thinkSmith(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkGhoul(bot, entities, foods) {
        AIStrategiesPhysicsAdvanced.thinkGhoul(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkTank(bot, entities, foods) {
        AIStrategiesPhysics.thinkTank(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkHunter(bot, entities, foods) {
        AIStrategiesCombat.thinkHunter(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkNormal(bot, entities, foods) {
        AIStrategiesCombat.thinkNormal(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static wander(bot, foods) {
        AIStrategiesBasic.wander(bot, foods);
    }
}
