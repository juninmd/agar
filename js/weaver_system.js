import { Bot } from './bot.js';
import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';

export class WeaverSystem {
    constructor(game) {
        this.game = game;
        this.isActive = false;
        this.hasSpawned = false;
        this.activeWeaver = null;
        this.threadTimer = 0;
    }

    update(gameState) {
        if (!this.hasSpawned && gameState.player && gameState.player.mass > 1500) {
            // 2% chance to spawn per frame when mass is above 1500
            if (Math.random() < 0.02) {
                this.spawnWeaver(gameState);
            }
        }

        if (this.isActive && this.activeWeaver) {
            if (this.activeWeaver.markedForDeletion) {
                this._handleWeaverDeath(gameState);
            } else {
                this._weaverBehavior(gameState);
            }
        }
    }

    spawnWeaver(gameState) {
        this.hasSpawned = true;
        this.isActive = true;

        // Spawn far away from player
        let sx, sy;
        do {
            sx = Utils.randomRange(0, CONSTANTS.WORLD_WIDTH);
            sy = Utils.randomRange(0, CONSTANTS.WORLD_HEIGHT);
        } while (Utils.getDistance(sx, sy, gameState.player.x, gameState.player.y) < 1000);

        const radius = Utils.getRadiusFromMass(3000); // Massive
        this.activeWeaver = new Bot(sx, sy, radius, '#8A2BE2', 'GLITCH_WEAVER');
        this.activeWeaver.mass = 3000;
        this.activeWeaver.name = "THE GLITCH WEAVER";

        gameState.bots.push(this.activeWeaver);

        if (gameState.ui && gameState.ui.showWarning) {
            // We can reuse showWarning or create a custom one. For now, we just log and maybe show a general alert if possible.
            console.log("[SYSTEM] THE GLITCH WEAVER HAS ENTERED THE SECTOR.");
        }
    }

    _weaverBehavior(gameState) {
        this.threadTimer++;
        // Drop a thread every ~3 seconds (assuming 60fps)
        if (this.threadTimer > 180) {
            this.threadTimer = 0;
            this._dropThread(gameState);
        }
    }

    _dropThread(gameState) {
        // Drop a small corrupter bot (data thread) behind the weaver
        const radius = Utils.getRadiusFromMass(50);
        const thread = new Bot(this.activeWeaver.x, this.activeWeaver.y, radius, '#1a0000', 'CORRUPTER');
        thread.name = "DATA_THREAD";
        thread.mass = 50;
        gameState.bots.push(thread);

        // Visual effect
        if (gameState.particleSystem) {
            for (let i = 0; i < 5; i++) {
                gameState.particleSystem.emit(this.activeWeaver.x, this.activeWeaver.y, '#8A2BE2');
            }
        }
    }

    _handleWeaverDeath(gameState) {
        this.isActive = false;
        this.activeWeaver = null;
        console.log("[SYSTEM] THE GLITCH WEAVER HAS BEEN ASSIMILATED.");

        // Massive reward happens naturally via eating mass, but we can also trigger lore unlock
        if (gameState.loreSystem) {
            // Unlock fragment 35 directly
            const newFrag = gameState.loreSystem.unlock(35);
            if (newFrag && gameState.ui && gameState.ui.showPopup) {
                gameState.ui.showPopup(`LORE UNLOCKED: ${newFrag.text}`);
            }
        }
    }
}
