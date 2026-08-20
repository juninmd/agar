import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UIEvents } from './ui_events.js';
import { JSDOM } from 'jsdom';

describe('UIEvents', () => {
    let mockUI;

    beforeEach(() => {
        const dom = new JSDOM(`
            <!DOCTYPE html>
            <button id="start-btn"></button>
            <button id="restart-btn"></button>
            <button id="win-btn"></button>
            <button id="true-win-btn"></button>
            <input id="player-name" value="TestName" />
            <input id="room-id" value="TestRoom" />
            <select id="skin-selector"><option value="DEFAULT">DEFAULT</option></select>
            <div class="protocol-card" data-id="HACKER"></div>
            <div class="protocol-card selected" data-id="BASTION"></div>
            <label class="mutation-btn"><input type="checkbox" id="mut-chaos" value="chaos-mode"></label>
        `);
        global.document = dom.window.document;
        global.window = dom.window;

        mockUI = {
            startBtn: document.getElementById('start-btn'),
            restartBtn: document.getElementById('restart-btn'),
            winBtn: document.getElementById('win-btn'),
            trueWinBtn: document.getElementById('true-win-btn'),
            nameInput: document.getElementById('player-name'),
            roomIdInput: document.getElementById('room-id'),
            onStart: vi.fn(),
            onRestart: vi.fn()
        };
    });

    it('should initialize and attach start button event', () => {
        UIEvents.initListeners(mockUI);
        document.getElementById('start-btn').click();
        expect(mockUI.onStart).toHaveBeenCalledWith('TestName', 'BASTION', [], 'DEFAULT', 'TestRoom');
    });

    it('should initialize and attach restart button events', () => {
        UIEvents.initListeners(mockUI);
        document.getElementById('restart-btn').click();
        expect(mockUI.onRestart).toHaveBeenCalled();
        document.getElementById('win-btn').click();
        expect(mockUI.onRestart).toHaveBeenCalledTimes(2);
        document.getElementById('true-win-btn').click();
        expect(mockUI.onRestart).toHaveBeenCalledTimes(3);
    });

    it('should initialize and attach protocol selection events', () => {
        UIEvents.initListeners(mockUI);
        const cards = document.querySelectorAll('.protocol-card');
        cards[0].click();
        expect(cards[0].classList.contains('selected')).toBe(true);
        expect(cards[1].classList.contains('selected')).toBe(false);
    });

    it('should initialize mutation checkboxes', () => {
        UIEvents.initListeners(mockUI);
        const checkbox = document.getElementById('mut-chaos');

        checkbox.checked = true;
        checkbox.dispatchEvent(new window.Event('change'));
        expect(checkbox.parentElement.classList.contains('active')).toBe(true);

        checkbox.checked = false;
        checkbox.dispatchEvent(new window.Event('change'));
        expect(checkbox.parentElement.classList.contains('active')).toBe(false);
    });
});
