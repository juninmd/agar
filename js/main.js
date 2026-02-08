import { InputHandler } from './input.js';
import { Renderer } from './renderer.js';
import { UIManager } from './ui.js';
import { Game } from './game.js';

const canvas = document.getElementById('gameCanvas');
const mobileDashBtn = document.getElementById('mobile-dash-btn');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const ctx = canvas.getContext('2d');
const input = new InputHandler(canvas, mobileDashBtn);
const renderer = new Renderer(canvas, ctx);
const ui = new UIManager();
const game = new Game(canvas, renderer, input, ui);

// Expose for testing/debugging
Object.defineProperties(window, {
    game: { get: () => game },
    player: { get: () => game.player },
    bots: { get: () => game.bots },
    foods: { get: () => game.foods },
    firewall: { get: () => game.firewall },
    particleSystem: { get: () => game.particleSystem },
    triggerPurge: { get: () => game.triggerPurge.bind(game) }
});

// Import modules for potential console usage if needed
// window.Bot = Bot; // but Bot is not imported here.
// If tests need specific classes exposed on window, main.js usually did it.
// Original main.js: window.PowerUp = PowerUp; window.triggerPurge = triggerPurge;
// I should import PowerUp to expose it.

import { PowerUp } from './powerup.js';
window.PowerUp = PowerUp;
