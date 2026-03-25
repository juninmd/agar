import { AIStrategiesBasic } from './ai_strategies_basic.js';
import { AIStrategiesAdvanced } from './ai_strategies_advanced.js';

export class AIStrategies {
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

    static thinkCorrupter(bot, entities, foods) {
        AIStrategiesAdvanced.thinkCorrupter(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkIllusionist(bot, entities, foods) {
        AIStrategiesAdvanced.thinkIllusionist(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkHunter(bot, entities, foods) {
        AIStrategiesAdvanced.thinkHunter(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static thinkNormal(bot, entities, foods) {
        AIStrategiesAdvanced.thinkNormal(bot, entities, foods, AIStrategiesBasic.wander);
    }

    static wander(bot, foods) {
        AIStrategiesBasic.wander(bot, foods);
    }
}
