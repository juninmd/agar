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

                    // Directly move the entity (overriding typical velocity handling slightly)
                    // We just need it to get closer.
                    entity.x += Math.cos(angle) * pullStrength * 2;
                    entity.y += Math.sin(angle) * pullStrength * 2;

                    if (entity.velocity !== undefined) {
                         // Dampen their escape velocity if they try to run away
                         entity.velocity.x += Math.cos(angle) * pullStrength * 0.5;
                         entity.velocity.y += Math.sin(angle) * pullStrength * 0.5;
                    }
                }
            });
        };

        applyPull(entities);
        if (foods && Array.isArray(foods)) {
            applyPull(foods);
        } else if (foods && foods.items) {
             applyPull(foods.items);
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

    static thinkGhoul(bot, entities, foods, wanderFn) {
        let bestTarget = null;
        let bestScore = -Infinity;
        let threat = null;

        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            const viewRange = 600 + bot.radius;

            if (dist < viewRange) {
                // Flee from much larger entities
                if (other.mass > bot.mass * 1.2) {
                    threat = other;
                }
                // Hunt smaller entities
                else if (bot.mass > other.mass * 1.1) {
                    const score = other.mass / dist; // Favor high mass, low distance
                    if (score > bestScore) {
                        bestScore = score;
                        bestTarget = other;
                    }
                }
            }
        });

        if (threat) {
            // Flee
            const angle = Math.atan2(bot.y - threat.y, bot.x - threat.x);
            bot.setTarget(bot.x + Math.cos(angle) * 300, bot.y + Math.sin(angle) * 300);
        } else if (bestTarget) {
            // Hunt
            bot.setTarget(bestTarget.x, bestTarget.y);
        } else {
            wanderFn(bot, foods);
        }
    }
}
