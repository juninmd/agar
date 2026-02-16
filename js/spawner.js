import { Food } from './food.js';
import { PowerUp } from './powerup.js';
import { LoreFragment } from './lore_fragment.js';
import { Bot } from './bot.js';
import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';

export class Spawner {
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

    static spawnBot() {
        const types = Object.keys(CONSTANTS.BOT_TYPES).filter(k => k !== 'NORMAL');
        const type = types[Math.floor(Math.random() * types.length)];
        // 20% chance for special bot, else NORMAL
        const finalType = (Math.random() < 0.2) ? type : 'NORMAL';

        return new Bot(Utils.randomRange(0, CONSTANTS.WORLD_WIDTH), Utils.randomRange(0, CONSTANTS.WORLD_HEIGHT), CONSTANTS.INITIAL_RADIUS, Utils.randomColor(CONSTANTS.COLORS), finalType);
    }

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
}
