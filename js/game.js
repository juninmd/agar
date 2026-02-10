import { Player } from './player.js';
import { Bot } from './bot.js';
import { Food } from './food.js';
import { PowerUp } from './powerup.js';
import { LoreFragment } from './lore_fragment.js';
import { LoreSystem } from './lore_system.js';
import { Firewall } from './firewall.js';
import { ParticleSystem } from './particles.js';
import { CollisionSystem } from './collision.js';
import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';

export class Game {
    constructor(canvas, renderer, input, ui) {
        this.canvas = canvas;
        this.renderer = renderer;
        this.input = input;
        this.ui = ui;

        this.player = null;
        this.bots = [];
        this.foods = [];
        this.firewall = null;
        this.loreSystem = new LoreSystem();
        this.particleSystem = new ParticleSystem();
        this.collisionSystem = new CollisionSystem(this.particleSystem, ui, this.loreSystem);

        this.gameRunning = false;
        this.animationId = null;
        this.systemIntegrity = 100;
        this.purgeTimer = 0;
        this.firewallTimer = 0;
        this.singularityActive = false;

        this.ui.onStart = (name, protocol) => this.start(name, protocol);
        this.ui.onRestart = () => this.start(this.player?.name, this.player?.protocol?.id);
        this.input.onDash = () => this.handleDash();
        this.input.onAbility = () => this.handleAbility();
    }

    start(name, protocol) {
        this.player = new Player(CONSTANTS.WORLD_WIDTH / 2, CONSTANTS.WORLD_HEIGHT / 2, protocol, name);
        this.foods = Array(CONSTANTS.FOOD_COUNT).fill().map(() => this.spawnFood());
        this.bots = Array(CONSTANTS.BOT_COUNT).fill().map(() => this.spawnBot());
        this.firewall = new Firewall();
        this.systemIntegrity = 100;
        this.singularityActive = false;
        this.gameRunning = true;
        this.ui.setGameActive(true);
        this.loop();
    }

    spawnFood() {
        const x = Utils.randomRange(0, CONSTANTS.WORLD_WIDTH);
        const y = Utils.randomRange(0, CONSTANTS.WORLD_HEIGHT);
        const rand = Math.random();
        if (rand < 0.005) return new LoreFragment(x, y);
        if (rand < 0.015) return new PowerUp(x, y, CONSTANTS.POWERUP.RADIUS, CONSTANTS.POWERUP.COLOR);
        return new Food(x, y, Utils.randomRange(CONSTANTS.MIN_FOOD_RADIUS, CONSTANTS.MAX_FOOD_RADIUS), Utils.randomColor(CONSTANTS.COLORS));
    }

    spawnBot() {
        // Simple bot spawn logic for brevity
        const types = ['NORMAL', 'SEEKER', 'GUARDIAN', 'GLITCH', 'CORRUPTER'];
        const type = types[Math.floor(Math.random() * types.length)]; // Simplified
        return new Bot(Utils.randomRange(0, CONSTANTS.WORLD_WIDTH), Utils.randomRange(0, CONSTANTS.WORLD_HEIGHT), CONSTANTS.INITIAL_RADIUS, Utils.randomColor(CONSTANTS.COLORS), type);
    }

    handleDash() {
        if (this.gameRunning && this.player && this.player.dash()) {
            this.particleSystem.emitDash(this.player.x, this.player.y, this.player.color);
        }
    }

    handleAbility() {
        if (this.gameRunning && this.player) {
            this.player.triggerAbility(this.bots);
        }
    }

    update() {
        if (this.player.markedForDeletion) return this.ui.showGameOver("DATA PURGED", this.player.mass);
        if (this.bots.length === 0) return this.ui.showWin();

        this.systemIntegrity -= 0.03;
        this.particleSystem.update();

        // Firewall & Purge Logic
        this.firewallTimer++;
        if (!this.firewall.active && this.firewallTimer > 1800) {
            this.firewall.start();
            this.firewallTimer = 0;
            this.ui.showWarning(true);
        }
        if (this.firewall.active) this.firewall.update();

        // Singularity Event
        if (!this.singularityActive && this.player.mass > 5000 * 0.8) {
            this.singularityActive = true;
            this.ui.showCorruptionAlert("⚠ SINGULARITY DETECTED ⚠");
            this.renderer.screenShake = 50;
        }

        if (this.singularityActive) {
            const pullStrength = 2.0;
            [...this.bots, ...this.foods].forEach(entity => {
                const dx = this.player.x - entity.x;
                const dy = this.player.y - entity.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist > 100 && dist < 1000) {
                    entity.x += (dx / dist) * pullStrength;
                    entity.y += (dy / dist) * pullStrength;
                }
            });
        }

        // Updates
        const all = [this.player, ...this.bots];
        this.player.setTarget(this.player.x + (this.input.mouseX - this.canvas.width/2), this.player.y + (this.input.mouseY - this.canvas.height/2));
        this.player.update(CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT);
        this.bots.forEach(b => b.update(CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT, all, this.foods));

        // Collisions
        all.forEach(e => {
            this.foods = this.foods.filter(f => !this.collisionSystem.resolveFoodCollision(e, f));
            if (this.foods.length < CONSTANTS.FOOD_COUNT) this.foods.push(this.spawnFood());
        });

        for (let i = 0; i < all.length; i++) {
            for (let j = i + 1; j < all.length; j++) {
                this.collisionSystem.resolveEntityCollision(all[i], all[j], this.player);
            }
        }

        this.bots = this.bots.filter(b => !b.markedForDeletion);
        if (this.bots.length < CONSTANTS.BOT_COUNT) this.bots.push(this.spawnBot()); // Respawn bots

        this.ui.updateScore(this.player.mass);
        this.ui.updateIntegrity(this.systemIntegrity);
        if (this.player.abilities) {
            this.ui.updateAbilityCooldown(this.player.abilities.getCooldownPercent());
        }
    }

    triggerPurge() {
        console.log("SYSTEM PURGE TRIGGERED");
        document.body.classList.add('glitch-mode');
        this.ui.showPurgeAlert();
        this.renderer.screenShake = 50;

        const spawnCount = 8;
        const distance = 600;
        for (let i = 0; i < spawnCount; i++) {
            const angle = (Math.PI * 2 / spawnCount) * i;
            let sx = this.player.x + Math.cos(angle) * distance;
            let sy = this.player.y + Math.sin(angle) * distance;
            sx = Math.max(0, Math.min(CONSTANTS.WORLD_WIDTH, sx));
            sy = Math.max(0, Math.min(CONSTANTS.WORLD_HEIGHT, sy));

            const bot = new Bot(sx, sy, CONSTANTS.INITIAL_RADIUS, '#FF0000', 'SEEKER');
            bot.mass = Math.max(500, this.player.mass * 1.1);
            bot.radius = Utils.getRadiusFromMass(bot.mass);
            bot.speedBoost = 1.2;
            bot.isGlitching = true;
            this.bots.push(bot);
            this.particleSystem.emit(sx, sy, '#FF0000', 20);
        }

        setTimeout(() => {
            document.body.classList.remove('glitch-mode');
        }, 10000);
    }

    loop() {
        if (!this.gameRunning) return;
        this.update();
        this.renderer.updateCamera(this.player);
        this.renderer.render(this);
        requestAnimationFrame(() => this.loop());
    }
}
