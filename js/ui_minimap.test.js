import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UIMinimap } from './ui_minimap.js';

describe('UIMinimap', () => {
    let container;
    let canvas;
    let mockCtx;

    beforeEach(() => {
        document.body.innerHTML = '';

        container = document.createElement('div');
        container.id = 'minimap-container';
        container.classList.add('hidden');
        document.body.appendChild(container);

        canvas = document.createElement('canvas');
        canvas.id = 'minimap-canvas';
        canvas.width = 200;
        canvas.height = 150;
        container.appendChild(canvas);

        mockCtx = {
            fillRect: vi.fn(),
            strokeRect: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
            stroke: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn()
        };

        canvas.getContext = vi.fn().mockReturnValue(mockCtx);
    });

    it('should initialize correctly when DOM elements exist', () => {
        const minimap = new UIMinimap();
        expect(minimap.container).toBe(container);
        expect(minimap.canvas).toBe(canvas);
        expect(minimap.ctx).toBe(mockCtx);
        expect(minimap.width).toBe(200);
        expect(minimap.height).toBe(150);
    });

    it('should toggle hidden class on show()', () => {
        const minimap = new UIMinimap();

        minimap.show(true);
        expect(container.classList.contains('hidden')).toBe(false);

        minimap.show(false);
        expect(container.classList.contains('hidden')).toBe(true);
    });

    it('should handle missing container gracefully', () => {
        document.body.innerHTML = '';
        const minimap = new UIMinimap();

        expect(minimap.container).toBeNull();
        expect(() => minimap.show(true)).not.toThrow();
    });

    it('should render player and bots correctly scaled to the canvas', () => {
        const minimap = new UIMinimap();

        const player = { x: 1000, y: 1000, radius: 50, markedForDeletion: false };
        const bots = [
            { x: 500, y: 500, radius: 20, color: '#FF0000', markedForDeletion: false },
            { x: 2000, y: 2000, radius: 30, color: '#00FF00', markedForDeletion: true }
        ];

        // World is 4000x3000
        minimap.update(player, bots, 4000, 3000);

        // Canvas is 200x150, so scaleX = 200/4000 = 0.05, scaleY = 150/3000 = 0.05

        expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 200, 150);

        // Draw bot 1 (x: 500*0.05 = 25, y: 500*0.05 = 25, radius: max(1, 20*0.05) = 1)
        expect(mockCtx.arc).toHaveBeenCalledWith(25, 25, 1, 0, Math.PI * 2);

        // Draw player (x: 1000*0.05 = 50, y: 1000*0.05 = 50, radius: max(2, 50*0.05) = 2.5)
        expect(mockCtx.arc).toHaveBeenCalledWith(50, 50, 2.5, 0, Math.PI * 2);
    });
});
