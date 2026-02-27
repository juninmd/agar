import { Boss } from './boss.js';
import { Utils } from './utils.js';
import { Spawner } from './spawner.js';

/**
 * Represents the Null Void Titan, a massive Raid Boss entity.
 * Features custom minion spawning mechanics and visual overrides.
 */
export class NullVoidTitan extends Boss {
    /**
     * @param {number} x - Initial X coordinate.
     * @param {number} y - Initial Y coordinate.
     */
    constructor(x, y) {
        super(x, y);
        this.type = 'TITAN';
        this.color = '#000000'; // Pure Black core
        this.mass = 15000; // Massive
        this.radius = Utils.getRadiusFromMass(this.mass);
        this.name = "NULL_TITAN";

        // Titan Stats
        this.shields = 0; // No shields, just raw mass
        this.spawnTimer = 0;
        this.maxSpawnTimer = 300; // 5 seconds

        // Override speed
        this.speedBoost = 0.4; // Very slow
    }

    /**
     * Updates the Titan's state, including movement and minion spawning.
     * @param {number} worldWidth
     * @param {number} worldHeight
     * @param {Array} entities
     * @param {Array} foods
     * @param {Game} game
     */
    update(worldWidth, worldHeight, entities, foods, game) {
        // Basic movement towards player (inherited from Boss/Bot)
        super.update(worldWidth, worldHeight, entities, foods);

        // Custom Titan Logic
        this._manageSpawning(game);

        // Force very slow movement
        this.speedBoost = 0.4;
    }

    /**
     * Internal timer management for minion spawning.
     * @param {Game} game
     */
    _manageSpawning(game) {
        this.spawnTimer++;
        if (this.spawnTimer >= this.maxSpawnTimer) {
            this.spawnTimer = 0;
            this._spawnMinions(game);
        }
    }

    /**
     * Spawns Void Walker minions around the Titan.
     * @param {Game} game
     */
    _spawnMinions(game) {
        const minionCount = 3;
        for (let i = 0; i < minionCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = this.radius + 50;
            const mx = this.x + Math.cos(angle) * dist;
            const my = this.y + Math.sin(angle) * dist;

            // Spawn Void Walkers as minions
            const minion = Spawner.spawnVoidWalker(game.player);
            minion.x = mx;
            minion.y = my;
            minion.mass = 500; // Smaller minions
            minion.radius = Utils.getRadiusFromMass(500);

            game.bots.push(minion);
            game.particleSystem.emit(mx, my, '#000000', 10);
        }
    }

    draw(ctx) {
        // Visuals delegated to VisualEffects -> BossVisuals
    }
}
