import { InputHandler } from './input.js';
import { Renderer } from './renderer.js';
import { UIManager } from './ui.js';
import { Game } from './game.js';
import { LoreSystem } from './lore_system.js';
import { DatabaseUI } from './database_ui.js';
import { BootSequence } from './boot_sequence.js';
import { PowerUp } from './powerup.js';
import { Bot } from './bot.js';

const canvas = document.getElementById('gameCanvas');
const mobileDashBtn = document.getElementById('mobile-dash-btn');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const ctx = canvas.getContext('2d');

function initGame() {
    // Initialize systems only after boot
    const input = new InputHandler(canvas, mobileDashBtn);
    const renderer = new Renderer(canvas, ctx);
    const ui = new UIManager();
    const loreSystem = new LoreSystem();
    new DatabaseUI(loreSystem); // Attaches itself
    const game = new Game(canvas, renderer, input, ui, loreSystem);

    // Expose for testing/debugging
    Object.defineProperties(window, {
        game: { get: () => game, configurable: true },
        player: { get: () => game.player, configurable: true },
        bots: { get: () => game.bots, configurable: true },
        foods: { get: () => game.foods, configurable: true },
        firewall: { get: () => game.firewall, configurable: true },
        particleSystem: { get: () => game.particleSystem, configurable: true },
        triggerPurge: { get: () => game.triggerPurge.bind(game), configurable: true },
        loreSystem: { get: () => loreSystem, configurable: true }
    });

    console.log("[SYSTEM] Game Initialized");
}

// Expose classes globally for tests
window.PowerUp = PowerUp;
window.Bot = Bot;

// Start Boot Sequence
new BootSequence(initGame).start();
