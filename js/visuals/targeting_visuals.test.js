import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TargetingVisuals } from './targeting_visuals.js';
import { Utils } from '../utils.js';

describe('TargetingVisuals', () => {
    let ctx;
    let player;

    beforeEach(() => {
        ctx = {
            save: vi.fn(),
            translate: vi.fn(),
            beginPath: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            stroke: vi.fn(),
            restore: vi.fn(),
        };

        player = { x: 100, y: 100 };
        vi.spyOn(Utils, 'isInViewport').mockReturnValue(true);
    });

    it('should return early if no player or no bots', () => {
        TargetingVisuals.drawTargetingSystem(ctx, null, [{ x: 10, y: 10 }], 0, 0, 800, 600);
        expect(ctx.save).not.toHaveBeenCalled();

        TargetingVisuals.drawTargetingSystem(ctx, player, [], 0, 0, 800, 600);
        expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should ignore bots marked for deletion', () => {
        const bots = [{ x: 110, y: 110, radius: 10, markedForDeletion: true }];
        TargetingVisuals.drawTargetingSystem(ctx, player, bots, 0, 0, 800, 600);
        expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should not draw if the closest bot is not in viewport', () => {
        vi.spyOn(Utils, 'isInViewport').mockReturnValue(false);
        const bots = [{ x: 110, y: 110, radius: 10 }];
        TargetingVisuals.drawTargetingSystem(ctx, player, bots, 0, 0, 800, 600);
        expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should find the closest bot and draw brackets if in viewport', () => {
        const bots = [
            { x: 300, y: 300, radius: 15 }, // further
            { x: 150, y: 150, radius: 10 }  // closer
        ];

        TargetingVisuals.drawTargetingSystem(ctx, player, bots, 0, 0, 800, 600);

        expect(ctx.save).toHaveBeenCalled();
        expect(ctx.translate).toHaveBeenCalledWith(150, 150);
        expect(ctx.beginPath).toHaveBeenCalledTimes(4); // 4 corners
        expect(ctx.stroke).toHaveBeenCalledTimes(4);
        expect(ctx.restore).toHaveBeenCalled();
    });
});
