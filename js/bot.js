import { Player } from './player.js';
import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';

export class Bot extends Player {
    constructor(x, y, radius, color) {
        // Random names for bots
        const botNames = ["Daemon", "Glitch", "Trojan", "Worm", "Virus", "Null", "NaN", "404", "Root", "Admin"];
        const name = botNames[Math.floor(Math.random() * botNames.length)] + "_" + Math.floor(Math.random() * 100);

        super(x, y, radius, color, name);

        this.changeDirTimer = 0;
        // Bots start with random mass sometimes larger
        if (Math.random() < 0.2) {
            this.grow(Utils.randomRange(100, 500));
        }
    }

    update(worldWidth, worldHeight, entities, foods) {
        // AI Logic
        this.think(entities, foods);

        // Execute movement (parent logic)
        super.update(worldWidth, worldHeight);
    }

    think(entities, foods) {
        let bestTarget = null;
        let bestScore = -Infinity;
        let threatVector = { x: 0, y: 0 };
        let hasThreat = false;

        // 1. Check for threats (Larger entities) and Prey (Smaller entities)
        // We only care about nearby entities to save CPU? For now check all.

        entities.forEach(other => {
            if (other === this) return;

            const dist = Utils.getDistance(this.x, this.y, other.x, other.y);

            // Optimization: Ignore far away things
            if (dist > 500 + this.radius) return;

            if (other.radius > this.radius * 1.1) {
                // Threat! Run away!
                hasThreat = true;
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                // Add to threat vector (weighted by distance)
                threatVector.x += dx / dist;
                threatVector.y += dy / dist;
            } else if (other.radius * 1.1 < this.radius) {
                // Prey! Chase!
                // Score based on size (bigger prey = better) and distance (closer = better)
                const score = (other.radius) / (dist + 1);
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = other;
                }
            }
        });

        if (hasThreat) {
            // Run away from average threat direction
            this.setTarget(this.x + threatVector.x * 100, this.y + threatVector.y * 100);
        } else if (bestTarget) {
            // Chase prey
            this.setTarget(bestTarget.x, bestTarget.y);
        } else {
            // No entities nearby. Look for food.
            let closestFood = null;
            let minFoodDist = Infinity;

            // Checking ALL food is expensive (400 items * 25 bots).
            // Just check a random sample or assume food is everywhere and wander?
            // Let's check 20 random food items to simulate limited vision/cpu
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
                // Wander randomly
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
