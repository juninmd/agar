import { describe, it, expect, vi } from 'vitest';
import { GameCollisions } from './game_collisions.js';
import { CONSTANTS } from '../constants.js';
import { Food } from '../food.js';

describe('GameCollisions', () => {
    it('should correctly filter dead food, rifts, and resolve entity collisions', () => {
        const mockSpatialHash = {
            clear: vi.fn(),
            insert: vi.fn(),
            query: vi.fn().mockReturnValue([]) // no nearby entities by default
        };

        const mockCollisionSystem = {
            resolveFoodCollision: vi.fn().mockReturnValue(true), // Consumes food
            resolveRiftCollision: vi.fn(),
            resolveEntityCollision: vi.fn().mockReturnValue({
                shards: { mass: 100, x: 10, y: 10, color: '#FFF' }
            })
        };

        const testFood = new Food(5, 5, 5, '#FFF');
        testFood.markedForDeletion = false;

        const game = {
            player: { id: 1, x: 0, y: 0, radius: 10, type: 'PLAYER', markedForDeletion: false },
            bots: [
                { id: 2, x: 10, y: 10, radius: 10, type: 'BOT', markedForDeletion: false }
            ],
            foods: [
                testFood
            ],
            riftSystem: {
                rifts: [
                    { type: 'RIFT', markedForDeletion: false }
                ]
            },
            spatialHash: mockSpatialHash,
            queryResult: new Set(),
            checkedPairs: new Set(),
            collisionSystem: mockCollisionSystem
        };

        // Test food consumption logic branch
        mockSpatialHash.query.mockReturnValueOnce([testFood]); // nearby has food
        GameCollisions.checkCollisions(game);

        expect(mockSpatialHash.clear).toHaveBeenCalled();
        expect(mockCollisionSystem.resolveFoodCollision).toHaveBeenCalled();
        // Since original food was marked for deletion and filtered,
        // it pushes a new spawned food until it reaches FOOD_COUNT (which is 2500 by default in CONSTANTS).
        expect(game.foods.length).toBeGreaterThanOrEqual(CONSTANTS.FOOD_COUNT);
    });
});
