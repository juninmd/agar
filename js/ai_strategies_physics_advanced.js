import { Utils } from './utils.js';

/**
 * Advanced Physics-based AI strategies.
 */
export class AIStrategiesPhysicsAdvanced {
    /**
     * AI Strategy for Lodestone bots: stationary or slow drift, constantly pulling nearby entities towards itself.
     * @param {Bot} bot - The lodestone bot entity.
     * @param {Array} entities - List of all entities in the game.
     * @param {Array} foods - List of all food items.
     * @param {Function} wanderFn - Fallback wandering function.
     */
    static thinkLodestone(bot, entities, foods, wanderFn) {
        // Slow drift
        wanderFn(bot, foods);

        const range = 500 + bot.radius;
        const pullStrength = 0.3;

        const applyPull = (items) => {
            if (!items) return;
            items.forEach(entity => {
                if (entity === bot || entity.markedForDeletion) return;
                const dist = Utils.getDistance(bot.x, bot.y, entity.x, entity.y);
                if (dist < range && dist > 0) {
                    const angle = Math.atan2(bot.y - entity.y, bot.x - entity.x);
                    entity.x += Math.cos(angle) * pullStrength * 2;
                    entity.y += Math.sin(angle) * pullStrength * 2;
                    if (entity.velocity !== undefined) {
                         entity.velocity.x += Math.cos(angle) * pullStrength * 0.5;
                         entity.velocity.y += Math.sin(angle) * pullStrength * 0.5;
                    }
                }
            });
        };

        applyPull(entities);
        if (foods && Array.isArray(foods)) applyPull(foods);
        else if (foods && foods.items) applyPull(foods.items);
    }

    /**
     * AI Strategy for Ghoul bots: actively hunt entities with lower mass.
     * @param {Bot} bot - The ghoul bot entity.
     * @param {Array} entities - List of all entities in the game.
     * @param {Array} foods - List of all food items.
     * @param {Function} wanderFn - Fallback wandering function.
     */
    static thinkGhoul(bot, entities, foods, wanderFn) {
        let bestTarget = null;
        let bestScore = -Infinity;
        let threat = null;

        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            const viewRange = 600 + bot.radius;

            if (dist < viewRange) {
                if (other.mass > bot.mass * 1.2) {
                    threat = other;
                } else if (bot.mass > other.mass * 1.1) {
                    const score = other.mass / dist;
                    if (score > bestScore) {
                        bestScore = score;
                        bestTarget = other;
                    }
                }
            }
        });

        if (threat) {
            const angle = Math.atan2(bot.y - threat.y, bot.x - threat.x);
            bot.setTarget(bot.x + Math.cos(angle) * 300, bot.y + Math.sin(angle) * 300);
        } else if (bestTarget) {
            bot.setTarget(bestTarget.x, bestTarget.y);
        } else {
            wanderFn(bot, foods);
        }
    }
}
