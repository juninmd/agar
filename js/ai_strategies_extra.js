import { Utils } from './utils.js';

/**
 * Extra AI strategies for specialized bots, broken out to maintain file size limits.
 */
export class AIStrategiesExtra {
    /**
     * AI Strategy for Drone bots: orbit their swarm owner and attack nearby threats.
     * @param {Bot} bot - The drone bot entity.
     * @param {Array} entities - List of all entities in the game.
     * @param {Array} foods - List of all food items.
     * @param {Function} wanderFn - Fallback wandering function.
     */
    static thinkDrone(bot, entities, foods, wanderFn) {
        if (!bot.swarmOwner) {
            wanderFn(bot, foods);
            return;
        }

        const ownerDist = Utils.getDistance(bot.x, bot.y, bot.swarmOwner.x, bot.swarmOwner.y);

        // If too far from owner, fly back
        if (ownerDist > 400 + bot.swarmOwner.radius) {
            bot.setTarget(bot.swarmOwner.x, bot.swarmOwner.y);
            return;
        }

        // Find enemies near owner
        let bestTarget = null;
        let bestScore = -Infinity;

        entities.forEach(other => {
            if (other === bot || other === bot.swarmOwner || other.type === 'DRONE' || other.swarmOwner === bot.swarmOwner) return;

            const distToOwner = Utils.getDistance(bot.swarmOwner.x, bot.swarmOwner.y, other.x, other.y);
            if (distToOwner < 500 + bot.swarmOwner.radius) {
                // Prioritize smaller entities to consume, or simply attack anything near owner
                const score = (1000 - distToOwner) / (other.radius + 1);
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = other;
                }
            }
        });

        if (bestTarget) {
            bot.setTarget(bestTarget.x, bestTarget.y);
        } else {
            // Orbit the owner
            const time = Date.now() * 0.001;
            const orbitIndex = bot.droneIndex || 0;
            const angle = time * 2 + (orbitIndex * Math.PI * 2 / 5);
            const orbitDist = 100 + bot.swarmOwner.radius;

            const targetX = bot.swarmOwner.x + Math.cos(angle) * orbitDist;
            const targetY = bot.swarmOwner.y + Math.sin(angle) * orbitDist;

            bot.setTarget(targetX, targetY);
        }
    }

    /**
     * AI Strategy for Oracle bots: perfectly stationary, applying a slow effect (time dilation) to nearby entities.
     * @param {Bot} bot - The oracle bot entity.
     * @param {Array} entities - List of all entities in the game.
     * @param {Array} foods - List of all food items.
     * @param {Function} wanderFn - Fallback wandering function (unused here).
     */
    static thinkOracle(bot, entities, foods, wanderFn) {
        // Remain perfectly stationary
        bot.setTarget(bot.x, bot.y);

        // Apply time dilation field (slow effect) to nearby entities
        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            const effectRange = 200 + bot.radius;
            if (dist < effectRange) {
                other.isSlowed = true;
            }
        });
    }

    /**
     * AI Strategy for Fragmenter bots: erratic evasion when threatened.
     * @param {Bot} bot - The fragmenter bot entity.
     * @param {Array} entities - List of all entities in the game.
     * @param {Array} foods - List of all food items.
     * @param {Function} wanderFn - Fallback wandering function.
     */
    static thinkFragmenter(bot, entities, foods, wanderFn) {
        let hasThreat = false;
        let threatVector = { x: 0, y: 0 };

        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            const viewRange = 400 + bot.radius;
            if (dist > viewRange) return;

            if (other.radius > bot.radius * 1.1) {
                hasThreat = true;
                threatVector.x += (bot.x - other.x) / dist;
                threatVector.y += (bot.y - other.y) / dist;
            }
        });

        if (hasThreat) {
            // Erratic evasion: slightly randomize the flee vector
            const angle = Math.atan2(threatVector.y, threatVector.x) + (Math.random() - 0.5);
            bot.setTarget(bot.x + Math.cos(angle) * 300, bot.y + Math.sin(angle) * 300);
        } else {
            wanderFn(bot, foods);
        }
    }

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
}
