export class SingularitySystem {
    constructor(ui, renderer) {
        this.ui = ui;
        this.renderer = renderer;
        this.active = false;
        this.massThreshold = 4500;
        this.crashThreshold = 5500;
        this.phase = 0; // 0: Inactive, 1: Warning, 2: Critical, 3: Crash
        this.timer = 0;
    }

    update(player, entities) {
        if (this.phase === 3) return;

        if (this.phase === 0 && player.mass > this.massThreshold) {
            this.activatePhase1();
        } else if (this.phase === 1 && player.mass > this.crashThreshold) {
            this.activatePhase2();
        }

        if (this.active) {
            this.applyGravity(player, entities);
            this.triggerEffects();
        }

        if (this.phase === 2) {
            this.timer++;
            if (this.timer % 60 === 0) console.log("Singularity Timer: " + this.timer);
            if (this.timer > 180) this.triggerCrash();
        }
    }

    activatePhase1() {
        this.phase = 1;
        this.active = true;
        this.ui.showCorruptionAlert("⚠ SINGULARITY DETECTED ⚠");
        this.renderer.screenShake = 20;
        document.body.classList.add('glitch-mode');
        setTimeout(() => document.body.classList.remove('glitch-mode'), 2000);
    }

    activatePhase2() {
        this.phase = 2;
        this.ui.showCorruptionAlert("CRITICAL MASS: SYSTEM FAILURE IMMINENT");
        document.body.classList.add('crash-mode');
        this.renderer.screenShake = 100;
    }

    triggerCrash() {
        this.phase = 3;
        document.body.classList.remove('crash-mode');
        const bsod = document.getElementById('bsod-screen');
        if (bsod) {
            bsod.classList.remove('hidden');
            document.querySelectorAll('#ui-layer > div:not(#bsod-screen)').forEach(el => el.style.display = 'none');
            // Save unlock state
            const currentLore = JSON.parse(localStorage.getItem('neon_phage_lore') || '[]');
            if (!currentLore.includes('TRUE_RECOMPILE')) {
                currentLore.push('TRUE_RECOMPILE');
                localStorage.setItem('neon_phage_lore', JSON.stringify(currentLore));
            }
            setTimeout(() => location.reload(), 6000);
        }
    }

    applyGravity(player, entities) {
        const multiplier = (this.phase === 2) ? 5 : 1;
        entities.forEach(entity => {
            const dx = player.x - entity.x;
            const dy = player.y - entity.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            if (dist < 2000 && dist > player.radius) {
                const force = (player.mass / (distSq + 1000)) * 50 * multiplier;
                const angle = Math.atan2(dy, dx);
                entity.x += Math.cos(angle) * force;
                entity.y += Math.sin(angle) * force;
            }
        });
    }

    triggerEffects() {
        if (this.phase >= 1 && Math.random() > 0.8) {
            this.renderer.screenShake = Math.max(this.renderer.screenShake, 5);
        }
        if (this.phase === 2) {
            this.renderer.screenShake = Math.max(this.renderer.screenShake, 20);
        }
    }
}
