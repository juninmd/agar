import { Food } from '../food.js';
import { Utils } from '../utils.js';
import { CONSTANTS } from '../constants.js';
import { Spawner } from '../spawner.js';

/**
 * Handles all macroscopic collision logic between entities, foods, and rifts
 * using a grid-based spatial hashing algorithm.
 */
export class GameCollisions {
    /**
     * Resolves collisions for the entire game state.
     * @param {Game} game - The main Game instance containing all entities and systems.
     */
    static checkCollisions(game) {
        const allEntities = [game.player, ...game.bots];

        game.spatialHash.clear();
        game.foods.forEach(f => game.spatialHash.insert(f));
        game.riftSystem.rifts.forEach(r => game.spatialHash.insert(r));
        allEntities.forEach(e => game.spatialHash.insert(e));

        game.queryResult.clear();
        const queryResult = game.queryResult;

        allEntities.forEach(e => {
            const nearby = game.spatialHash.query(e.x, e.y, e.radius + 100, queryResult);

            for (const other of nearby) {
                if (e === other || other.markedForDeletion) continue;

                if (other instanceof Food) {
                    if (game.collisionSystem.resolveFoodCollision(e, other)) {
                        other.markedForDeletion = true;
                    }
                } else if (other.type === 'RIFT') {
                    game.collisionSystem.resolveRiftCollision(e, other);
                }
            }
        });

        game.foods = game.foods.filter(f => !f.markedForDeletion);
        while (game.foods.length < CONSTANTS.FOOD_COUNT) {
            game.foods.push(Spawner.spawnFood());
        }
        game.riftSystem.rifts = game.riftSystem.rifts.filter(r => !r.markedForDeletion);

        game.checkedPairs.clear();
        const checkedPairs = game.checkedPairs;
        for (let i = 0; i < allEntities.length; i++) {
            const e1 = allEntities[i];
            const nearbyEntities = game.spatialHash.query(e1.x, e1.y, e1.radius * 2, queryResult);
            for (const e2 of nearbyEntities) {
                if (e1 === e2 || e2 instanceof Food || e2.type === 'RIFT') continue;

                const pairId = e1.id < e2.id ? `${e1.id}-${e2.id}` : `${e2.id}-${e1.id}`;
                if (checkedPairs.has(pairId)) continue;
                checkedPairs.add(pairId);

                const res = game.collisionSystem.resolveEntityCollision(e1, e2, game.player);
                if (res && res.shards) {
                    const shardCount = Math.min(10, Math.max(5, Math.floor(res.shards.mass / 20)));
                    for (let k = 0; k < shardCount; k++) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = Math.random() * 50;
                        const fx = Math.max(0, Math.min(CONSTANTS.WORLD_WIDTH, res.shards.x + Math.cos(angle) * dist));
                        const fy = Math.max(0, Math.min(CONSTANTS.WORLD_HEIGHT, res.shards.y + Math.sin(angle) * dist));
                        const fRadius = Utils.getRadiusFromMass(res.shards.mass / shardCount);
                        game.foods.push(new Food(fx, fy, fRadius, res.shards.color));
                    }
                }
            }
        }
    }
}
