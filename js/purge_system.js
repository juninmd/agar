import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';
import { Spawner } from './spawner.js';

export class PurgeSystem {
    constructor(ui) {
        this.ui = ui;
        this.timer = 0;
        this.isActive = false;
        this.nextPurgeTime = 3600; // 60 seconds
        this.duration = 900; // 15 seconds
        this.activeTime = 0;
    }

    update(player, bots) {
        if (this.isActive) {
            this.activeTime--;
            if (this.activeTime <= 0) {
                this.endPurge(bots);
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
        if (this.ui && this.ui.showCorruptionAlert) {
            this.ui.showCorruptionAlert("⚠ SYSTEM PURGE INITIATED ⚠");
        }
        document.body.classList.add('glitch-mode');
    }

    endPurge(bots) {
        this.isActive = false;
        this.timer = 0;
        document.body.classList.remove('glitch-mode');

        // Remove all Elite Hunters
        bots.forEach(bot => {
            if (bot.type === 'ELITE_HUNTER') {
                bot.markedForDeletion = true;
            }
        });
    }
}
