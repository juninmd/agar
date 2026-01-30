import { Player } from './player.js';
import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';

export class Bot extends Player {
    constructor(x, y, radius, color, typeKey = "NORMAL") {
        const typeData = CONSTANTS.BOT_TYPES[typeKey] || CONSTANTS.BOT_TYPES.NORMAL;

        // Use type specific color if defined, else use provided random color
        const finalColor = typeData.color || color;
        const name = typeData.namePrefix + "_" + Math.floor(Math.random() * 999);

        super(x, y, radius, finalColor, name);

        this.type = typeKey;
        this.typeData = typeData;
        this.changeDirTimer = 0;

        // Custom physics props
        this.baseSpeedMult = typeData.speedMultiplier;

        // Apply Mass Multiplier
        if (this.typeData.massMultiplier !== 1.0) {
            this.grow(this.mass * (this.typeData.massMultiplier - 1));
        }

        // Glitch effect
        if (this.type === "GLITCH") {
            this.isGlitching = true;
        }
    }

    update(worldWidth, worldHeight, entities, foods) {
        // AI Logic
        this.think(entities, foods);

        // Custom Movement Logic (Overriding Player.update to support baseSpeedMult)
        // Decay speed boost
        if (this.speedBoost > 1) {
            this.speedBoost *= 0.95;
            if (this.speedBoost < 1) this.speedBoost = 1;
        }

        // Glitch Teleport Logic
        if (this.type === "GLITCH") {
            if (Math.random() < this.typeData.teleportChance) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 100;
                this.x += Math.cos(angle) * dist;
                this.y += Math.sin(angle) * dist;
                // Clamp
                this.checkBounds(worldWidth, worldHeight);
            }
        }

        const dist = Utils.getDistance(this.x, this.y, this.targetX, this.targetY);
        const speedDecay = Math.pow(CONSTANTS.INITIAL_RADIUS / this.radius, 0.4);

        // Apply baseSpeedMult here
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

    think(entities, foods) {
        let bestTarget = null;
        let bestScore = -Infinity;
        let threatVector = { x: 0, y: 0 };
        let hasThreat = false;

        entities.forEach(other => {
            if (other === this) return;

            const dist = Utils.getDistance(this.x, this.y, other.x, other.y);

            // Vision range scaled by aggression
            const viewRange = (500 + this.radius) * Math.max(0.5, this.typeData.aggression);
            if (dist > viewRange) return;

            if (other.radius > this.radius * 1.1) {
                // Threat
                hasThreat = true;
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                threatVector.x += dx / dist;
                threatVector.y += dy / dist;
            } else if (other.radius * 1.1 < this.radius) {
                // Prey
                // Multiply score by aggression
                // Seeker (2.0) will prioritize chasing much more than Guardian (0.2)
                const score = ((other.radius) / (dist + 1)) * this.typeData.aggression;
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = other;
                }
            }
        });

        if (hasThreat) {
            this.setTarget(this.x + threatVector.x * 100, this.y + threatVector.y * 100);
        } else if (bestTarget) {
            this.setTarget(bestTarget.x, bestTarget.y);
        } else {
            // Guardian behavior: stay in area?
            // For now, if Guardian, they just wander slowly (aggression is low so they rarely chase)

            let closestFood = null;
            let minFoodDist = Infinity;

            for (let i = 0; i < 20; i++) {
                const randomFood = foods[Math.floor(Math.random() * foods.length)];
                if (!randomFood) continue;
                const d = Utils.getDistance(this.x, this.y, randomFood.x, randomFood.y);
                if (d < minFoodDist) {
                    minFoodDist = d;
                    closestFood = randomFood;
                }
            }

            if (closestFood && minFoodDist < 300) {
                this.setTarget(closestFood.x, closestFood.y);
            } else {
                this.changeDirTimer--;
                if (this.changeDirTimer <= 0) {
                    const angle = Math.random() * Math.PI * 2;
                    const wanderDist = 200;
                    this.setTarget(this.x + Math.cos(angle) * wanderDist, this.y + Math.sin(angle) * wanderDist);
                    this.changeDirTimer = Utils.randomRange(20, 60);
                }
            }
        }
    }
}
