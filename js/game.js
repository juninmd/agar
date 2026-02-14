import { Player } from './player.js';
import { Spawner } from './spawner.js';
import { Firewall } from './firewall.js';
import { ParticleSystem } from './particles.js';
import { CollisionSystem } from './collision.js';
import { CONSTANTS } from './constants.js';

export class Game {
    constructor(canvas, renderer, input, ui, loreSystem) {
        this.canvas = canvas;
        this.renderer = renderer;
        this.input = input;
        this.ui = ui;
        this.player = null;
        this.bots = [];
        this.foods = [];
        this.firewall = null;
        this.loreSystem = loreSystem;
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
        this.foods = Array(CONSTANTS.FOOD_COUNT).fill().map(() => Spawner.spawnFood());
        this.bots = Array(CONSTANTS.BOT_COUNT).fill().map(() => Spawner.spawnBot());
        this.firewall = new Firewall();
        this.systemIntegrity = 100;
        this.singularityActive = false;
        this.gameRunning = true;
        this.ui.setGameActive(true);
        this.loop();
    }

    handleDash() {
        if (this.gameRunning && this.player && this.player.dash())
            this.particleSystem.emitDash(this.player.x, this.player.y, this.player.color);
    }

    handleAbility() {
        if (this.gameRunning && this.player) this.player.triggerAbility(this.bots);
    }

    update() {
        if (this.player.markedForDeletion) return this.ui.showGameOver("DATA PURGED", this.player.mass);
        if (this.bots.length === 0) return this.ui.showWin();

        this.systemIntegrity -= 0.03;
        this.particleSystem.update();
        this.firewallTimer++;
        if (!this.firewall.active && this.firewallTimer > 1800) {
            this.firewall.start();
            this.firewallTimer = 0;
            this.ui.showWarning(true);
        }
        if (this.firewall.active) this.firewall.update();
        this._updateSingularity();

        const all = [this.player, ...this.bots];
        this.player.setTarget(
            this.player.x + (this.input.mouseX - this.canvas.width/2),
            this.player.y + (this.input.mouseY - this.canvas.height/2)
        );
        this.player.update(CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT, this.bots);
        this.bots.forEach(b => b.update(CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT, all, this.foods));
        this._checkCollisions(all);

        this.bots = this.bots.filter(b => !b.markedForDeletion);
        if (this.bots.length < CONSTANTS.BOT_COUNT) this.bots.push(Spawner.spawnBot());

        this.ui.updateScore(this.player.mass);
        this.ui.updateIntegrity(this.systemIntegrity);
        if (this.player.abilities) this.ui.updateAbilityCooldown(this.player.abilities.getCooldownPercent());
    }

    _updateSingularity() {
        if (!this.singularityActive && this.player.mass > 5000 * 0.8) {
            this.singularityActive = true;
            this.ui.showCorruptionAlert("⚠ SINGULARITY DETECTED ⚠");
            this.renderer.screenShake = 50;
        }
        if (this.singularityActive) {
            const pullStrength = 2.0;
            [...this.bots, ...this.foods].forEach(entity => {
                const dist = Math.hypot(this.player.x - entity.x, this.player.y - entity.y);
                if (dist > 100 && dist < 1000) {
                    entity.x += ((this.player.x - entity.x) / dist) * pullStrength;
                    entity.y += ((this.player.y - entity.y) / dist) * pullStrength;
                }
            });
        }
    }

    _checkCollisions(all) {
        all.forEach(e => {
            this.foods = this.foods.filter(f => !this.collisionSystem.resolveFoodCollision(e, f));
            if (this.foods.length < CONSTANTS.FOOD_COUNT) this.foods.push(Spawner.spawnFood());
        });
        for (let i = 0; i < all.length; i++) {
            for (let j = i + 1; j < all.length; j++) this.collisionSystem.resolveEntityCollision(all[i], all[j], this.player);
        }
    }

    triggerPurge() {
        document.body.classList.add('glitch-mode');
        this.ui.showPurgeAlert();
        this.renderer.screenShake = 50;
        const spawnCount = 8;
        for (let i = 0; i < spawnCount; i++) {
            const angle = (Math.PI * 2 / spawnCount) * i;
            const bot = Spawner.spawnPurgeBot(this.player, angle, 600);
            this.bots.push(bot);
            this.particleSystem.emit(bot.x, bot.y, '#FF0000', 20);
        }
        setTimeout(() => document.body.classList.remove('glitch-mode'), 10000);
    }

    loop() {
        if (!this.gameRunning) return;
        this.update();
        this.renderer.updateCamera(this.player);
        this.renderer.render(this);
        requestAnimationFrame(() => this.loop());
    }
}
