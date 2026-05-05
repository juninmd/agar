import { Utils } from '../utils.js';
import { CONSTANTS } from '../constants.js';
import { Bot } from '../bot.js';

export class CollisionResolver {
    static resolveEntityCollision(e1, e2, player, particleSystem, ui) {
        const dist = Utils.getDistance(e1.x, e1.y, e2.x, e2.y);
        const minOverlap = e1.radius + e2.radius;
        let result = {};

        if (dist < minOverlap) {
            if ((e1 instanceof Bot && e1.type === 'BUMPER') || (e2 instanceof Bot && e2.type === 'BUMPER')) {
                if (dist > 0) {
                    const nx = (e2.x - e1.x) / dist;
                    const ny = (e2.y - e1.y) / dist;
                    const pushForce = 5;
                    e1.x -= nx * pushForce;
                    e1.y -= ny * pushForce;
                    e2.x += nx * pushForce;
                    e2.y += ny * pushForce;

                    if (e1.type === 'BUMPER') e1.speedBoost = Math.max(e1.speedBoost || 1.0, 2.0);
                    if (e2.type === 'BUMPER') e2.speedBoost = Math.max(e2.speedBoost || 1.0, 2.0);
                }
                return result;
            }

            let predator = e1.mass > e2.mass * 1.1 ? e1 : (e2.mass > e1.mass * 1.1 ? e2 : null);
            let prey = predator === e1 ? e2 : e1;

            if (e1.isTangible === false || e2.isTangible === false) return result;
            if (!predator || (prey === player && player.invulnerable)) return result;

            if (dist < predator.radius - prey.radius * 0.2) {
                if (prey instanceof Bot && prey.type === 'CORRUPTER') {
                    const lostMass = predator.mass * 0.6;
                    predator.mass = Math.max(predator.mass - lostMass, CONSTANTS.INITIAL_RADIUS * CONSTANTS.INITIAL_RADIUS * Math.PI);
                    predator.radius = Utils.getRadiusFromMass(predator.mass);

                    particleSystem.emitExplosion(predator.x, predator.y, predator.color, 100);
                    particleSystem.emitExplosion(prey.x, prey.y, '#FF0000', 50);

                    if (predator === player) {
                        result.screenShake = 30;
                        ui.showCorruptionAlert();
                    }
                    prey.markedForDeletion = true;
                } else if (prey instanceof Bot && prey.type === 'DECOY') {
                    prey.markedForDeletion = true;
                    particleSystem.emitExplosion(prey.x, prey.y, prey.color, 20);
                } else if (prey instanceof Bot && prey.type === 'FRAGMENTER') {
                    prey.markedForDeletion = true;
                    particleSystem.emitExplosion(prey.x, prey.y, prey.color, 50);
                    result.shards = { mass: prey.mass, x: prey.x, y: prey.y, color: prey.color };
                } else {
                    let massGain = prey.mass;
                    if (predator.protocol && predator.protocol.id === 'VIRAL' && prey instanceof Bot) massGain *= 2;
                    if (predator.protocol && predator.protocol.id === 'SYMBIOTE' && prey instanceof Bot) massGain *= 3;
                    if (predator.breakerAura && prey instanceof Bot) massGain *= 1.5;
                    predator.grow(massGain);
                    prey.markedForDeletion = true;
                    particleSystem.emitExplosion(prey.x, prey.y, prey.color, Math.min(50, Math.sqrt(prey.mass)));
                }
            } else if (prey instanceof Bot && prey.type === 'PARASITE') {
                 if (predator.mass > prey.typeData.drainMassThreshold) {
                     const drainAmount = prey.typeData.drainAmount;
                     predator.mass -= drainAmount;
                     predator.radius = Utils.getRadiusFromMass(predator.mass);
                     prey.mass += drainAmount;
                     prey.radius = Utils.getRadiusFromMass(prey.mass);
                 }
            }
        }
        return result;
    }
}
