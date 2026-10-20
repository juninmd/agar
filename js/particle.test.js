import { describe, it, expect, vi } from 'vitest';
import { Particle } from './particle.js';

describe('Particle', () => {
    it('should initialize with default values', () => {
        const particle = new Particle();
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

    it('should initialize correctly with init method', () => {
        const particle = new Particle();
        particle.init(10, 20, '#FF0000', 5, 30, 2);

        expect(particle.active).toBe(true);
        expect(particle.x).toBe(10);
        expect(particle.y).toBe(20);
        expect(particle.color).toBe('#FF0000');
        expect(particle.life).toBe(30);
        expect(particle.maxLife).toBe(30);

        // Size should be between (0*3+1)*2 and (1*3+1)*2 -> 2 and 8
        expect(particle.size).toBeGreaterThanOrEqual(2);
        expect(particle.size).toBeLessThanOrEqual(8);

        expect(particle.velocity.x).toBeDefined();
        expect(particle.velocity.y).toBeDefined();
        expect(['square', 'line', 'circle']).toContain(particle.shape);
        expect(particle.rotation).toBeDefined();
        expect(particle.rotationSpeed).toBeDefined();
    });

    it('should update correctly', () => {
        const particle = new Particle();
        particle.init(10, 20, '#FF0000', 5, 30);

        const initialX = particle.x;
        const initialY = particle.y;
        const initialLife = particle.life;
        const initialSize = particle.size;
        const initialRotation = particle.rotation;

        particle.update();

        expect(particle.x).toBe(initialX + particle.velocity.x);
        expect(particle.y).toBe(initialY + particle.velocity.y);
        expect(particle.life).toBe(initialLife - 1);
        expect(particle.size).toBe(initialSize * 0.95);
        expect(particle.rotation).toBe(initialRotation + particle.rotationSpeed);
    });

    it('should not update if inactive', () => {
        const particle = new Particle();
        particle.update();
        expect(particle.life).toBe(0); // life doesn't change
    });

    it('should draw correctly based on shape', () => {
        const particle = new Particle();
        particle.init(10, 20, '#FF0000', 5, 30);

        const ctx = {
            save: vi.fn(),
            restore: vi.fn(),
            translate: vi.fn(),
            rotate: vi.fn(),
            beginPath: vi.fn(),
            fill: vi.fn(),
            stroke: vi.fn(),
            rect: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            closePath: vi.fn(),
            arc: vi.fn()
        };

        // Test each shape
        const shapes = ['square', 'triangle', 'line', 'circle'];

        for (const shape of shapes) {
            particle.shape = shape;
            particle.draw(ctx);
            expect(ctx.save).toHaveBeenCalled();
            expect(ctx.translate).toHaveBeenCalledWith(particle.x, particle.y);
            expect(ctx.rotate).toHaveBeenCalledWith(particle.rotation);
            expect(ctx.beginPath).toHaveBeenCalled();

            if (shape === 'square') {
                expect(ctx.rect).toHaveBeenCalled();
                expect(ctx.fill).toHaveBeenCalled();
            } else if (shape === 'triangle') {
                expect(ctx.moveTo).toHaveBeenCalled();
                expect(ctx.lineTo).toHaveBeenCalled();
                expect(ctx.closePath).toHaveBeenCalled();
                expect(ctx.fill).toHaveBeenCalled();
            } else if (shape === 'line') {
                expect(ctx.moveTo).toHaveBeenCalled();
                expect(ctx.lineTo).toHaveBeenCalled();
                expect(ctx.stroke).toHaveBeenCalled();
            } else if (shape === 'circle') {
                expect(ctx.arc).toHaveBeenCalled();
                expect(ctx.fill).toHaveBeenCalled();
            }

            expect(ctx.restore).toHaveBeenCalled();

            // clear mocks for next iteration
            vi.clearAllMocks();
        }
    });
});
