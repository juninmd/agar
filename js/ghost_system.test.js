import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GhostSystem } from './ghost_system.js';

const KEY = 'neon_phage_ghosts';
const valid = { name: 'a', mass: 200, color: '#fff', x: 10, y: 20, date: 1 };

describe('GhostSystem._loadGhosts validation', () => {
    let system;
    beforeEach(() => {
        localStorage.clear();
        system = new GhostSystem({ bots: [] });
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    it('keeps well-formed ghosts', () => {
        localStorage.setItem(KEY, JSON.stringify([valid]));
        expect(system._loadGhosts()).toEqual([valid]);
    });

    it('drops corrupted entries that would produce NaN bots', () => {
        const bad = [
            { ...valid, mass: 'big' },
            { ...valid, mass: 0 },
            { ...valid, x: null },
            { ...valid, color: 42 },
            null,
        ];
        localStorage.setItem(KEY, JSON.stringify([valid, ...bad]));
        expect(system._loadGhosts()).toEqual([valid]);
    });

    it('returns an empty list when storage holds a non-array', () => {
        localStorage.setItem(KEY, JSON.stringify({ mass: 100 }));
        expect(system._loadGhosts()).toEqual([]);
    });
});
