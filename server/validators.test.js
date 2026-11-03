import { describe, it, expect } from 'vitest';
import {
    isValidRoomId,
    isValidColor,
    isValidCoordinate,
    isValidMass,
    validatePlayerUpdate
} from './validators.js';

describe('server/validators.js', () => {
    describe('isValidRoomId', () => {
        it('accepts valid alphanumeric, underscore and hyphen IDs', () => {
            expect(isValidRoomId('default')).toBe(true);
            expect(isValidRoomId('room-123_abc')).toBe(true);
            expect(isValidRoomId('a'.repeat(32))).toBe(true);
        });

        it('rejects invalid room IDs', () => {
            expect(isValidRoomId('')).toBe(false);
            expect(isValidRoomId('a'.repeat(33))).toBe(false);
            expect(isValidRoomId('room with spaces')).toBe(false);
            expect(isValidRoomId('room$special!')).toBe(false);
            expect(isValidRoomId(null)).toBe(false);
            expect(isValidRoomId(undefined)).toBe(false);
            expect(isValidRoomId(12345)).toBe(false);
            expect(isValidRoomId({})).toBe(false);
        });
    });

    describe('isValidColor', () => {
        it('accepts valid 6-character hex colors', () => {
            expect(isValidColor('#00FFCC')).toBe(true);
            expect(isValidColor('#ffffff')).toBe(true);
            expect(isValidColor('#123456')).toBe(true);
        });

        it('rejects invalid colors', () => {
            expect(isValidColor('#fff')).toBe(false);
            expect(isValidColor('red')).toBe(false);
            expect(isValidColor('#GGGGGG')).toBe(false);
            expect(isValidColor('#00FFCC11')).toBe(false);
            expect(isValidColor(null)).toBe(false);
            expect(isValidColor(undefined)).toBe(false);
            expect(isValidColor(123)).toBe(false);
        });
    });

    describe('isValidCoordinate', () => {
        it('validates coordinates within limits', () => {
            expect(isValidCoordinate(0, 3000)).toBe(true);
            expect(isValidCoordinate(1500, 3000)).toBe(true);
            expect(isValidCoordinate(3000, 3000)).toBe(true);
        });

        it('rejects out of bounds and non-finite coordinates', () => {
            expect(isValidCoordinate(-1, 3000)).toBe(false);
            expect(isValidCoordinate(3001, 3000)).toBe(false);
            expect(isValidCoordinate(NaN, 3000)).toBe(false);
            expect(isValidCoordinate(Infinity, 3000)).toBe(false);
            expect(isValidCoordinate(-Infinity, 3000)).toBe(false);
            expect(isValidCoordinate('1500', 3000)).toBe(false);
            expect(isValidCoordinate(null, 3000)).toBe(false);
        });
    });

    describe('isValidMass', () => {
        it('validates positive finite mass', () => {
            expect(isValidMass(10)).toBe(true);
            expect(isValidMass(5000)).toBe(true);
        });

        it('rejects zero, negative, NaN or infinite mass', () => {
            expect(isValidMass(0)).toBe(false);
            expect(isValidMass(-5)).toBe(false);
            expect(isValidMass(NaN)).toBe(false);
            expect(isValidMass(Infinity)).toBe(false);
            expect(isValidMass('50')).toBe(false);
        });

        it('enforces growth limit per update', () => {
            expect(isValidMass(100, 50, 200)).toBe(true);
            expect(isValidMass(350, 50, 200)).toBe(false); // +300 > 200
        });
    });

    describe('validatePlayerUpdate', () => {
        it('returns sanitized payload for valid data', () => {
            const data = {
                x: 100,
                y: 200,
                mass: 50,
                color: '#00ffcc'
            };
            const result = validatePlayerUpdate(data);
            expect(result).toEqual({
                x: 100,
                y: 200,
                mass: 50,
                color: '#00FFCC'
            });
        });

        it('returns null for undefined, null, or non-object payloads', () => {
            expect(validatePlayerUpdate(undefined)).toBeNull();
            expect(validatePlayerUpdate(null)).toBeNull();
            expect(validatePlayerUpdate('string')).toBeNull();
            expect(validatePlayerUpdate(123)).toBeNull();
        });

        it('returns null for invalid attributes', () => {
            expect(validatePlayerUpdate({ x: NaN, y: 100, mass: 50, color: '#000000' })).toBeNull();
            expect(validatePlayerUpdate({ x: 100, y: -10, mass: 50, color: '#000000' })).toBeNull();
            expect(validatePlayerUpdate({ x: 100, y: 100, mass: -5, color: '#000000' })).toBeNull();
            expect(validatePlayerUpdate({ x: 100, y: 100, mass: 50, color: 'invalid' })).toBeNull();
        });
    });
});
