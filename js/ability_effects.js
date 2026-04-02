import { Utils } from './utils.js';

export class AbilityEffects {
    /**
     * Triggers the Chronos time rewind ability, reverting the player to a previous state.
     * @param {Player} player - The player entity triggering the ability.
     */
    static triggerChronos(player) {
        if (player.history && player.history.length > 0) {
            const pastState = player.history[0]; // oldest state
            player.x = pastState.x;
            player.y = pastState.y;
            player.mass = pastState.mass;
            player.radius = Utils.getRadiusFromMass(player.mass);
            player.history = []; // Clear history after rewind
            // Briefly invincible after rewinding to prevent instant re-death
            player.applyPowerUp({ id: 'SHIELD', duration: 60, value: 0 });
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

    static triggerArchitect(bots) {
        bots.forEach(bot => {
            bot.frozen = true;
            bot.frozenTimer = 300;
        });
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
