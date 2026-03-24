import { Utils } from './utils.js';

/**
 * Strategy pattern implementation for different bot behaviors.
 * Encapsulates logic for Normal, Hunter, Corrupter, and Void Walker AI.
 */
export class AIStrategies {
    /**
     * AI logic for Void Walkers: Relentlessly hunts the player, ignoring fear.
     * @param {Bot} bot - The bot instance.
     * @param {Entity[]} entities - List of all entities.
     */
    static thinkWeaver(bot, entities, foods) {
        let threat = null;
        let threatDist = Infinity;

        // Weaver tries to avoid the player if the player is dangerously large
        entities.forEach(other => {
            if (other === bot) return;
            if (other.constructor.name === 'Player') {
                const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
                if (dist < 800 && other.radius > bot.radius * 0.9) {
                    threat = other;
                    threatDist = dist;
                }
            }
        });

        if (threat) {
            // Flee from player
            const dx = bot.x - threat.x;
            const dy = bot.y - threat.y;
            bot.setTarget(bot.x + dx, bot.y + dy);
        } else {
            this.wander(bot, foods);
        }
    }

    static thinkVoidWalker(bot, entities) {
        let bestTarget = null;
        entities.forEach(other => {
            if (other === bot) return;
            if (other.constructor.name === 'Player') bestTarget = other;
        });
        if (bestTarget) bot.setTarget(bestTarget.x, bestTarget.y);
        else this.wander(bot, []);
    }

    static thinkCorrupter(bot, entities, foods) {
        let bestTarget = null;
        let bestScore = -Infinity;
        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            if (dist > (500 + bot.radius) * 3.0) return;
            if (other.radius > bot.radius) {
                const score = ((other.radius) / (dist + 1));
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = other;
                }
            }
        });
        if (bestTarget) bot.setTarget(bestTarget.x, bestTarget.y);
        else this.wander(bot, foods);
    }

    static thinkHunter(bot, entities, foods) {
        let bestTarget = null;
        let bestScore = -Infinity;
        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            if (other.constructor.name === 'Player') {
                bestTarget = other;
                bestScore = Infinity;
            } else if (bestScore !== Infinity && other.radius < bot.radius) {
                const score = ((other.radius) / (dist + 1)) * 5.0;
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = other;
                }
            }
        });
        if (bestTarget) bot.setTarget(bestTarget.x, bestTarget.y);
        else this.wander(bot, foods);
    }

    static thinkNormal(bot, entities, foods) {
        let bestTarget = null;
        let bestScore = -Infinity;
        let threatVector = { x: 0, y: 0 };
        let hasThreat = false;
        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            const viewRange = (500 + bot.radius) * Math.max(0.5, bot.typeData.aggression);
            if (dist > viewRange) return;

            if (other.radius > bot.radius * 1.1) {
                hasThreat = true;
                // Predictive dodging: calculate future position if velocity exists
                const PREDICTIVE_DODGE_MULTIPLIER = 10; // Or move to a constants file
                const PREDICTIVE_DODGE_MULTIPLIER = 10; // Or move to a constants file
                let futureX = other.x;
                let futureY = other.y;
                if (other.velocity) {
                    futureX += other.velocity.x * PREDICTIVE_DODGE_MULTIPLIER;
                    futureY += other.velocity.y * PREDICTIVE_DODGE_MULTIPLIER;
                }
                }
                }
                }
                }
                }
                }
                const PREDICTIVE_HUNT_MULTIPLIER = 5; // Or move to a constants file
                let futureX = other.x;
                let futureY = other.y;
                if (other.velocity) {
                    futureX += other.velocity.x * PREDICTIVE_HUNT_MULTIPLIER;
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                    futureY += other.velocity.y * PREDICTIVE_HUNT_MULTIPLIER;
                }
                const futureDist = Math.max(1, Utils.getDistance(bot.x, bot.y, futureX, futureY));
                const score = ((other.radius) / (futureDist + 1)) * bot.typeData.aggression;
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = other;
                }
            }
        });
        if (hasThreat) bot.setTarget(bot.x + threatVector.x * 100, bot.y + threatVector.y * 100);
        else if (bestTarget) bot.setTarget(bestTarget.x, bestTarget.y);
        else this.wander(bot, foods);
    }

    static wander(bot, foods) {
        let closestFood = null;
        let minFoodDist = Infinity;
        for (let i = 0; i < 20; i++) {
            const randomFood = foods[Math.floor(Math.random() * foods.length)];
            if (!randomFood) continue;
            const d = Utils.getDistance(bot.x, bot.y, randomFood.x, randomFood.y);
            if (d < minFoodDist) {
                minFoodDist = d;
                closestFood = randomFood;
            }
        }
        if (closestFood && minFoodDist < 300) bot.setTarget(closestFood.x, closestFood.y);
        else {
            bot.changeDirTimer--;
            if (bot.changeDirTimer <= 0) {
                const angle = Math.random() * Math.PI * 2;
                bot.setTarget(bot.x + Math.cos(angle) * 200, bot.y + Math.sin(angle) * 200);
                bot.changeDirTimer = Utils.randomRange(20, 60);
            }
        }
    }
}
