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

        // Handle Great Firewall custom collision
        if (e1.type === 'GREAT_FIREWALL' || e2.type === 'GREAT_FIREWALL') {
            const firewall = e1.type === 'GREAT_FIREWALL' ? e1 : e2;
            const target = e1.type === 'GREAT_FIREWALL' ? e2 : e1;

            if (firewall.checkCollision && firewall.checkCollision(target)) {
                // Instakill for target (unless player has invulnerable)
                if (target === player && player.invulnerable) return result;

                target.markedForDeletion = true;
                this.particleSystem.emitExplosion(target.x, target.y, '#FF0000', 100);

                if (target === player) {
                    result.screenShake = 50;
                    this.ui.showCorruptionAlert("DELETED BY THE GREAT FIREWALL");
                }
            }
            return result; // Don't process normal mass collision for the wall
        }

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
                } else {
                    let massGain = prey.mass;
                    if (predator.protocol && predator.protocol.id === 'VIRAL' && prey instanceof Bot) {
                        massGain *= 2;
                    }
                    predator.grow(massGain);
                    prey.markedForDeletion = true;
                    this.particleSystem.emitExplosion(prey.x, prey.y, prey.color, Math.min(50, Math.sqrt(prey.mass)));
                }
            }
        }
        return result;
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
