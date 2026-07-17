import { expect, test, describe } from 'vitest';
import { SpatialHash } from './spatial_hash.js';

describe('SpatialHash Performance and Robustness', () => {
    test('should handle massive insertions and queries correctly', () => {
        const hash = new SpatialHash(100);
        const entities = [];
        const queryResult = new Set();

        // Insert 1000 dummy entities
        for (let i = 0; i < 1000; i++) {
            const e = {
                id: i,
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 2000 - 1000,
                radius: Math.random() * 10 + 5
            };
            entities.push(e);
            hash.insert(e);
        }

        // Query point
        const qx = 100;
        const qy = -100;
        const qRadius = 200;

        hash.query(qx, qy, qRadius, queryResult);

        // Slow naive filter for reference
        const expected = new Set();
        entities.forEach(e => {
            const minX = Math.floor((qx - qRadius) / 100);
            const maxX = Math.floor((qx + qRadius) / 100);
            const minY = Math.floor((qy - qRadius) / 100);
            const maxY = Math.floor((qy + qRadius) / 100);

            const eMinX = Math.floor((e.x - e.radius) / 100);
            const eMaxX = Math.floor((e.x + e.radius) / 100);
            const eMinY = Math.floor((e.y - e.radius) / 100);
            const eMaxY = Math.floor((e.y + e.radius) / 100);

            // AABB collision check in grid space
            if (eMinX <= maxX && eMaxX >= minX && eMinY <= maxY && eMaxY >= minY) {
                expected.add(e);
            }
        });

        // Ensure the spatial hash returns the same as naive filter
        expect(queryResult.size).toBe(expected.size);
        for (const e of expected) {
            expect(queryResult.has(e)).toBe(true);
        }
    });
});
