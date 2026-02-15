export class SingularitySystem {
    constructor(ui, renderer) {
        this.ui = ui;
        this.renderer = renderer;
        this.active = false;
        this.massThreshold = 4000;
        this.gravityConstant = 5000;
        this.maxRange = 2000;
    }

    update(player, entities) {
        if (!this.active && player.mass > this.massThreshold) {
            this.activate();
        }

        if (this.active) {
            this.applyGravity(player, entities);
            this.triggerEffects();
        }
    }

    activate() {
        this.active = true;
        this.ui.showCorruptionAlert("⚠ SINGULARITY DETECTED ⚠");
        this.renderer.screenShake = 50;
        document.body.classList.add('glitch-mode');
        setTimeout(() => document.body.classList.remove('glitch-mode'), 2000);
    }

    applyGravity(player, entities) {
        entities.forEach(entity => {
            const dx = player.x - entity.x;
            const dy = player.y - entity.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            if (dist < this.maxRange && dist > player.radius) {
                // Stronger pull as mass increases
                // F = G * M / R^2 roughly
                const force = (player.mass / (distSq + 1000)) * 50;
                const angle = Math.atan2(dy, dx);

                entity.x += Math.cos(angle) * force;
                entity.y += Math.sin(angle) * force;
            }
        });
    }

    triggerEffects() {
        // Continuous subtle shake
        if (Math.random() > 0.9) {
            this.renderer.screenShake = Math.max(this.renderer.screenShake, 2);
        }
    }
}
