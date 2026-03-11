import { SentinelVisuals } from './sentinel_visuals.js';
import { WeaverVisuals } from './weaver_visuals.js';
import { TitanVisuals } from './titan_visuals.js';
import { FirewallVisuals } from './firewall_visuals.js';

export class BossVisuals {
    static drawSentinel(ctx, boss) {
        SentinelVisuals.drawSentinel(ctx, boss);
    }

    static drawWeaver(ctx, weaver) {
        WeaverVisuals.drawWeaver(ctx, weaver);
    }

    static drawTitan(ctx, titan) {
        TitanVisuals.drawTitan(ctx, titan);
    }

    static drawGreatFirewall(ctx, firewall) {
        FirewallVisuals.drawGreatFirewall(ctx, firewall);
    }
}
