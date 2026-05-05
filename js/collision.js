import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';
import { PowerUp } from './powerup.js';
import { LoreFragment } from './lore_fragment.js';
import { CollisionResolver } from './core/collision_resolver.js';

/**
 * Handles collision detection and resolution.
 */
export class CollisionSystem {
    constructor(particleSystem, ui, loreSystem) {
        this.particleSystem = particleSystem;
        this.ui = ui;
        this.loreSystem = loreSystem;
    }

    resolveEntityCollision(e1, e2, player) {
        return CollisionResolver.resolveEntityCollision(e1, e2, player, this.particleSystem, this.ui);
    }

    resolveRiftCollision(entity, rift) {
        if (rift.markedForDeletion) return false;

        const dist = Utils.getDistance(entity.x, entity.y, rift.x, rift.y);
        const minOverlap = entity.radius + rift.radius;

        if (dist < minOverlap) {
            entity.x = Math.random() * CONSTANTS.WORLD_WIDTH;
            entity.y = Math.random() * CONSTANTS.WORLD_HEIGHT;
            rift.markedForDeletion = true;
            this.particleSystem.emitExplosion(rift.x, rift.y, rift.color, 50);
            return true;
        }
        return false;
    }

    resolveFoodCollision(entity, food) {
        const dist = Utils.getDistance(entity.x, entity.y, food.x, food.y);
        if (dist < entity.radius + food.radius) {
            let addedMass = Math.PI * food.radius * food.radius;

            if (food instanceof LoreFragment) {
                addedMass = 500;
                if (!entity.type && this.loreSystem) {
                    const fragment = this.loreSystem.getRandomLocked();
                    if (fragment) {
                        this.loreSystem.unlock(fragment.id);
                        if (this.ui.showLorePopup) this.ui.showLorePopup(fragment.text);
                    }
                }
            }

            if (food instanceof PowerUp) {
                if (typeof entity.applyPowerUp === 'function') {
                    entity.applyPowerUp(food.powerUpType);
                }
                this.particleSystem.emitExplosion(food.x, food.y, '#FFFFFF', 40);
            }

            entity.grow(addedMass);

            if (food instanceof LoreFragment) {
                this.particleSystem.emitExplosion(food.x, food.y, '#FFD700', 30);
            }

            this.particleSystem.emit(food.x, food.y, food.color, 5, 1, 2, 20);
            return true;
        }
        return false;
    }
}
