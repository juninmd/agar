import { Utils } from './utils.js';
import { CONSTANTS } from './constants.js';
import { Bot } from './bot.js';
import { PowerUp } from './powerup.js';
import { LoreFragment } from './lore_fragment.js';

/**
 * Handles collision detection and resolution.
 */
export class CollisionSystem {
    constructor(particleSystem, ui, loreSystem) {
        this.particleSystem = particleSystem;
        this.ui = ui;
        this.loreSystem = loreSystem;
    }

    /**
     * Check interactions between two entities.
     * @param {Entity} e1
     * @param {Entity} e2
     * @param {Player} player - Needed for specific player feedback.
     * @returns {Object} Result of collision (e.g. { screenShake: 10 }).
     */
    resolveEntityCollision(e1, e2, player) {
        const dist = Utils.getDistance(e1.x, e1.y, e2.x, e2.y);
        const minOverlap = e1.radius + e2.radius;
        let result = {};

        if (dist < minOverlap) {
            let predator = e1.mass > e2.mass * 1.1 ? e1 : (e2.mass > e1.mass * 1.1 ? e2 : null);
            let prey = predator === e1 ? e2 : e1;

            // Allow player death unless invulnerable
            if (!predator || (prey === player && player.invulnerable)) return result;

            if (dist < predator.radius - prey.radius * 0.2) {
                // Trojan Horse Check
                if (prey instanceof Bot && prey.type === 'CORRUPTER') {
                    const lostMass = predator.mass * 0.6;
                    predator.mass = Math.max(predator.mass - lostMass, CONSTANTS.INITIAL_RADIUS * CONSTANTS.INITIAL_RADIUS * Math.PI);
                    predator.radius = Utils.getRadiusFromMass(predator.mass);

                    this.particleSystem.emitExplosion(predator.x, predator.y, predator.color, 100);
                    this.particleSystem.emitExplosion(prey.x, prey.y, '#FF0000', 50);

                    if (predator === player) {
                        result.screenShake = 30;
                        this.ui.showCorruptionAlert();
                    }
                    prey.markedForDeletion = true;
                } else if (prey instanceof Bot && prey.type === 'DECOY') {
                    // Decoys provide no mass and disappear
                    prey.markedForDeletion = true;
                    this.particleSystem.emitExplosion(prey.x, prey.y, prey.color, 20);
                } else if (prey instanceof Bot && prey.type === 'FRAGMENTER') {
                    // Fragmenters shatter into smaller pieces instead of giving full mass immediately
                    prey.markedForDeletion = true;
                    const shards = 5;
                    for(let i=0; i<shards; i++) {
                        // We push to particle system instead of bots to avoid cyclic dependencies here,
                        // or we just emit a huge explosion and give a little mass
                        this.particleSystem.emitExplosion(prey.x + (Math.random()-0.5)*50, prey.y + (Math.random()-0.5)*50, prey.color, 10);
                    }
                    predator.grow(prey.mass * 0.2); // Only get 20% mass, rest is shattered
                    if (predator === player) result.screenShake = 15;
                } else {
                    let massGain = prey.mass;
                    if (predator.protocol && predator.protocol.id === 'VIRAL' && prey instanceof Bot) {
                        massGain *= 2;
                    }
                    if (predator.protocol && predator.protocol.id === 'SYMBIOTE' && prey instanceof Bot) {
                        massGain *= 3; // Extreme regen on kill
                    }
                    predator.grow(massGain);
                    prey.markedForDeletion = true;
                    this.particleSystem.emitExplosion(prey.x, prey.y, prey.color, Math.min(50, Math.sqrt(prey.mass)));
                }
            } else if (prey instanceof Bot && prey.type === 'PARASITE') {
                 // Parasite draining logic (doesn't have to be eaten, just touching)
                 if (predator.mass > prey.typeData.drainMassThreshold) {
                     const drainAmount = prey.typeData.drainAmount; // drain per tick
                     predator.mass -= drainAmount;
                     predator.radius = Utils.getRadiusFromMass(predator.mass);
                     prey.mass += drainAmount;
                     prey.radius = Utils.getRadiusFromMass(prey.mass);
                 }
            }
        }
        return result;
    }

    resolveRiftCollision(entity, rift) {
        if (rift.markedForDeletion) return false;

        const dist = Utils.getDistance(entity.x, entity.y, rift.x, rift.y);
        const minOverlap = entity.radius + rift.radius;

        if (dist < minOverlap) {
            // Teleport the entity
            entity.x = Math.random() * CONSTANTS.WORLD_WIDTH;
            entity.y = Math.random() * CONSTANTS.WORLD_HEIGHT;

            // Mark the rift for deletion (despawn after use)
            rift.markedForDeletion = true;

            // Emit a particle explosion
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
                addedMass = 500; // Fixed bonus for lore
                if (!entity.type && this.loreSystem) { // Player Check
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
            return true; // Eaten
        }
        return false;
    }
}
