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

    static thinkCorrupter(bot, entities, foods, wanderFn) {
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
        else wanderFn(bot, foods);
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

    static thinkHunter(bot, entities, foods, wanderFn) {
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
        else wanderFn(bot, foods);
    }

    static thinkNormal(bot, entities, foods, wanderFn) {
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
                const PREDICTIVE_DODGE_MULTIPLIER = 10;
                let futureX = other.x;
                let futureY = other.y;
                if (other.velocity) {
                    futureX += other.velocity.x * PREDICTIVE_DODGE_MULTIPLIER;
                    futureY += other.velocity.y * PREDICTIVE_DODGE_MULTIPLIER;
                }
                const futureDist = Math.max(1, Utils.getDistance(bot.x, bot.y, futureX, futureY));
                threatVector.x += (bot.x - futureX) / futureDist;
                threatVector.y += (bot.y - futureY) / futureDist;
            } else if (other.radius * 1.1 < bot.radius) {
                const PREDICTIVE_HUNT_MULTIPLIER = 5;
                let futureX = other.x;
                let futureY = other.y;
                if (other.velocity) {
                    futureX += other.velocity.x * PREDICTIVE_HUNT_MULTIPLIER;
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
        else wanderFn(bot, foods);
    }
}
