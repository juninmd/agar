import { Player } from './player.js';
import { Spawner } from './spawner.js';
import { Firewall } from './firewall.js';
import { ParticleSystem } from './particles.js';
import { CollisionSystem } from './collision.js';
import { SingularitySystem } from './singularity_system.js';
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
        this.singularitySystem = new SingularitySystem(ui, renderer);
        this.gameRunning = false;
        this.systemIntegrity = 100;
        this.firewallTimer = 0;

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
        this.singularitySystem.active = false;
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
        this.updateFirewall();

        const allEntities = [...this.bots, ...this.foods];
        this.singularitySystem.update(this.player, allEntities);
        this.singularityActive = this.singularitySystem.active; // Sync for renderer

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

    updateFirewall() {
        this.firewallTimer++;
        if (!this.firewall.active && this.firewallTimer > 1800) {
            this.firewall.start();
            this.firewallTimer = 0;
            this.ui.showWarning(true);
        }
        if (this.firewall.active) this.firewall.update();
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

    loop() {
        if (!this.gameRunning) return;
        this.update();
        this.renderer.updateCamera(this.player);
        this.renderer.render(this);
        requestAnimationFrame(() => this.loop());
    }
}
