import { AIStrategies } from './ai_strategies.js';

export class AISystem {
    static think(bot, entities, foods) {
        if (bot.type === 'CORRUPTER') {
            AIStrategies.thinkCorrupter(bot, entities, foods);
        } else if (bot.type === 'ELITE_HUNTER') {
            AIStrategies.thinkHunter(bot, entities, foods);
        } else if (bot.type === 'VOID_WALKER') {
            AIStrategies.thinkVoidWalker(bot, entities);
        } else {
            AIStrategies.thinkNormal(bot, entities, foods);
        }
    }

    // Keep wander here for backward compatibility if other modules use it directly
    // but delegate to strategies
    static wander(bot, foods) {
        AIStrategies.wander(bot, foods);
    }
}
