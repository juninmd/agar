import { expect, test, describe } from 'vitest';
import { Utils } from './utils.js';

describe('Utils', () => {
    test('randomRange', () => {
        const val = Utils.randomRange(5, 10);
        expect(val).toBeGreaterThanOrEqual(5);
        expect(val).toBeLessThanOrEqual(10);
    });

    test('randomColor', () => {
        const colors = ['#FFF', '#000', '#F00'];
        const val = Utils.randomColor(colors);
        expect(colors).toContain(val);
    });

    test('getDistance', () => {
        expect(Utils.getDistance(0, 0, 3, 4)).toBe(5);
        expect(Utils.getDistance(1, 1, 1, 1)).toBe(0);
        expect(Utils.getDistance(10, -5, -10, 10)).toBe(25);
    });

    test('hexToRgba', () => {
        expect(Utils.hexToRgba('#FF0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
        expect(Utils.hexToRgba('#00FF00', 1)).toBe('rgba(0, 255, 0, 1)');
        expect(Utils.hexToRgba('#0000FF', 0)).toBe('rgba(0, 0, 255, 0)');
        expect(Utils.hexToRgba('#FFFFFF', 0.1)).toBe('rgba(255, 255, 255, 0.1)');
        expect(Utils.hexToRgba('#000000', 0.9)).toBe('rgba(0, 0, 0, 0.9)');
    });

    test('getRadiusFromMass', () => {
        const mass = Math.PI * 10 * 10;
        expect(Utils.getRadiusFromMass(mass)).toBeCloseTo(10);
    });

    test('getMassFromRadius', () => {
        const radius = 10;
        expect(Utils.getMassFromRadius(radius)).toBeCloseTo(Math.PI * 10 * 10);
    });

    test('isInViewport', () => {
        // x, y, radius, camX, camY, canvasWidth, canvasHeight

        // Inside
        expect(Utils.isInViewport(100, 100, 10, -50, -50, 800, 600)).toBe(true);
        // screenX = 100 + (-50) = 50
        // screenY = 100 + (-50) = 50
        // 50+10>=0 && 50-10<=800 && 50+10>=0 && 50-10<=600 (true)

        // Outside Left
        expect(Utils.isInViewport(-20, 100, 10, 0, 0, 800, 600)).toBe(false);

        // Outside Right
        expect(Utils.isInViewport(820, 100, 10, 0, 0, 800, 600)).toBe(false);

        // Outside Top
        expect(Utils.isInViewport(100, -20, 10, 0, 0, 800, 600)).toBe(false);

        // Outside Bottom
        expect(Utils.isInViewport(100, 620, 10, 0, 0, 800, 600)).toBe(false);
    });
});
