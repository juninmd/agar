import { describe, it, expect, vi } from 'vitest';
import { AbilityActivator } from './ability_activator.js';
import { AbilityEffects } from '../ability_effects.js';

vi.mock('../ability_effects.js', () => ({
    AbilityEffects: {
        triggerVirus: vi.fn(),
        triggerChronos: vi.fn(),
        triggerSwarm: vi.fn(),
        triggerSynapse: vi.fn().mockReturnValue(true)
    }
}));

describe('AbilityActivator', () => {
    it('should not activate if cooldown is active', () => {
        const system = { cooldown: 10, isActive: false };
        const result = AbilityActivator.activate(system, {}, []);
        expect(result).toBe(false);
    });

    it('should activate HACKER protocol and apply cooldown', () => {
        const system = {
            cooldown: 0,
            isActive: false,
            protocolId: 'HACKER',
            maxCooldown: 100,
            currentConfig: { duration: 50, cooldown: 100 }
        };
        const result = AbilityActivator.activate(system, {}, []);

        expect(result).toBe(true);
        expect(system.isActive).toBe(true);
        expect(system.cooldown).toBe(100);
        expect(system.activeTime).toBe(50);
        expect(AbilityEffects.triggerVirus).toHaveBeenCalled();
    });

    it('should activate CHRONOS but immediately set isActive to false for instant abilities', () => {
        const system = {
            cooldown: 0,
            isActive: false,
            protocolId: 'CHRONOS',
            maxCooldown: 200,
            currentConfig: { duration: 0, cooldown: 200 }
        };
        const result = AbilityActivator.activate(system, {}, []);

        expect(result).toBe(true);
        expect(system.isActive).toBe(false);
        expect(system.cooldown).toBe(200);
        expect(AbilityEffects.triggerChronos).toHaveBeenCalled();
    });
});
