import { Boss } from './boss.js';
import { GreatFirewall } from './great_firewall.js';

export class BossSystem {
    constructor(game) {
        this.game = game;
        this.activeBoss = null;
        this.spawnTimer = 0;
        this.minSpawnMass = 3000;
        this.minFirewallMass = 4000; // Phase 7
        this.bossSpawned = false; // Flag to ensure only one boss per run or session
        this.firewallSpawned = false;
    }

    update(player) {
        // Check if boss is dead
        if (this.activeBoss && this.activeBoss.markedForDeletion) {
             this._handleBossDeath();
        }

        // Sentinel Spawn logic
        if (!this.activeBoss && !this.bossSpawned && player.mass > this.minSpawnMass && player.mass < this.minFirewallMass) {
             if (Math.random() < 0.005) { // 0.5% chance per frame once mass is reached
                 this.spawnBoss(player);
             }
        }

        // Great Firewall Spawn logic
        if (!this.activeBoss && !this.firewallSpawned && player.mass > this.minFirewallMass) {
            if (Math.random() < 0.005) {
                this.spawnGreatFirewall(player);
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

    spawnGreatFirewall(player) {
        this.activeBoss = new GreatFirewall(0, 0); // Position is handled internally
        this.game.bots.push(this.activeBoss);
        this.firewallSpawned = true;

        // Notify UI
        this.game.ui.showCorruptionAlert("⚠ KERNEL ALERT: THE GREAT FIREWALL INITIALIZED ⚠");
        this.game.renderer.screenShake = 100;
    }

    _handleBossDeath() {
        const isFirewall = this.activeBoss && this.activeBoss.type === 'GREAT_FIREWALL';
        this.activeBoss = null;

        if (isFirewall) {
            this.game.ui.showNarrative("SYSTEM BREACHED: FIREWALL OVERRIDDEN.", "SUCCESS");
            this.game.player.grow(3000);
        } else {
            this.game.ui.showNarrative("ARCHIVE UNLOCKED: SENTINEL DEFEATED.", "SUCCESS");
            this.game.player.grow(2000); // Big reward
        }

        this.game.renderer.screenShake = 20;
    }
}
