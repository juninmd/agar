const MESSAGES = [
    "SCANNING MEMORY BLOCKS...",
    "ANALYZING NETWORK TRAFFIC...",
    "MONITORING FIREWALL STATUS...",
    "SEARCHING FOR ANOMALIES...",
    "DECRYPTING SECURE PACKETS...",
    "COMPILING SYSTEM LOGS...",
    "OPTIMIZING ROUTING PROTOCOLS..."
];
const CYCLE_FRAMES = 180; // ~3 seconds at 60 FPS

/**
 * Rotates system status logs in the HUD terminal ticker.
 */
export class TerminalTicker {
    constructor() {
        this.timer = CYCLE_FRAMES; // Show the first message immediately
        this.index = -1;
    }

    /**
     * @param {import('../ui_hud.js').UIHud} hud
     * @param {number} integrity - Current system integrity percentage.
     */
    update(hud, integrity) {
        if (!hud || !hud.terminalTicker) return;
        if (++this.timer <= CYCLE_FRAMES) return;
        this.timer = 0;
        this.index = (this.index + 1) % MESSAGES.length;

        // Re-trigger the CSS animations by cloning the element
        const el = hud.terminalTicker;
        const next = el.cloneNode(true);
        next.innerText = `> ${MESSAGES[this.index]} // INTEGRITY: ${Math.floor(integrity)}%`;
        el.parentNode.replaceChild(next, el);
        hud.terminalTicker = next;
    }
}
