import { Utils } from './utils.js';

export class AIStrategiesExtra {
    static thinkDrone(bot, entities, foods, wanderFn) {
        if (!bot.swarmOwner) { wanderFn(bot, foods); return; }
        const ownerDist = Utils.getDistance(bot.x, bot.y, bot.swarmOwner.x, bot.swarmOwner.y);
        if (ownerDist > 400 + bot.swarmOwner.radius) { bot.setTarget(bot.swarmOwner.x, bot.swarmOwner.y); return; }

        let bestTarget = null;
        let bestScore = -Infinity;

        entities.forEach(other => {
            if (other === bot || other === bot.swarmOwner || other.type === 'DRONE' || other.swarmOwner === bot.swarmOwner) return;
            const distToOwner = Utils.getDistance(bot.swarmOwner.x, bot.swarmOwner.y, other.x, other.y);
            if (distToOwner < 500 + bot.swarmOwner.radius) {
                const score = (1000 - distToOwner) / (other.radius + 1);
                if (score > bestScore) { bestScore = score; bestTarget = other; }
            }
        });

        if (bestTarget) {
            bot.setTarget(bestTarget.x, bestTarget.y);
        } else {
            const time = Date.now() * 0.001;
            const orbitIndex = bot.droneIndex || 0;
            const angle = time * 2 + (orbitIndex * Math.PI * 2 / 5);
            const orbitDist = 100 + bot.swarmOwner.radius;
            bot.setTarget(bot.swarmOwner.x + Math.cos(angle) * orbitDist, bot.swarmOwner.y + Math.sin(angle) * orbitDist);
        }
    }

    static thinkFragmenter(bot, entities) {
        let nearestThreat = null;
        let minThreatDist = Infinity;
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];
            if (e === bot || e.type === 'FRAGMENTER') continue;
            if (e.mass > bot.mass * 1.1) {
                const dist = Utils.getDistance(bot.x, bot.y, e.x, e.y);
                if (dist < 400 && dist < minThreatDist) {
                    minThreatDist = dist;
                    nearestThreat = e;
                }
            }
        }
        if (nearestThreat) {
            bot.targetX = bot.x + (bot.x - nearestThreat.x);
            bot.targetY = bot.y + (bot.y - nearestThreat.y);
        } else if (!bot.targetX || Math.random() < 0.02) {
            bot.targetX = bot.x + (Math.random() - 0.5) * 200;
            bot.targetY = bot.y + (Math.random() - 0.5) * 200;
        }
    }
}
