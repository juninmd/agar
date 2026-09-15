import { Player } from './player.js';
import { Spawner } from './spawner.js';
import { Firewall } from './firewall.js';
import { ParticleSystem } from './particles.js';
import { CollisionSystem } from './collision.js';
import { SingularitySystem } from './singularity_system.js';
import { PurgeSystem } from './purge_system.js';
import { NarrativeSystem } from './narrative_system.js';
import { CONSTANTS } from './constants.js';
import { GhostSystem } from './ghost_system.js';
import { BossSystem } from './boss_system.js';
import { RaidSystem } from './raid_system.js';
import { WeaverSystem } from './weaver_system.js';
import { RiftSystem } from './rift_system.js';
import { GameSystems } from './game_systems.js';
import { Food } from './food.js';
import { Utils } from './utils.js';
import { MutationSystem } from './mutation_system.js';
import { SpatialHash } from './core/spatial_hash.js';
import { GameCollisions } from './core/game_collisions.js';
import { NetworkSystem } from './network_system.js';
import { RendererBackground } from './renderer_background.js';

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
        this.purgeSystem = new PurgeSystem();
        this.narrativeSystem = new NarrativeSystem(ui);
        this.ghostSystem = new GhostSystem(this);
        this.bossSystem = new BossSystem(this);
        this.raidSystem = new RaidSystem();
        this.weaverSystem = new WeaverSystem(this);
        this.riftSystem = new RiftSystem(this);
        this.systems = new GameSystems(this);
        this.mutationSystem = new MutationSystem();
        this.spatialHash = new SpatialHash(200); // 200px cell size
        this.network = new NetworkSystem();
        this.checkedPairs = new Set();
        this.queryResult = new Set();
        this.gameRunning = false;
        this.systemIntegrity = 100;
        this.firewallTimer = 0;

        this.ui.onStart = (name, protocol, mutations, skin, roomId) => this.start(name, protocol, mutations, skin, roomId);
        this.ui.onRestart = () => this.start(this.player?.name, this.player?.protocol?.id, this.mutationSystem.activeMutations, this.player?.skin, this.network.roomId);
        this.input.onDash = () => this.handleDash();
        this.input.onAbility = () => this.handleAbility();

        // Start background loop for UI
        this.loop();
    }

    start(name, protocol, mutations = [], skin = 'DEFAULT', roomId = null) {
        this.mutationSystem.applyModifiers(mutations, CONSTANTS);

        if (roomId) {
            this.network.connect(roomId);
        }
        this.player = new Player(CONSTANTS.WORLD_WIDTH / 2, CONSTANTS.WORLD_HEIGHT / 2, protocol, name, skin);
        this.foods = Array(CONSTANTS.FOOD_COUNT).fill().map(() => Spawner.spawnFood());
        this.bots = Array(CONSTANTS.BOT_COUNT).fill().map(() => Spawner.spawnBot());
        this.ghostSystem.spawnGhosts(this);
        this.firewall = new Firewall();
        this.systemIntegrity = 100;
        this.singularitySystem.active = false;
        this.purgeSystem.isActive = false;
        this.purgeSystem.timer = 0;
        this.bossSystem.activeBoss = null;
        this.bossSystem.bossSpawned = false;
        this.raidSystem.isActive = false;
        this.raidSystem.activeTitan = null;
        this.weaverSystem.isActive = false;
        this.weaverSystem.hasSpawned = false;
        this.weaverSystem.activeWeaver = null;
        this.riftSystem.reset();
        this.gameRunning = true;
        this.ui.setGameActive(true);
    }

    handleDash() {
        if (this.gameRunning && this.player) {
            const ejectedMass = this.player.dash();
            if (ejectedMass > 0) {
                this.particleSystem.emitDash(this.player.x, this.player.y, this.player.color, this.player.velocity.x, this.player.velocity.y);
                Spawner.spawnEjectedMass(this.player, ejectedMass, this.foods);
            }
        }
    }

    handleAbility() {
        if (this.gameRunning && this.player) this.player.triggerAbility(this.bots);
    }

    update() {
        if (this.player.markedForDeletion) return this._handleGameOver();
        if (this.bots.length === 0) {
             if (this.player.protocol.id === 'OMNI') {
                 return this.ui.showTrueWin();
             } else {
                 return this.ui.showWin();
             }
        }

        this.systems.update();

        this.foods = this.foods.filter(f => !f.markedForDeletion);
        this.bots = this.bots.filter(b => !b.markedForDeletion);

        const all = [this.player, ...this.bots];
        this.player.setTarget(
            this.player.x + (this.input.mouseX - this.canvas.width/2),
            this.player.y + (this.input.mouseY - this.canvas.height/2)
        );
        this.player.update(CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT, this.bots);
        this.bots.forEach(b => b.update(CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT, all, this.foods, this));

        if (this.bots.length < CONSTANTS.BOT_COUNT) this.bots.push(Spawner.spawnBot());

        GameCollisions.checkCollisions(this);

        this.network.update(this.player);

        this.ui.updateScore(this.player.mass);
        this.ui.updateIntegrity(this.systemIntegrity);
        if (this.player.abilities) this.ui.updateAbilityCooldown(this.player.abilities.getCooldownPercent());
        this.ui.updateLeaderboard(this.player, this.bots);
        this.ui.minimap.update(this.player, this.bots, CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT);
        this.narrativeSystem.update(this.player, this.systemIntegrity);
    }

    _handleGameOver() {
        this.ghostSystem.saveGhost(this.player);
        this.gameRunning = false;
        return this.ui.showGameOver("DATA PURGED", this.player.mass);
    }

    loop() {
        if (!this.gameRunning) {
            this.renderer.clear();
            this.renderer.applyTransform(this.systemIntegrity);
            RendererBackground.drawGrid(this.renderer.ctx, this, this.renderer.camX, this.renderer.camY, this.canvas.width, this.canvas.height);
            this.renderer.ctx.restore();
        } else {
            this.update();
            this.renderer.updateCamera(this.player);
            this.renderer.render(this);
            this.ui.updateFPS(this.renderer.fps);
        }

        requestAnimationFrame(() => this.loop());
    }
}
