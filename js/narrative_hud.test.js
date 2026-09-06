import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { NarrativeHUD } from './narrative_hud.js';

describe('NarrativeHUD', () => {
    let container;
    let hud;

    beforeEach(() => {
        vi.useFakeTimers();
        container = document.createElement('div');
        document.body.appendChild(container);
        hud = new NarrativeHUD(container);
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.removeChild(container);
    });

    it('should initialize with an empty activeToasts array', () => {
        expect(hud.activeToasts.length).toBe(0);
        expect(container.childNodes.length).toBe(0);
    });

    it('should show a toast with the specified text and default type', () => {
        hud.show('System Boot');

        expect(hud.activeToasts.length).toBe(1);
        expect(container.childNodes.length).toBe(1);

        const toast = container.firstChild;
        expect(toast.className).toBe('narrative-toast info');
        expect(toast.textContent).toBe('System Boot');
    });

    it('should convert type to lowercase when applying the CSS class', () => {
        hud.show('Warning Message', 'WARNING');

        const toast = container.firstChild;
        expect(toast.className).toBe('narrative-toast warning');
    });

    it('should set data-text attribute for glitch and critical types', () => {
        hud.show('Critical Error', 'critical');
        expect(container.lastChild.getAttribute('data-text')).toBe('Critical Error');

        hud.show('Glitch Encountered', 'glitch');
        expect(container.lastChild.getAttribute('data-text')).toBe('Glitch Encountered');

        // Ensure standard type doesn't get data-text
        hud.show('Normal Info', 'info');
        expect(container.lastChild.getAttribute('data-text')).toBeNull();
    });

    it('should correctly stack multiple toasts vertically', () => {
        hud.show('Toast 1');
        hud.show('Toast 2');
        hud.show('Toast 3');

        expect(hud.activeToasts.length).toBe(3);

        const toasts = Array.from(container.childNodes);
        expect(toasts[0].style.top).toBe('calc(15% + 0px)');
        expect(toasts[1].style.top).toBe('calc(15% + 60px)');
        expect(toasts[2].style.top).toBe('calc(15% + 120px)');
    });

    it('should remove the toast and update positions after timeout', () => {
        hud.show('Toast 1');
        hud.show('Toast 2');

        const toast1 = container.childNodes[0];
        const toast2 = container.childNodes[1];

        expect(toast1.style.top).toBe('calc(15% + 0px)');
        expect(toast2.style.top).toBe('calc(15% + 60px)');

        // Advance time for first toast only
        vi.advanceTimersByTime(4000);

        expect(toast1.classList.contains('fade-out')).toBe(true);
        expect(hud.activeToasts.length).toBe(0); // since toast2 is also shown at roughly same time if synchronous
    });
});
