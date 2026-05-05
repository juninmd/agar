import { Utils } from '../utils.js';

export class AbilityEffectsCombat {
    static triggerSwarm(player, bots) {
        const DRONE_COUNT = 5;
        for (let i = 0; i < DRONE_COUNT; i++) {
            const drone = new window.Bot(player.x, player.y, 10, player.protocol.color, 'DRONE');
            drone.mass = 50;
            drone.swarmOwner = player;
            drone.droneIndex = i;

            const angle = (i / DRONE_COUNT) * Math.PI * 2;
            drone.x += Math.cos(angle) * (player.radius + 20);
            drone.y += Math.sin(angle) * (player.radius + 20);

            bots.push(drone);
        }

        if (player.mass > 500) {
            player.mass -= 250;
            player.radius = Utils.getRadiusFromMass(player.mass);
        }
    }

    static triggerMirage(player, bots) {
        for (let i = 0; i < 2; i++) {
            const decoy = new window.Bot(player.x, player.y, player.radius, player.color, 'DECOY');
            decoy.mass = player.mass;
            decoy.alpha = 0.5;
            decoy.isDecoy = true;
            decoy.setTarget(player.x + (Math.random() - 0.5) * 500, player.y + (Math.random() - 0.5) * 500);
            bots.push(decoy);
        }
    }

    static triggerSyndicate(player) {
        if (player.mass > 500) {
            player.mass -= 300;
            player.radius = Utils.getRadiusFromMass(player.mass);
            player.applyPowerUp({ id: 'SHIELD', duration: 180, value: 0 });
        }
    }

    static triggerVirus(player, bots) {
        const range = 300 + player.radius;
        bots.forEach(bot => {
            if (Utils.getDistance(player.x, player.y, bot.x, bot.y) < range) {
                bot.frozen = true;
                bot.frozenTimer = 120;
            }
        });
    }

    static updateOutbreak(player, bots, tetheredBots) {
        const range = 400 + player.radius;
        bots.forEach(bot => {
            const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
            if (dist < range && !bot.markedForDeletion) {
                const drain = bot.mass * 0.015;
                if (bot.mass > 10) {
                    bot.mass -= drain;
                    bot.radius = Utils.getRadiusFromMass(bot.mass);
                    player.mass += drain;
                    player.radius = Utils.getRadiusFromMass(player.mass);
                    tetheredBots.push(bot);
                }
            }
        });
    }

    static updateSoulStorm(player, bots, tetheredBots) {
        const range = 400 + player.radius;
        bots.forEach(bot => {
            const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
            if (dist < range && !bot.markedForDeletion) {
                bot.isSlowed = true;
                const drain = 0.5;
                if (bot.mass > 10) {
                    bot.mass -= drain;
                    bot.radius = Utils.getRadiusFromMass(bot.mass);
                    player.mass += drain;
                    player.radius = Utils.getRadiusFromMass(player.mass);
                    tetheredBots.push(bot);
                }
            }
        });
    }
}
