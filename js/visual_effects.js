import { PlayerVisuals } from './visuals/player_visuals.js';
import { AbilityVisuals } from './visuals/ability_visuals.js';
import { GlitchVisuals } from './visuals/glitch_visuals.js';
import { SingularityVisuals } from './visuals/singularity_visuals.js';
import { BossVisuals } from './visuals/boss_visuals.js';

/**
 * Facade for all visual effects.
 * Delegates to specialized modules in js/visuals/.
 */
export class VisualEffects {
    static drawPlayer(ctx, player) {
        if (player.type === 'SENTINEL') {
            this.drawBoss(ctx, player);
            return;
        }
        if (player.type === 'TITAN') {
            this.drawTitan(ctx, player);
            return;
        }
        if (player.type === 'GLITCH_WEAVER') {
            BossVisuals.drawWeaver(ctx, player);
            return;
        }
        PlayerVisuals.drawPlayer(ctx, player);
    }

    static drawShield(ctx, player) {
        PlayerVisuals.drawShield(ctx, player);
    }

    static drawSpeedEffect(ctx, player) {
        PlayerVisuals.drawSpeedEffect(ctx, player);
    }

    static drawTrail(ctx, player) {
        PlayerVisuals.drawTrail(ctx, player);
    }

    static updateTrail(player) {
        PlayerVisuals.updateTrail(player);
    }

    static drawName(ctx, player) {
        PlayerVisuals.drawName(ctx, player);
    }

    static drawDecorativeRing(ctx, player) {
        PlayerVisuals.drawDecorativeRing(ctx, player);
    }

    static drawViralTether(ctx, startX, startY, endX, endY, intensity = 1.0) {
        AbilityVisuals.drawViralTether(ctx, startX, startY, endX, endY, intensity);
    }

    static drawGlitch(ctx, entity) {
        GlitchVisuals.drawGlitch(ctx, entity);
    }

    static drawSingularity(ctx, player) {
        SingularityVisuals.drawSingularity(ctx, player);
    }

    static drawBoss(ctx, boss) {
        BossVisuals.drawSentinel(ctx, boss);
    }

    static drawTitan(ctx, titan) {
        BossVisuals.drawTitan(ctx, titan);
    }

    static drawGreatFirewall(ctx, firewall) {
        BossVisuals.drawGreatFirewall(ctx, firewall);
    }
}
