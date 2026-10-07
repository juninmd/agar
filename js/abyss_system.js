import { Utils } from './utils.js';

export class AbyssZone {
    constructor(id, x, y, radius, lifespan) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.lifespan = lifespan;
        this.maxLifespan = lifespan;
        this.active = true;
    }

    contains(x, y) {
        return Utils.getDistance(this.x, this.y, x, y) <= this.radius;
    }

    update(dt) {
        this.lifespan -= dt;
        if (this.lifespan <= 0) {
            this.active = false;
        }
    }

    getAlpha(dtMs) {
        if (!this.active) return 0;
        const FADE_TIME_MS = 5000;
        const fadeInFactor = Math.min(1.0, (this.maxLifespan - this.lifespan) / FADE_TIME_MS);
        const fadeOutFactor = Math.min(1.0, this.lifespan / FADE_TIME_MS);
        return 0.9 * Math.min(fadeInFactor, fadeOutFactor);
    }
}

export class AbyssSystem {
    constructor(game) {
        this.game = game;
        this.zones = [];
        this.maxZones = 3;
        this.spawnTimer = 0;
        // spawn every 30 seconds
        this.spawnIntervalMs = 30000;
    }

    generateZone() {
        const radius = Utils.randomRange(300, 800);
        const x = Utils.randomRange(radius, this.game.CONSTANTS.WORLD_WIDTH - radius);
        const y = Utils.randomRange(radius, this.game.CONSTANTS.WORLD_HEIGHT - radius);
        const lifespanMs = Utils.randomRange(60000, 120000); // 1-2 minutes in ms
        const id = `abyss_${Math.floor(Math.random() * 10000)}`;
        this.zones.push(new AbyssZone(id, x, y, radius, lifespanMs));
    }

    update(entities) {
        // Assume dt = ~16.66ms if not passed
        const dtMs = 1000 / 60;
        this.spawnTimer += dtMs;
        if (this.spawnTimer >= this.spawnIntervalMs) {
            this.spawnTimer = 0;
            if (this.zones.length < this.maxZones) {
                this.generateZone();
            }
        }

        // Reset entity visibility before applying rules
        entities.forEach(ent => {
            if (ent) ent.isObscured = false;
        });

        const activeZones = [];

        for (const zone of this.zones) {
            zone.update(dtMs);
            if (zone.active) {
                // Apply visibility rules
                entities.forEach(ent => {
                    if (ent && zone.contains(ent.x, ent.y)) {
                        ent.isObscured = true;
                    }
                });
                activeZones.push(zone);
            }
        }
        this.zones = activeZones;

        entities.forEach(ent => {
            if (ent) {
                if (ent.isObscured) {
                    ent.flickerEffect = Utils.randomRange(0.1, 0.4);
                } else {
                    ent.flickerEffect = 1.0;
                }
            }
        });
    }
}
