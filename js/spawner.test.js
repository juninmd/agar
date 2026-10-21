import { describe, it, expect } from 'vitest';
import { Spawner } from './spawner.js';
import { Utils } from './utils.js';

describe('Spawner.spawnBot', () => {
    it('keeps new bots away from the avoided position', () => {
        const avoid = { x: 1500, y: 1500 };
        for (let i = 0; i < 200; i++) {
            const bot = Spawner.spawnBot(avoid, 700);
            expect(Utils.getDistance(bot.x, bot.y, avoid.x, avoid.y)).toBeGreaterThanOrEqual(700);
        }
    });

    it('still spawns anywhere when nothing is avoided', () => {
        expect(Spawner.spawnBot()).toBeDefined();
    });
});
