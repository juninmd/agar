import { Food } from './food.js';
import { PowerUp } from './powerup.js';
import { LoreFragment } from './lore_fragment.js';
import { Bot } from './bot.js';
import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';

/**
 * Handles spawning of all game entities.
 */
export class Spawner {
    /**
     * Spawns a food item, powerup, or lore fragment.
     * @returns {Food|PowerUp|LoreFragment}
     */
    static spawnFood() {
        const x = Utils.randomRange(0, CONSTANTS.WORLD_WIDTH);
        const y = Utils.randomRange(0, CONSTANTS.WORLD_HEIGHT);
        const rand = Math.random();
        if (rand < 0.005) return new LoreFragment(x, y);
        if (rand < 0.015) {
            const keys = Object.keys(CONSTANTS.POWERUP_TYPES);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            return new PowerUp(x, y, randomKey);
        }
        return new Food(x, y, Utils.randomRange(CONSTANTS.MIN_FOOD_RADIUS, CONSTANTS.MAX_FOOD_RADIUS), Utils.randomColor(CONSTANTS.COLORS));
    }

    /**
     * Spawns a random bot.
     * @returns {Bot}
     */
    static spawnBot() {
        const types = Object.keys(CONSTANTS.BOT_TYPES).filter(k => k !== 'NORMAL' && k !== 'ELITE_HUNTER' && k !== 'SENTINEL');
        const type = types[Math.floor(Math.random() * types.length)];
        // 20% chance for special bot, else NORMAL
        const finalType = (Math.random() < 0.2) ? type : 'NORMAL';

        return new Bot(Utils.randomRange(0, CONSTANTS.WORLD_WIDTH), Utils.randomRange(0, CONSTANTS.WORLD_HEIGHT), CONSTANTS.INITIAL_RADIUS, Utils.randomColor(CONSTANTS.COLORS), finalType);
    }

    /**
     * Spawns an Elite Hunter for the Purge event.
     * @param {Player} player
     * @param {number} angle
     * @param {number} distance
     * @returns {Bot}
     */
    static spawnPurgeBot(player, angle, distance) {
        let sx = player.x + Math.cos(angle) * distance;
        let sy = player.y + Math.sin(angle) * distance;
        sx = Math.max(0, Math.min(CONSTANTS.WORLD_WIDTH, sx));
        sy = Math.max(0, Math.min(CONSTANTS.WORLD_HEIGHT, sy));

        // Use ELITE_HUNTER type
        const mass = Math.max(500, player.mass * 1.1);
        const radius = Utils.getRadiusFromMass(mass);

        const bot = new Bot(sx, sy, radius, '#FFFFFF', 'ELITE_HUNTER');
        bot.mass = mass;
        bot.radius = radius;
        bot.isGlitching = true;
        return bot;
    }

    /**
     * Spawns a Void Walker minion for the Titan.
     * @param {Player} player - The player to target.
     * @returns {Bot}
     */
    static spawnVoidWalker(player) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 600 + Math.random() * 400;
        let sx = player.x + Math.cos(angle) * dist;
        let sy = player.y + Math.sin(angle) * dist;
        sx = Math.max(0, Math.min(CONSTANTS.WORLD_WIDTH, sx));
        sy = Math.max(0, Math.min(CONSTANTS.WORLD_HEIGHT, sy));

        // Void Walkers scale with player to be deadly threats
        const mass = Math.max(100, player.mass * 1.2);
        const radius = Utils.getRadiusFromMass(mass);

        const bot = new Bot(sx, sy, radius, CONSTANTS.BOT_TYPES.VOID_WALKER.color, 'VOID_WALKER');
        bot.mass = mass;
        bot.radius = radius;
        return bot;
    }

    /**
     * Spawns ejected mass chunks behind the player after dashing.
     * @param {Player} player - The player ejecting mass.
     * @param {number} ejectedMass - Total mass to split into shards.
     * @param {Array} foodsArray - The global foods array to push new entities into.
     */
    static spawnEjectedMass(player, ejectedMass, foodsArray) {
        const speed = Math.hypot(player.velocity.x, player.velocity.y);
        let nx = speed > 0 ? -player.velocity.x / speed : Math.cos(Math.random() * Math.PI * 2);
        let ny = speed > 0 ? -player.velocity.y / speed : Math.sin(Math.random() * Math.PI * 2);

        const shardCount = 3;
        const massPerShard = ejectedMass / shardCount;
        const radiusPerShard = Utils.getRadiusFromMass(massPerShard);

        for (let i = 0; i < shardCount; i++) {
            const offsetAngle = (Math.random() - 0.5) * 0.5; // slight spread
            const pushX = nx * Math.cos(offsetAngle) - ny * Math.sin(offsetAngle);
            const pushY = nx * Math.sin(offsetAngle) + ny * Math.cos(offsetAngle);

            const spawnX = player.x + pushX * (player.radius + radiusPerShard + 15);
            const spawnY = player.y + pushY * (player.radius + radiusPerShard + 15);

            // Create new Food, and set its mass equivalent to the shard (since its radius will represent it in collisions)
            const shard = new Food(spawnX, spawnY, radiusPerShard, player.color);
            foodsArray.push(shard);
        }
    }
}
