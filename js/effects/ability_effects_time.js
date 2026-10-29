import { Utils } from '../utils.js';

export class AbilityEffectsTime {
    static triggerCypher(player, bots) {
        player.speedBoost = 2.0;
        bots.forEach(bot => {
            bot.isSlowed = true;
        });
    }

    static triggerArchitect(bots) {
        bots.forEach(bot => {
            bot.frozen = true;
            bot.frozenTimer = 300;
        });
    }

    static updateChronos(player) {
        if (!player.history) player.history = [];
        player.history.push({ x: player.x, y: player.y, mass: player.mass });
        if (player.history.length > 300) {
            player.history.shift();
        }
    }

    static triggerChronos(player) {
        if (player.history && player.history.length > 0) {
            const pastState = player.history[0];
            player.x = pastState.x;
            player.y = pastState.y;
            player.mass = pastState.mass;
            player.radius = Utils.getRadiusFromMass(player.mass);
            player.history = [];
            player.applyPowerUp({ id: 'SHIELD', duration: 60, value: 0 });
        }
    }

    static triggerAeon(player) {
        if (player.hasAnchor && player.anchorState) {
            player.x = player.anchorState.x;
            player.y = player.anchorState.y;
            player.mass = player.anchorState.mass;
            player.radius = Utils.getRadiusFromMass(player.mass);
            player.hasAnchor = false;
            player.applyPowerUp({ id: 'SHIELD', duration: 180, value: 0 });
        } else {
            player.hasAnchor = true;
            player.anchorState = { x: player.x, y: player.y, mass: player.mass };
        }
    }

    static updateMagnetar(player, bots, foods = []) {
        const range = 600 + player.radius;
        const pullStrength = 0.5;

        const applyPull = (entities) => {
            entities.forEach(entity => {
                if (entity.markedForDeletion) return;
                const dist = Utils.getDistance(player.x, player.y, entity.x, entity.y);
                if (dist < range && dist > 0) {
                    const angle = Math.atan2(player.y - entity.y, player.x - entity.x);
                    entity.x += Math.cos(angle) * pullStrength * 3;
                    entity.y += Math.sin(angle) * pullStrength * 3;
                    if (entity.isSlowed !== undefined) {
                        entity.isSlowed = true;
                    }
                }
            });
        };

        applyPull(bots);
        applyPull(foods);
    }


    static triggerHarvest(player, foods) {
        const range = 600 + player.radius;
        let addedMass = 0;
        foods.forEach(food => {
            if (!food.markedForDeletion) {
                const dist = Utils.getDistance(player.x, player.y, food.x, food.y);
                if (dist < range) {
                    food.markedForDeletion = true;
                    addedMass += Math.PI * food.radius * food.radius;
                }
            }
        });
        if (addedMass > 0) {
            player.grow(addedMass);
        }
    }

    static triggerSpecter(player) {
        player.isTangible = false;
        player.alpha = 0.3;
    }

    static triggerQuantum(player, bots) {
        // Find the closest entangled bot (or any bot if none found, to make it somewhat useful,
        // but ideally entangled bots). Let's search for ENTANGLED type bots.
        let targetBot = null;
        let minTargetDist = Infinity;
        let anyBot = null;
        let minAnyDist = Infinity;

        bots.forEach(bot => {
            if (bot.markedForDeletion) return;
            const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
            if (bot.type === 'ENTANGLED' && dist < minTargetDist) {
                targetBot = bot;
                minTargetDist = dist;
            }
            if (dist < minAnyDist) {
                anyBot = bot;
                minAnyDist = dist;
            }
        });

        const target = targetBot || anyBot;
        if (target) {
            // Swap positions
            const tempX = player.x;
            const tempY = player.y;
            player.x = target.x;
            player.y = target.y;
            target.x = tempX;
            target.y = tempY;

            player.applyPowerUp({ id: 'SHIELD', duration: 60, value: 0 }); // Temporary invulnerability after teleport
        }
    }
}
