import { Utils } from '../utils.js';

export class AbilityEffectsCombat2 {
    static triggerNexus(player, bots) {
        const range = 400 + player.radius;
        if (player.mass > 250) {
            player.mass -= 200;
            player.radius = Utils.getRadiusFromMass(player.mass);

            bots.forEach(bot => {
                const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
                if (dist < range && !bot.markedForDeletion) {
                    const damage = bot.mass * 0.3;
                    bot.mass = Math.max(10, bot.mass - damage);
                    bot.radius = Utils.getRadiusFromMass(bot.mass);

                    if (dist > 0) {
                        const pushPower = 40;
                        bot.x += ((bot.x - player.x) / dist) * pushPower;
                        bot.y += ((bot.y - player.y) / dist) * pushPower;
                    }
                    bot.isSlowed = true;
                }
            });
        }
    }

    static triggerForge(player, bots) {
        if (player.mass <= 150) return false;
        const range = 400 + player.radius;
        player.mass -= 100;
        player.radius = Utils.getRadiusFromMass(player.mass);

        bots.forEach(bot => {
            const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
            if (dist < range && !bot.markedForDeletion) {
                if (typeof bot.applyPowerUp === 'function') {
                    bot.applyPowerUp({ id: 'SHIELD', duration: 300, value: 0 });
                }
            }
        });
        return true;
    }

    static triggerSynapse(player, bots, cost = 100) {
        if (player.mass <= cost) return false;
        player.mass -= cost;
        player.radius = Utils.getRadiusFromMass(player.mass);
        bots.forEach(bot => {
            const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
            if (dist < 400 + player.radius) {
                bot.confusedTimer = 180;
            }
        });
        return true;
    }

    static triggerKinetic(player, bots) {
        if (player.mass <= 100) return false;
        player.mass -= 50;
        player.radius = Utils.getRadiusFromMass(player.mass);

        const range = 500 + player.radius;
        const pushPower = 150;

        bots.forEach(bot => {
            const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
            if (dist < range && !bot.markedForDeletion) {
                if (dist > 0) {
                    bot.x += ((bot.x - player.x) / dist) * pushPower;
                    bot.y += ((bot.y - player.y) / dist) * pushPower;
                    bot.isSlowed = true;
                }
            }
        });

        player.speedBoost = Math.max(player.speedBoost || 1.0, 2.5);
        return true;
    }

    static updateVampyr(player, bots, tetheredBots) {
        const range = 400 + player.radius;
        const drainAmount = 1.5;

        bots.forEach(bot => {
            if (bot.markedForDeletion) return;
            const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
            if (dist < range) {
                if (bot.type === 'DECOY' || bot.type === 'MERCHANT' || bot.type === 'SMITH') return;

                bot.mass -= drainAmount;
                if (bot.mass < 20) bot.markedForDeletion = true;
                bot.radius = Utils.getRadiusFromMass(bot.mass);

                player.mass += drainAmount;
                player.radius = Utils.getRadiusFromMass(player.mass);

                bot.isSlowed = true;
                if (tetheredBots) tetheredBots.push(bot);
            }
        });
    }
}
