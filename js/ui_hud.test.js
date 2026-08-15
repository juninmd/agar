import { describe, it, expect, beforeEach } from 'vitest';
import { UIHud } from './ui_hud.js';

describe('UIHud', () => {
    let hud;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="score-display"></div>
            <div id="integrity-bar"></div>
            <div id="ability-overlay"></div>
            <div id="warning-message"></div>
            <div id="ui-layer"></div>
            <div id="fps-counter" class="hidden"></div>
            <div id="integrity-container" class="hidden"></div>
            <div id="score-board" class="hidden"></div>
            <div id="ability-hud" class="hidden"></div>
        `;
        hud = new UIHud();
    });

    it('should show HUD elements when active is true', () => {
        hud.show(true);
        expect(document.getElementById('score-board').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('fps-counter').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('integrity-container').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('ability-hud').classList.contains('hidden')).toBe(false);
    });

    it('should hide HUD elements when active is false', () => {
        hud.show(true); // First make them visible
        hud.show(false); // Then hide them
        expect(document.getElementById('score-board').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('fps-counter').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('integrity-container').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('ability-hud').classList.contains('hidden')).toBe(true);
    });
});
