import { Utils } from './utils.js';

/**
 * Physics-based AI strategies for specialized bots.
 */
export class AIStrategiesPhysics {
    static thinkSmith(bot, entities, foods, wanderFn) {
        let bestTarget = null;
        let bestDist = Infinity;
        entities.forEach(other => {
            if (other === bot || other.type === 'SMITH' || other.isPlayer) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            if (dist < 600 + bot.radius && dist < bestDist) {
                bestDist = dist;
                bestTarget = other;
            }
        });

        if (bestTarget) {
            bot.setTarget(bestTarget.x, bestTarget.y);
            if (bestDist < bot.radius + bestTarget.radius + 50 && typeof bestTarget.applyPowerUp === 'function') {
                bestTarget.applyPowerUp({ id: 'SHIELD', duration: 180, value: 0 });
            }
        } else {
            wanderFn(bot, foods);
        }
    }

    static thinkBumper(bot, entities, foods, wanderFn) {
        let bestTarget = null;
        let bestScore = -Infinity;
        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            // Bumper wants to collide with things, so it targets nearby entities
            // It particularly likes targeting larger entities to bounce off them
            if (dist < 800) {
                const score = (other.radius * 2) - dist; // Prefer large, close targets
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = other;
                }
            }
        });

        if (bestTarget) {
            bot.setTarget(bestTarget.x, bestTarget.y);
        } else {
            wanderFn(bot, foods);
        }
    }

    /**
     * AI Strategy for Ghoul bots: actively hunt entities with lower mass.
     * @param {Bot} bot - The ghoul bot entity.
     * @param {Array} entities - List of all entities in the game.
     * @param {Array} foods - List of all food items.
     * @param {Function} wanderFn - Fallback wandering function.
     */
    static thinkTank(bot, entities, foods, wanderFn) {
        let bestTarget = null;
        let bestScore = -Infinity;

        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            const viewRange = 500 + bot.radius;

            if (dist < viewRange) {
                // Ignore small targets completely
                if (other.mass < bot.mass * 0.3) return;

                // Move towards anything that isn't too small, but favor large things
                const score = other.mass / dist;
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = other;
                }
            }
        });

        if (bestTarget) {
            bot.setTarget(bestTarget.x, bestTarget.y);
        } else {
            wanderFn(bot, foods);
        }
    }
}
