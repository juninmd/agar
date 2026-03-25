import { Utils } from './utils.js';

export class AIStrategiesBasic {
    static thinkMimic(bot, entities, foods) {
        let bestTarget = null;
        let bestScore = -Infinity;
        entities.forEach(other => {
            if (other === bot) return;
            // Assuming CONSTANTS is accessible globally as in other files
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            if (dist > window.CONSTANTS.MIMIC_AGGRO_RANGE) return;

            if (other.radius < bot.radius || other.constructor.name === 'Player') {
                const score = ((other.radius) / (dist + 1)) * bot.typeData.aggression;
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = other;
                }
            }
        });

        if (bestTarget) {
            bot.setTarget(bestTarget.x, bestTarget.y);
        } else {
            bot.setTarget(bot.x, bot.y);
            if (bot.velocity) {
                bot.velocity.x = 0;
                bot.velocity.y = 0;
            }
        }
    }

    static thinkWeaver(bot, entities, foods, wanderFn) {
        let threat = null;
        let threatDist = Infinity;

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
            const dx = bot.x - threat.x;
            const dy = bot.y - threat.y;
            bot.setTarget(bot.x + dx, bot.y + dy);
        } else {
            wanderFn(bot, foods);
        }
    }

    static thinkMerchant(bot, entities, foods, wanderFn) {
        let threat = null;
        let threatDist = Infinity;

        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            if (dist < 400 && other.radius > bot.radius) {
                if (dist < threatDist) {
                    threat = other;
                    threatDist = dist;
                }
            }
        });

        if (threat) {
            const dx = bot.x - threat.x;
            const dy = bot.y - threat.y;
            bot.setTarget(bot.x + dx, bot.y + dy);
        } else {
            wanderFn(bot, foods);
        }
    }

    static thinkVoidWalker(bot, entities, wanderFn) {
        let bestTarget = null;
        entities.forEach(other => {
            if (other === bot) return;
            if (other.constructor.name === 'Player') bestTarget = other;
        });
        if (bestTarget) bot.setTarget(bestTarget.x, bestTarget.y);
        else wanderFn(bot, []);
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
