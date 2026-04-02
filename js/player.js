import { Entity } from './entity.js';
import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';
import { AbilitySystem } from './ability_system.js';
import { VisualEffects } from './visual_effects.js';
import { PlayerMovement } from './player_movement.js';

/**
 * Represents the player entity controlled by the user.
 * Handles movement, input, and delegation of visual effects.
 */
export class Player extends Entity {
    constructor(x, y, protocolId, name) {
        const protocol = CONSTANTS.PROTOCOLS[protocolId] || CONSTANTS.PROTOCOLS.HACKER;
        const radius = CONSTANTS.INITIAL_RADIUS * Math.sqrt(protocol.massMultiplier);
        super(x, y, radius, protocol.color);

        this.protocol = protocol;
        this.name = name || "Unit 734";
        this.targetX = x;
        this.targetY = y;
        this.velocity = { x: 0, y: 0 };
        this.speedBoost = 1;
        this.trail = [];
        this.abilities = new AbilitySystem(this.protocol.id);
        this.invulnerable = false;
        this.alpha = 1.0;
        this.speedEffectTimer = 0;
        this.shieldEffectTimer = 0;
        this.isGlitching = false;
        this.invertedControls = false;
        this.invertedTimer = 0;
        this.eclipseTimer = 0;
        this.history = [];
    }

    applyPowerUp(type) {
        if (type.id === 'MASS') this.grow(type.value);
        else if (type.id === 'SPEED') { this.speedEffectTimer = type.duration; this.speedBoost = Math.max(this.speedBoost, type.value); }
        else if (type.id === 'SHIELD') { this.shieldEffectTimer = type.duration; this.invulnerable = true; }
        else if (type.id === 'VIRUS') { this.grow(type.value); this.invertedControls = true; this.invertedTimer = type.duration; }
    }

    setTarget(x, y) { this.targetX = x; this.targetY = y; }

    triggerAbility(bots) {
        return this.abilities.activate(this, bots);
    }

    dash() {
        const minMass = Utils.getMassFromRadius(CONSTANTS.INITIAL_RADIUS);
        if (this.mass > minMass * 1.2) {
            this.mass *= 0.8;
            this.radius = Utils.getRadiusFromMass(this.mass);
            this.speedBoost = 3.0;

            if (this.protocol && this.protocol.id === 'ECLIPSE') {
                this.eclipseTimer = CONSTANTS.ECLIPSE_DASH_DURATION_FRAMES; // approx 0.5s at 60fps
                this.invulnerable = true;
            }

            return true;
        }
        return false;
    }

    update(worldWidth, worldHeight, bots = []) {
        if (this.protocol.id === 'CHRONOS' && !this.invulnerable) {
             this.history.push({ x: this.x, y: this.y, mass: this.mass });
             if (this.history.length > 180) { // Keep last ~3 seconds at 60fps
                 this.history.shift();
             }
        }

        this.abilities.update(this, bots);
        this._updatePassives();
        this._updateEffects();
        PlayerMovement.updateMovement(this, worldWidth, worldHeight);
        VisualEffects.updateTrail(this);
    }

    _updatePassives() {
        if (this.protocol.id === 'VIRAL' && this.mass > 100) {
             this.mass *= 0.9995;
             this.radius = Utils.getRadiusFromMass(this.mass);
        }
        if (this.protocol.id === 'SYMBIOTE' && this.mass > 50) {
             this.mass *= 0.998; // Extreme decay
             this.radius = Utils.getRadiusFromMass(this.mass);
        }
    }

    _updateEffects() {
        if (this.speedEffectTimer > 0) {
            this.speedEffectTimer--;
            if (this.speedBoost < 2.5) this.speedBoost = 2.5;
        }
        if (this.shieldEffectTimer > 0) {
            this.shieldEffectTimer--;
            this.invulnerable = true;
        }
        if (this.invertedTimer > 0) {
            this.invertedTimer--;
            if (this.invertedTimer <= 0) this.invertedControls = false;
        }
        if (this.eclipseTimer > 0) {
            this.eclipseTimer--;
            this.invulnerable = true; // Ensure it stays true during timer
            this.alpha = CONSTANTS.ECLIPSE_PHASING_ALPHA; // Visual feedback for phase shifting
            if (this.eclipseTimer <= 0) {
                this.invulnerable = false;
                this.alpha = 1.0;
            }
        }
        if (this.speedBoost > 1) {
            const floor = (this.speedEffectTimer > 0) ? 2.5 : 1.0;
            if (this.speedBoost > floor) this.speedBoost *= 0.96;
            else if (this.speedBoost < floor) this.speedBoost = floor;
        }
    }

    grow(amount) {
        this.mass += amount;
        this.radius = Utils.getRadiusFromMass(this.mass);
    }

    draw(ctx) {
        VisualEffects.drawPlayer(ctx, this);
    }
}
