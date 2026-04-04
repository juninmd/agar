import { Utils } from './utils.js';

export class AIStrategiesAdvanced {
    static thinkSoulbinder(bot, entities, foods, wanderFn) {
        let bestTarget = null;
        let bestScore = -Infinity;
        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            if (dist > (600 + bot.radius)) return;

            if (other.constructor.name === 'Player') {
                bestScore = Infinity;
                bestTarget = other;
            } else if (bestScore !== Infinity && other.radius > bot.radius * 0.5) {
                const score = (other.radius / (dist + 1));
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = other;
                }
            }
        });

        if (bestTarget) {
            const angle = Math.atan2(bot.y - bestTarget.y, bot.x - bestTarget.x) + 0.1;
            const orbitDist = 100 + bestTarget.radius;
            const targetX = bestTarget.x + Math.cos(angle) * orbitDist;
            const targetY = bestTarget.y + Math.sin(angle) * orbitDist;
            bot.setTarget(targetX, targetY);
        } else {
            wanderFn(bot, foods);
        }
    }

    /**
     * AI Strategy for Anomaly bots: occasionally glitches backward in time when threatened.
     * @param {Bot} bot - The bot entity.
     * @param {Array} entities - List of all entities in the game.
     * @param {Array} foods - List of all food items.
     * @param {Function} wanderFn - Fallback wandering function.
     */
    static thinkAnomaly(bot, entities, foods, wanderFn) {
        if (!bot.history) bot.history = [];
        // Record state
        bot.history.push({ x: bot.x, y: bot.y, mass: bot.mass });
        if (bot.history.length > 120) {
            bot.history.shift(); // Keep last ~2 seconds (assuming 60fps)
        }

        let hasThreat = false;
        let threatVector = { x: 0, y: 0 };

        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            const viewRange = 300;
            if (dist > viewRange) return;

            if (other.radius > bot.radius * 1.1) {
                hasThreat = true;
                threatVector.x += (bot.x - other.x) / dist;
                threatVector.y += (bot.y - other.y) / dist;
            }
        });

        if (hasThreat && Math.random() < 0.05 && bot.history.length > 30) {
            // Trigger glitch back in time occasionally when threatened
            const pastState = bot.history[0]; // oldest state
            bot.x = pastState.x;
            bot.y = pastState.y;
            bot.mass = pastState.mass;
            bot.radius = Utils.getRadiusFromMass(bot.mass);
            bot.history = []; // Clear history after rewind

            // Randomize target to flee further after rewinding
            bot.setTarget(bot.x + threatVector.x * 500, bot.y + threatVector.y * 500);
        } else if (hasThreat) {
             bot.setTarget(bot.x + threatVector.x * 200, bot.y + threatVector.y * 200);
        } else {
             wanderFn(bot, foods);
        }
    }

    static thinkIllusionist(bot, entities, foods, wanderFn) {
        let threatVector = { x: 0, y: 0 };
        let hasThreat = false;

        entities.forEach(other => {
            if (other === bot || other.type === 'DECOY') return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            const viewRange = 500 + bot.radius;
            if (dist > viewRange) return;

            if (other.radius > bot.radius * 1.1) {
                hasThreat = true;
                threatVector.x += (bot.x - other.x) / dist;
                threatVector.y += (bot.y - other.y) / dist;
            }
        });

        if (hasThreat) {
            bot.setTarget(bot.x + threatVector.x * 200, bot.y + threatVector.y * 200);
        } else {
            wanderFn(bot, foods);
        }
    }

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
            const angle = time * 2 + (orbitIndex * Math.PI * 2 / 5); // Assuming up to 5 drones usually
            const orbitDist = 100 + bot.swarmOwner.radius;

            const targetX = bot.swarmOwner.x + Math.cos(angle) * orbitDist;
            const targetY = bot.swarmOwner.y + Math.sin(angle) * orbitDist;

            bot.setTarget(targetX, targetY);
        }
    }
}
