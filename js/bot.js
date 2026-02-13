import { Player } from './player.js';
import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';
import { AISystem } from './ai_system.js';

export class Bot extends Player {
    constructor(x, y, radius, color, typeKey = "NORMAL") {
        const typeData = CONSTANTS.BOT_TYPES[typeKey] || CONSTANTS.BOT_TYPES.NORMAL;
        const finalColor = typeData.color || color;
        const name = typeData.namePrefix + "_" + Math.floor(Math.random() * 999);

        super(x, y, radius, finalColor, name);

        this.type = typeKey;
        this.typeData = typeData;
        this.changeDirTimer = 0;
        this.baseSpeedMult = typeData.speedMultiplier;

        if (this.type === "GLITCH") {
            this.isGlitching = true;
        }
    }

    update(worldWidth, worldHeight, entities, foods) {
        AISystem.think(this, entities, foods);

        if (this.speedBoost > 1) {
            this.speedBoost *= 0.95;
            if (this.speedBoost < 1) this.speedBoost = 1;
        }

        if (this.type === "GLITCH") {
            if (Math.random() < this.typeData.teleportChance) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 100;
                this.x += Math.cos(angle) * dist;
                this.y += Math.sin(angle) * dist;
                this.checkBounds(worldWidth, worldHeight);
            }
        }

        const dist = Utils.getDistance(this.x, this.y, this.targetX, this.targetY);
        const speedDecay = Math.pow(CONSTANTS.INITIAL_RADIUS / this.radius, 0.4);
        const maxSpeed = CONSTANTS.PLAYER_SPEED_BASE * speedDecay * this.speedBoost * this.baseSpeedMult;

        if (dist > 0) {
            if (dist < 5) {
                this.velocity.x = 0;
                this.velocity.y = 0;
            } else {
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                this.velocity.x = (dx / dist) * maxSpeed;
                this.velocity.y = (dy / dist) * maxSpeed;
            }
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.checkBounds(worldWidth, worldHeight);
    }
}
