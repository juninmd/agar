import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Particle } from '../particle.js';

describe('Particle', () => {
    let particle;

    beforeEach(() => {
        particle = new Particle();
    });

    it('should initialize with default values', () => {
        expect(particle.active).toBe(false);
        expect(particle.x).toBe(0);
        expect(particle.y).toBe(0);
        expect(particle.color).toBe('#FFF');
        expect(particle.life).toBe(0);
        expect(particle.maxLife).toBe(0);
        expect(particle.velocity).toEqual({ x: 0, y: 0 });
        expect(particle.size).toBe(0);
        expect(particle.shape).toBe('circle');
        expect(particle.rotation).toBe(0);
        expect(particle.rotationSpeed).toBe(0);
    });

    it('should set active and other properties on init', () => {
        // We mock Math.random to get predictable results
        vi.spyOn(Math, 'random').mockReturnValue(0.5);

        particle.init(10, 20, '#FF0000', 5, 10, 2);

        expect(particle.active).toBe(true);
        expect(particle.x).toBe(10);
        expect(particle.y).toBe(20);
        expect(particle.color).toBe('#FF0000');
        expect(particle.life).toBe(10);
        expect(particle.maxLife).toBe(10);

        // speed = 5, Math.random() = 0.5, angle = 0.5 * Math.PI * 2 = Math.PI
        // Math.cos(Math.PI) = -1, velocity.x = -1 * 5 * 0.5 = -2.5
        // Math.sin(Math.PI) = ~0, velocity.y = 0 * 5 * 0.5 = 0
        expect(particle.velocity.x).toBeCloseTo(-2.5);
        expect(particle.velocity.y).toBeCloseTo(0);

        // size = (0.5 * 3 + 1) * 2 = (1.5 + 1) * 2 = 5
        expect(particle.size).toBe(5);
        expect(particle.rotation).toBeCloseTo(Math.PI);
        expect(particle.rotationSpeed).toBe(0); // (0.5 - 0.5) * 0.2 = 0

        vi.restoreAllMocks();
    });

    it('should update correctly when active', () => {
        particle.active = true;
        particle.x = 10;
        particle.y = 10;
        particle.velocity = { x: 2, y: -1 };
        particle.life = 10;
        particle.size = 10;
        particle.rotation = 0;
        particle.rotationSpeed = 0.1;

        particle.update();

        expect(particle.x).toBe(12);
        expect(particle.y).toBe(9);
        expect(particle.life).toBe(9);
        expect(particle.size).toBe(9.5); // 10 * 0.95
        expect(particle.rotation).toBe(0.1);
    });

    it('should not update when inactive', () => {
        particle.active = false;
        particle.x = 10;
        particle.y = 10;
        particle.velocity = { x: 2, y: -1 };

        particle.update();

        expect(particle.x).toBe(10);
        expect(particle.y).toBe(10);
    });

    describe('draw', () => {
        let mockCtx;

        beforeEach(() => {
            mockCtx = {
                save: vi.fn(),
                restore: vi.fn(),
                translate: vi.fn(),
                rotate: vi.fn(),
                beginPath: vi.fn(),
                rect: vi.fn(),
                fill: vi.fn(),
                moveTo: vi.fn(),
                lineTo: vi.fn(),
                closePath: vi.fn(),
                stroke: vi.fn(),
                arc: vi.fn(),
                globalAlpha: 1,
                fillStyle: '',
                strokeStyle: '',
                lineWidth: 1
            };
            particle.active = true;
            particle.x = 10;
            particle.y = 20;
            particle.life = 5;
            particle.maxLife = 10;
            particle.color = '#FFF';
            particle.size = 10;
        });

        it('should draw square shape', () => {
            particle.shape = 'square';
            particle.draw(mockCtx);

            expect(mockCtx.save).toHaveBeenCalled();
            expect(mockCtx.translate).toHaveBeenCalledWith(10, 20);
            expect(mockCtx.globalAlpha).toBe(0.5);
            expect(mockCtx.rect).toHaveBeenCalledWith(-5, -5, 10, 10);
            expect(mockCtx.fill).toHaveBeenCalled();
            expect(mockCtx.restore).toHaveBeenCalled();
        });

        it('should draw triangle shape', () => {
            particle.shape = 'triangle';
            particle.draw(mockCtx);

            expect(mockCtx.moveTo).toHaveBeenCalledWith(0, -10);
            expect(mockCtx.lineTo).toHaveBeenCalledWith(10 * 0.866, 10 * 0.5);
            expect(mockCtx.lineTo).toHaveBeenCalledWith(-10 * 0.866, 10 * 0.5);
            expect(mockCtx.closePath).toHaveBeenCalled();
            expect(mockCtx.fill).toHaveBeenCalled();
        });

        it('should draw line shape', () => {
            particle.shape = 'line';
            particle.draw(mockCtx);

            expect(mockCtx.moveTo).toHaveBeenCalledWith(-10, 0);
            expect(mockCtx.lineTo).toHaveBeenCalledWith(10, 0);
            expect(mockCtx.lineWidth).toBe(5);
            expect(mockCtx.stroke).toHaveBeenCalled();
        });

        it('should draw circle shape (default)', () => {
            particle.shape = 'circle';
            particle.draw(mockCtx);

            expect(mockCtx.arc).toHaveBeenCalledWith(0, 0, 10, 0, Math.PI * 2);
            expect(mockCtx.fill).toHaveBeenCalled();
        });

        it('should handle zero life correctly for alpha', () => {
            particle.shape = 'circle';
            particle.life = -1;
            particle.draw(mockCtx);

            expect(mockCtx.globalAlpha).toBe(0);
        });
    });
});
