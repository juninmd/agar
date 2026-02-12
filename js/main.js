import { InputHandler } from './input.js';
import { Renderer } from './renderer.js';
import { UIManager } from './ui.js';
import { Game } from './game.js';
import { LoreSystem } from './lore_system.js';
import { DatabaseUI } from './database_ui.js';

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
const loreSystem = new LoreSystem();
const databaseUI = new DatabaseUI(loreSystem);
const game = new Game(canvas, renderer, input, ui, loreSystem);

// Expose for testing/debugging
Object.defineProperties(window, {
    game: { get: () => game },
    player: { get: () => game.player },
    bots: { get: () => game.bots },
    foods: { get: () => game.foods },
    firewall: { get: () => game.firewall },
    particleSystem: { get: () => game.particleSystem },
    triggerPurge: { get: () => game.triggerPurge.bind(game) },
    loreSystem: { get: () => loreSystem }
});

import { PowerUp } from './powerup.js';
import { Bot } from './bot.js';

window.PowerUp = PowerUp;
window.Bot = Bot;
