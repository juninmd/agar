import { expect, test, describe, beforeEach } from 'vitest';
import { SpatialHash } from './spatial_hash.js';

describe('SpatialHash', () => {
    let hash;

    beforeEach(() => {
        hash = new SpatialHash(100);
    });

    test('should hash coordinates correctly', () => {
        // formula is (x + 1000) * 10000 + (y + 1000)
        expect(hash._hash(50, 50)).toBe((50 + 1000) * 10000 + (50 + 1000));
        expect(hash._hash(150, 50)).toBe((150 + 1000) * 10000 + (50 + 1000));
        expect(hash._hash(-50, 150)).toBe((-50 + 1000) * 10000 + (150 + 1000));
    });

    test('should insert and query entities correctly', () => {
        const e1 = { x: 50, y: 50, radius: 10 };
        const e2 = { x: 120, y: 50, radius: 10 };
        const e3 = { x: 300, y: 300, radius: 10 };

        hash.insert(e1);
        hash.insert(e2);
        hash.insert(e3);

        const query1 = hash.query(60, 50, 60);
        expect(query1.has(e1)).toBe(true);
        expect(query1.has(e2)).toBe(true);
        expect(query1.has(e3)).toBe(false);

        const query2 = hash.query(300, 300, 10);
        expect(query2.has(e3)).toBe(true);
        expect(query2.has(e1)).toBe(false);
    });

    test('should clear the hash correctly', () => {
        const e1 = { x: 50, y: 50, radius: 10 };
        hash.insert(e1);
        expect(hash.query(50, 50, 10).size).toBe(1);

        hash.clear();
        expect(hash.query(50, 50, 10).size).toBe(0);
    });
});
