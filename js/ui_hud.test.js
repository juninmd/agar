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
            <div id="terminal-ticker" class="hidden"></div>
        `;
        hud = new UIHud();
    });

    it('should show HUD elements when active is true', () => {
        hud.show(true);
        expect(document.getElementById('score-board').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('fps-counter').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('integrity-container').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('ability-hud').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('terminal-ticker').classList.contains('hidden')).toBe(false);
    });

    it('should hide HUD elements when active is false', () => {
        hud.show(true); // First make them visible
        hud.show(false); // Then hide them
        expect(document.getElementById('score-board').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('fps-counter').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('integrity-container').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('ability-hud').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('terminal-ticker').classList.contains('hidden')).toBe(true);
    });

    it('should update ticker text', () => {
        hud.updateTicker("SYSTEM SECURE");
        expect(document.getElementById('terminal-ticker').innerText).toBe("> SYSTEM SECURE");
    });

    it('should update integrity bar width and color', () => {
        const bar = document.getElementById('integrity-bar');

        hud.updateIntegrity(75);
        expect(bar.style.width).toBe('75%');
        expect(bar.style.backgroundColor).toBe('rgb(0, 255, 65)');

        hud.updateIntegrity(50);
        expect(bar.style.width).toBe('50%');
        expect(bar.style.backgroundColor).toBe('rgb(255, 184, 0)');

        hud.updateIntegrity(30);
        expect(bar.style.width).toBe('30%');
        expect(bar.style.backgroundColor).toBe('rgb(255, 184, 0)');

        hud.updateIntegrity(25);
        expect(bar.style.width).toBe('25%');
        expect(bar.style.backgroundColor).toBe('rgb(255, 34, 68)');

        hud.updateIntegrity(10);
        expect(bar.style.width).toBe('10%');
        expect(bar.style.backgroundColor).toBe('rgb(255, 34, 68)');
    });
});
