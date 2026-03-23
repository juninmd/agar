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
    static thinkMimic(bot, entities, foods) {
        let bestTarget = null;
        let bestScore = -Infinity;
        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            // Only reacts if prey/player is within 300px
            if (dist > CONSTANTS.MIMIC_AGGRO_RANGE) return;

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
            // Stay completely still to mimic a powerup/lore
            bot.setTarget(bot.x, bot.y);
            if (bot.velocity) {
                bot.velocity.x = 0;
                bot.velocity.y = 0;
            }
        }
    }

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

    static thinkMerchant(bot, entities, foods) {
        let threat = null;
        let threatDist = Infinity;

        // Merchant flees if a larger entity comes close
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
            // Flee from threat
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

    static thinkSoulbinder(bot, entities, foods) {
        let bestTarget = null;
        let bestScore = -Infinity;
        entities.forEach(other => {
            if (other === bot) return;
            const dist = Utils.getDistance(bot.x, bot.y, other.x, other.y);
            // Search radius
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
            // Orbital offset to simulate binding instead of directly colliding
            const angle = Math.atan2(bot.y - bestTarget.y, bot.x - bestTarget.x) + 0.1; // Slowly spiral in
            const orbitDist = 100 + bestTarget.radius; // Target distance to hover
            const targetX = bestTarget.x + Math.cos(angle) * orbitDist;
            const targetY = bestTarget.y + Math.sin(angle) * orbitDist;
            bot.setTarget(targetX, targetY);
        } else {
            this.wander(bot, foods);
        }
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

    static thinkIllusionist(bot, entities, foods) {
        let bestTarget = null;
        let bestScore = -Infinity;
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
            this.wander(bot, foods);
        }
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
                // Predictive hunting: intercept smaller prey
                const PREDICTIVE_HUNT_MULTIPLIER = 5; // Or move to a constants file
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
