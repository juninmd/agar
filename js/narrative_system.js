import { NarrativeHUD } from './narrative_hud.js';

export class NarrativeSystem {
    constructor(ui) {
        this.ui = ui;
        this.state = {
            virus: false,
            mass1000: false,
            criticalIntegrity: false
        };
        // Initial narrative
        setTimeout(() => this.ui.showNarrative("SYSTEM BOOT: PID 734 ONLINE", "info"), 1000);
    }

    update(player, systemIntegrity) {
        if (player.invertedControls && !this.state.virus) {
            this.ui.showNarrative("SYSTEM ERROR: INPUT MATRIX CORRUPTED", "glitch");
            this.state.virus = true;
            setTimeout(() => { this.state.virus = false; }, 15000);
        }

        if (player.mass > 1000 && !this.state.mass1000) {
            this.ui.showNarrative("WARNING: SINGULARITY APPROACHING", "warning");
            this.state.mass1000 = true;
        }

        if (systemIntegrity < 20 && !this.state.criticalIntegrity) {
             this.ui.showNarrative("CRITICAL: FIREWALL BREACH IMMINENT", "critical");
             this.state.criticalIntegrity = true;
        } else if (systemIntegrity > 30) {
             this.state.criticalIntegrity = false;
        }
    }
}
