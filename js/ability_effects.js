import { Utils } from './utils.js';

export class AbilityEffects {
    /**
     * Triggers the Aeon time anchor ability.
     * @param {Player} player - The player entity triggering the ability.
     */
    static triggerAeon(player) {
        if (player.hasAnchor && player.anchorState) {
            // Teleport back
            player.x = player.anchorState.x;
            player.y = player.anchorState.y;
            player.mass = player.anchorState.mass;
            player.radius = Utils.getRadiusFromMass(player.mass);
            player.hasAnchor = false;
            // Shield for 3 seconds
            player.applyPowerUp({ id: 'SHIELD', duration: 180, value: 0 });
        } else {
            // Set anchor
            player.hasAnchor = true;
            player.anchorState = { x: player.x, y: player.y, mass: player.mass };
        }
    }

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

    static triggerSwarm(player, bots) {
        // Spawn 5 drones
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

        // Player loses mass to spawn drones
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

    /**
     * Triggers the Nexus Crystal Shatter ability, damaging and pushing back nearby bots.
     * @param {Player} player - The player entity triggering the ability.
     * @param {Array} bots - List of all bots in the game.
     */
    static triggerNexus(player, bots) {
        const range = 400 + player.radius;
        // Cost of the ability: 200 mass
        if (player.mass > 250) {
            player.mass -= 200;
            player.radius = Utils.getRadiusFromMass(player.mass);

            bots.forEach(bot => {
                const dist = Utils.getDistance(player.x, player.y, bot.x, bot.y);
                if (dist < range && !bot.markedForDeletion) {
                    // Shatter effect: reduce mass and push back
                    const damage = bot.mass * 0.3;
                    bot.mass = Math.max(10, bot.mass - damage);
                    bot.radius = Utils.getRadiusFromMass(bot.mass);

                    // Push back logic
                    if (dist > 0) {
                        const pushPower = 40;
                        bot.x += ((bot.x - player.x) / dist) * pushPower;
                        bot.y += ((bot.y - player.y) / dist) * pushPower;
                    }

                    // Optional: You'd want to emit particles here but we don't have particle system access easily in this static function
                    // unless we pass game/particle system. So we'll skip direct particles here or handle via visuals later.
                    bot.isSlowed = true; // Temporary effect
                }
            });
        }
    }
}
