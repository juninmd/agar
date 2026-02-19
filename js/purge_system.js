import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';
import { Spawner } from './spawner.js';
import { Sanctuary } from './sanctuary.js';

export class PurgeSystem {
    constructor(ui) {
        this.ui = ui;
        this.timer = 0;
        this.isActive = false;
        this.nextPurgeTime = 3600; // 60 seconds
        this.duration = 900; // 15 seconds
        this.activeTime = 0;
        this.sanctuaries = [];
    }

    update(player, bots) {
        if (this.isActive) {
            this.activeTime--;
            this.updateSanctuaries(player, bots);

            if (this.activeTime <= 0) {
                this.endPurge(bots, player);
            } else {
                // Ensure Elite Hunters exist (min 3)
                const hunters = bots.filter(b => b.type === 'ELITE_HUNTER');
                if (hunters.length < 3) {
                     const angle = Math.random() * Math.PI * 2;
                     const dist = 500 + Math.random() * 500;
                     const hunter = Spawner.spawnPurgeBot(player, angle, dist);
                     bots.push(hunter);
                }
            }
        } else {
            this.timer++;
            if (this.timer >= this.nextPurgeTime) {
                this.startPurge();
            }
        }
    }

    startPurge() {
        this.isActive = true;
        this.timer = 0;
        this.activeTime = this.duration;
        this.spawnSanctuaries();
        if (this.ui && this.ui.showCorruptionAlert) {
            this.ui.showCorruptionAlert("⚠ SYSTEM PURGE INITIATED ⚠");
        }
        document.body.classList.add('glitch-mode');
    }

    spawnSanctuaries() {
        this.sanctuaries = [];
        const count = 2; // Spawn 2 safe zones
        for (let i = 0; i < count; i++) {
            const x = Utils.randomRange(200, CONSTANTS.WORLD_WIDTH - 200);
            const y = Utils.randomRange(200, CONSTANTS.WORLD_HEIGHT - 200);
            const radius = 300;
            this.sanctuaries.push(new Sanctuary(x, y, radius));
        }
    }

    updateSanctuaries(player, bots) {
        let playerSafe = false;

        this.sanctuaries.forEach(s => {
            if (s.checkCollision(player)) {
                playerSafe = true;
            }

            // Repel Elite Hunters
            bots.forEach(bot => {
                if (bot.type === 'ELITE_HUNTER') {
                    const dx = bot.x - s.x;
                    const dy = bot.y - s.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < s.radius + bot.radius) {
                        const angle = Math.atan2(dy, dx);
                        bot.x += Math.cos(angle) * 5;
                        bot.y += Math.sin(angle) * 5;
                        // Force redirect
                        bot.targetX = bot.x + Math.cos(angle) * 200;
                        bot.targetY = bot.y + Math.sin(angle) * 200;
                    }
                }
            });
        });

        player.inSanctuary = playerSafe;
        if (playerSafe) {
            document.body.classList.remove('glitch-mode');
        } else {
            document.body.classList.add('glitch-mode');
        }
    }

    endPurge(bots, player) {
        this.isActive = false;
        this.timer = 0;
        this.sanctuaries = [];
        document.body.classList.remove('glitch-mode');
        if (player) player.inSanctuary = false;

        // Remove all Elite Hunters
        bots.forEach(bot => {
            if (bot.type === 'ELITE_HUNTER') {
                bot.markedForDeletion = true;
            }
        });
    }
}
