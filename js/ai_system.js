import { Utils } from './utils.js';

export class AISystem {
    static think(bot, entities, foods) {
        let bestTarget = null;
        let bestScore = -Infinity;
        let threatVector = { x: 0, y: 0 };
        let hasThreat = false;

        entities.forEach(other => {
            if (other === bot) return;

            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);

            // Vision range scaled by aggression
            const viewRange = (500 + bot.radius) * Math.max(0.5, bot.typeData.aggression);
            if (dist > viewRange) return;

            // Special Logic for CORRUPTER (Trojan Horse)
            if (bot.type === 'CORRUPTER') {
                // Seek LARGER entities to infect/destroy
                if (other.radius > bot.radius) {
                    const score = ((other.radius) / (dist + 1)) * bot.typeData.aggression;
                    if (score > bestScore) {
                        bestScore = score;
                        bestTarget = other;
                    }
                }
            } else if (bot.type === 'ELITE_HUNTER') {
                // Elite Hunters prioritize the player above all else
                if (other.constructor.name === 'Player') {
                    bestTarget = other;
                    bestScore = Infinity; // Override any other target
                } else if (bestScore !== Infinity && other.radius < bot.radius) {
                     // Secondary targets: smaller bots if player not found yet
                     const score = ((other.radius) / (dist + 1)) * bot.typeData.aggression;
                     if (score > bestScore) {
                         bestScore = score;
                         bestTarget = other;
                     }
                }
            } else {
                // Standard Logic
                if (other.radius > bot.radius * 1.1) {
                    // Threat
                    hasThreat = true;
                    const dx = bot.x - other.x;
                    const dy = bot.y - other.y;
                    threatVector.x += dx / dist;
                    threatVector.y += dy / dist;
                } else if (other.radius * 1.1 < bot.radius) {
                    // Prey
                    const score = ((other.radius) / (dist + 1)) * bot.typeData.aggression;
                    if (score > bestScore) {
                        bestScore = score;
                        bestTarget = other;
                    }
                }
            }
        });

        if (hasThreat) {
            bot.setTarget(bot.x + threatVector.x * 100, bot.y + threatVector.y * 100);
        } else if (bestTarget) {
            bot.setTarget(bestTarget.x, bestTarget.y);
        } else {
            AISystem.wander(bot, foods);
        }
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

        if (closestFood && minFoodDist < 300) {
            bot.setTarget(closestFood.x, closestFood.y);
        } else {
            bot.changeDirTimer--;
            if (bot.changeDirTimer <= 0) {
                const angle = Math.random() * Math.PI * 2;
                const wanderDist = 200;
                bot.setTarget(bot.x + Math.cos(angle) * wanderDist, bot.y + Math.sin(angle) * wanderDist);
                bot.changeDirTimer = Utils.randomRange(20, 60);
            }
        }
    }
}
