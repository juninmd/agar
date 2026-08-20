import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { UIAlerts } from './ui_alerts.js';
import { JSDOM } from 'jsdom';

describe('UIAlerts', () => {
    let layer;

    beforeEach(() => {
        const dom = new JSDOM('<!DOCTYPE html><div id="ui-layer"></div>');
        global.document = dom.window.document;
        layer = document.getElementById('ui-layer');
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should show and auto-remove lore popup', () => {
        UIAlerts.showLorePopup(layer, 'Test Lore');
        const popup = layer.querySelector('.lore-popup');
        expect(popup).toBeTruthy();
        expect(popup.innerHTML).toContain('Test Lore');

        vi.advanceTimersByTime(5000);
        expect(popup.classList.contains('fade-out')).toBe(true);
        vi.advanceTimersByTime(1000);
        expect(layer.contains(popup)).toBe(false);
    });

    it('should show raid warning', () => {
        UIAlerts.showRaidWarning(layer);
        const warning = layer.querySelector('.raid-warning');
        expect(warning).toBeTruthy();
        expect(warning.innerHTML).toContain('DIMENSIONAL TEAR DETECTED');
        vi.advanceTimersByTime(5000);
        expect(layer.contains(warning)).toBe(false);
    });

    it('should show purge alert', () => {
        UIAlerts.showPurgeAlert(layer);
        const alert = layer.querySelector('.purge-alert');
        expect(alert).toBeTruthy();
        expect(alert.textContent).toContain('SYSTEM PURGE INITIATED');
        vi.advanceTimersByTime(10000);
        expect(layer.contains(alert)).toBe(false);
    });

    it('should show corruption alert with custom message', () => {
        UIAlerts.showCorruptionAlert(layer, 'TEST CORRUPTION');
        const alert = layer.querySelector('.corruption-alert');
        expect(alert).toBeTruthy();
        expect(alert.textContent).toContain('TEST CORRUPTION');
        vi.advanceTimersByTime(2000);
        expect(layer.contains(alert)).toBe(false);
    });

    it('should show corruption alert with default message', () => {
        UIAlerts.showCorruptionAlert(layer);
        const alert = layer.querySelector('.corruption-alert');
        expect(alert).toBeTruthy();
        expect(alert.textContent).toContain('DATA CORRUPTED // MASS LOST');
        vi.advanceTimersByTime(2000);
        expect(layer.contains(alert)).toBe(false);
    });
});
