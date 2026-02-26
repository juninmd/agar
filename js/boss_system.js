import { Boss } from './boss.js';

export class BossSystem {
    constructor(game) {
        this.game = game;
        this.activeBoss = null;
        this.spawnTimer = 0;
        this.minSpawnMass = 3000;
        this.bossSpawned = false; // Flag to ensure only one boss per run or session
    }

    update(player) {
        // Check if boss is dead
        if (this.activeBoss && this.activeBoss.markedForDeletion) {
             this._handleBossDeath();
        }

        // Spawn logic
        if (!this.activeBoss && !this.bossSpawned && player.mass > this.minSpawnMass) {
             if (Math.random() < 0.005) { // 0.5% chance per frame once mass is reached
                 this.spawnBoss(player);
             }
        }
    }

    spawnBoss(player) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 1200; // Far enough to be ominous
        const bx = player.x + Math.cos(angle) * dist;
        const by = player.y + Math.sin(angle) * dist;

        this.activeBoss = new Boss(bx, by);
        this.game.bots.push(this.activeBoss);
        this.bossSpawned = true;

        // Notify UI
        this.game.ui.showCorruptionAlert("⚠ SIGNAL DETECTED: THE SENTINEL ⚠");
        this.game.renderer.screenShake = 50;
    }

    _handleBossDeath() {
        this.activeBoss = null;
        this.game.ui.showNarrative("ARCHIVE UNLOCKED: SENTINEL DEFEATED.", "SUCCESS");
        this.game.player.grow(2000); // Big reward
        this.game.renderer.screenShake = 20;
    }
}
