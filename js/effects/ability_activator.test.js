import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AbilityActivator } from './ability_activator.js';
import { AbilityEffects } from '../ability_effects.js';

vi.mock('../ability_effects.js', () => ({
    AbilityEffects: {
        triggerCypher: vi.fn(),
        triggerChronos: vi.fn(),
        triggerAeon: vi.fn(),
        triggerArchitect: vi.fn(),
        updateMagnetar: vi.fn(),
        triggerHarvest: vi.fn(),
        triggerSpecter: vi.fn(),
        triggerQuantum: vi.fn(),
        triggerSwarm: vi.fn(),
        triggerMirage: vi.fn(),
        triggerSyndicate: vi.fn(),
        triggerVirus: vi.fn(),
        updateOutbreak: vi.fn(),
        updateSoulStorm: vi.fn(),
        triggerNexus: vi.fn(),
        triggerForge: vi.fn().mockReturnValue(true),
        triggerSynapse: vi.fn().mockReturnValue(true),
        triggerKinetic: vi.fn().mockReturnValue(true),
        updateVampyr: vi.fn()
    }
}));

describe('AbilityActivator', () => {
    let mockPlayer, mockBots;

    beforeEach(() => {
        vi.clearAllMocks();
        mockPlayer = { mass: 200, grow: vi.fn(), radius: 50 };
        mockBots = [];
        window.game = { foods: [] };
    });

    it('should trigger QUANTUM effect and deactivate system', () => {
        const system = { protocolId: 'QUANTUM', isActive: false, cooldown: 0, currentConfig: { duration: 0, cooldown: 10 } };
        AbilityActivator.activate(system, mockPlayer, mockBots);
        expect(AbilityEffects.triggerQuantum).toHaveBeenCalledWith(mockPlayer, mockBots);
        expect(system.isActive).toBe(false);
    });

    it('should trigger HACKER virus effect', () => {
        const system = { protocolId: 'HACKER', isActive: false, cooldown: 0, currentConfig: { duration: 0, cooldown: 10 } };
        AbilityActivator.activate(system, mockPlayer, mockBots);
        expect(AbilityEffects.triggerVirus).toHaveBeenCalled();
    });

    it('should trigger SWARM drone spawn', () => {
        const system = { protocolId: 'SWARM', isActive: false, cooldown: 0, currentConfig: { duration: 0, cooldown: 10 } };
        // SWARM requires mass > 500
        mockPlayer.mass = 600;
        AbilityActivator.activate(system, mockPlayer, mockBots);
        expect(AbilityEffects.triggerSwarm).toHaveBeenCalled();
    });

    it('should trigger CHRONOS rewind and deactivate system', () => {
        const system = { protocolId: 'CHRONOS', isActive: false, cooldown: 0, currentConfig: { duration: 0, cooldown: 10 } };
        AbilityActivator.activate(system, mockPlayer, mockBots);
        expect(AbilityEffects.triggerChronos).toHaveBeenCalled();
        expect(system.isActive).toBe(false);
    });
});
