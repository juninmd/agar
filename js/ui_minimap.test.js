import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UIMinimap } from './ui_minimap.js';

describe('UIMinimap', () => {
    let container, canvas, ctxMock;

    beforeEach(() => {
        // Mock DOM
        document.body.innerHTML = `
            <div id="minimap-container" class="hidden"></div>
            <canvas id="minimap-canvas" width="200" height="200"></canvas>
        `;
        container = document.getElementById('minimap-container');
        canvas = document.getElementById('minimap-canvas');

        ctxMock = {
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 0,
            shadowBlur: 0,
            shadowColor: '',
            fillRect: vi.fn(),
            strokeRect: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            stroke: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            translate: vi.fn(),
            rotate: vi.fn(),
            createConicGradient: vi.fn().mockReturnValue({
                addColorStop: vi.fn()
            })
        };

        // Mock canvas context
        canvas.getContext = vi.fn().mockReturnValue(ctxMock);
    });

    it('should initialize correctly with DOM elements', () => {
        const minimap = new UIMinimap();
        expect(minimap.container).toBe(container);
        expect(minimap.canvas).toBe(canvas);
        expect(minimap.ctx).toBe(ctxMock);
        expect(minimap.width).toBe(200);
        expect(minimap.height).toBe(200);
    });

    it('should handle missing canvas gracefully', () => {
        document.body.innerHTML = `<div id="minimap-container"></div>`;
        const minimap = new UIMinimap();
        expect(minimap.ctx).toBeUndefined();
    });

    it('should toggle visibility via show(active)', () => {
        const minimap = new UIMinimap();

        minimap.show(true);
        expect(container.classList.contains('hidden')).toBe(false);

        minimap.show(false);
        expect(container.classList.contains('hidden')).toBe(true);
    });

    it('should handle show() when container is missing', () => {
        document.body.innerHTML = '';
        const minimap = new UIMinimap();
        expect(() => minimap.show(true)).not.toThrow();
    });

    it('should render player and bots correctly via update()', () => {
        const minimap = new UIMinimap();

        const player = { x: 500, y: 500, radius: 20, markedForDeletion: false };
        const bots = [
            { x: 100, y: 100, radius: 10, color: 'red', markedForDeletion: false },
            { x: 900, y: 900, radius: 10, color: 'blue', markedForDeletion: true }
        ];

        minimap.update(player, bots, 1000, 1000);

        // Check if clear and borders are drawn
        expect(ctxMock.fillRect).toHaveBeenCalledWith(0, 0, 200, 200);
        expect(ctxMock.strokeRect).toHaveBeenCalledWith(0, 0, 200, 200);

        // One bot is markedForDeletion, so arc is called 3 times (1 radar sweep + 1 bot + 1 player)
        expect(ctxMock.arc).toHaveBeenCalledTimes(3);

        // Player crosshair lines (2 lines) (plus radar line 1 line) = 3 total? Wait:
        // Radar sweep draws 1 line (moveTo 0,0, lineTo radius,0) -> 1 moveTo, 1 lineTo
        // Crosshair draws 2 lines (moveTo x, y, lineTo x, y) -> 2 moveTo, 2 lineTo
        // Also Radar has arc: moveTo(0,0), arc -> 1 moveTo
        // So Radar: 2 moveTo, 1 lineTo. Crosshair: 2 moveTo, 2 lineTo. Total: 4 moveTo, 3 lineTo.
        expect(ctxMock.moveTo).toHaveBeenCalledTimes(4);
        expect(ctxMock.lineTo).toHaveBeenCalledTimes(3);
        expect(ctxMock.stroke).toHaveBeenCalled();
    });

    it('should handle missing ctx in update() gracefully', () => {
        document.body.innerHTML = '';
        const minimap = new UIMinimap();
        expect(() => minimap.update(null, [], 1000, 1000)).not.toThrow();
    });

    it('should not render player if markedForDeletion is true', () => {
        const minimap = new UIMinimap();
        const player = { x: 500, y: 500, radius: 20, markedForDeletion: true };

        minimap.update(player, [], 1000, 1000);

        // Arc should be called once for radar sweep
        expect(ctxMock.arc).toHaveBeenCalledTimes(1);
    });

    it('should not render player if player is null', () => {
        const minimap = new UIMinimap();
        minimap.update(null, [], 1000, 1000);
        // Arc should be called once for radar sweep
        expect(ctxMock.arc).toHaveBeenCalledTimes(1);
    });
});
