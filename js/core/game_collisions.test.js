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

    it('does not resolve a second collision with an entity eaten earlier in the same frame', () => {
        const player = { id: 1, x: 0, y: 0, radius: 20, type: 'PLAYER', markedForDeletion: false };
        const prey = { id: 2, x: 5, y: 5, radius: 10, type: 'BOT', markedForDeletion: false };
        const other = { id: 3, x: 8, y: 8, radius: 15, type: 'BOT', markedForDeletion: false };
        const near = new Map([[player, [prey, other]], [prey, [other]], [other, [prey]]]);
        const resolveEntityCollision = vi.fn((a, b) => {
            if (a === player && b === prey) prey.markedForDeletion = true; // player eats prey
            return null;
        });
        const game = {
            player,
            bots: [prey, other],
            foods: [],
            riftSystem: { rifts: [] },
            spatialHash: {
                clear: vi.fn(),
                insert: vi.fn(),
                query: vi.fn((x, y, r) => near.get([player, prey, other].find(e => e.x === x && e.y === y && (e.radius * 2 === r))) ?? []),
            },
            queryResult: new Set(),
            checkedPairs: new Set(),
            collisionSystem: { resolveFoodCollision: vi.fn(), resolveRiftCollision: vi.fn(), resolveEntityCollision },
        };

        GameCollisions.checkCollisions(game);

        const pairs = resolveEntityCollision.mock.calls.map(([a, b]) => [a.id, b.id]);
        expect(pairs).toContainEqual([1, 2]);
        expect(pairs).toContainEqual([1, 3]);
        expect(pairs.some(([a, b]) => a === 2 || (b === 2 && a !== 1))).toBe(false); // prey is out after being eaten
    });
});
