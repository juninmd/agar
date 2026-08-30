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
            stroke: vi.fn()
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

        // One bot is markedForDeletion, so arc is called 2 times (1 bot + 1 player)
        expect(ctxMock.arc).toHaveBeenCalledTimes(2);

        // Player crosshair lines
        expect(ctxMock.moveTo).toHaveBeenCalledTimes(2);
        expect(ctxMock.lineTo).toHaveBeenCalledTimes(2);
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

        // Arc shouldn't be called if no bots and player is dead
        expect(ctxMock.arc).not.toHaveBeenCalled();
    });

    it('should not render player if player is null', () => {
        const minimap = new UIMinimap();
        minimap.update(null, [], 1000, 1000);
        expect(ctxMock.arc).not.toHaveBeenCalled();
    });
});
