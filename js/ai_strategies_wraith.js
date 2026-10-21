import { Utils } from './utils.js';

export class AIStrategiesWraith {
    /**
     * AI Strategy for WRAITH bots: occasionally becomes intangible.
     * @param {Bot} bot - The bot entity.
     * @param {Array} entities - List of all entities in the game.
     * @param {Array} foods - List of all food items.
     * @param {Function} wanderFn - Fallback wandering function.
     */
    static thinkWraith(bot, entities, foods, wanderFn) {
        if (!bot.intangibleTimer) bot.intangibleTimer = 0;

        if (bot.intangibleTimer > 0) {
            bot.intangibleTimer--;
            bot.isTangible = false;
            bot.alpha = 0.3; // Make it look ghostly
        } else {
            bot.isTangible = true;
            bot.alpha = 1.0;
        }

        let hasThreat = false;
        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            const viewRange = 400 + bot.radius;

            if (dist < viewRange && other.mass > bot.mass * 1.1) {
                hasThreat = true;
            }
        });

        // Chance to turn intangible when threatened
        if (hasThreat && bot.isTangible && Math.random() < 0.05) {
            bot.intangibleTimer = 180; // 3 seconds at 60fps
        }

        // Wraith wanders normally or flees slightly but relies on intangibility mostly
        wanderFn(bot, foods);
    }
}
