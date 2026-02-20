/**
 * Manages the "System Boot" intro sequence.
 */
export class BootSequence {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.container = null;
        this.lines = [
            { text: "INITIALIZING KERNEL...", delay: 200 },
            { text: "[ OK ] CPU Check: PASSED", delay: 100 },
            { text: "[ OK ] Memory Integrity: 12% (CRITICAL)", delay: 300, class: "warning" },
            { text: "Loading 'Null Void' drivers...", delay: 400 },
            { text: "Scanning for Protocols...", delay: 300 },
            { text: "> BASTION... FOUND", delay: 100 },
            { text: "> HACKER... FOUND", delay: 100 },
            { text: "> PHANTOM... FOUND", delay: 100 },
            { text: "> VIRAL... [CORRUPTED]", delay: 200, class: "error" },
            { text: "WARNING: Unauthorized access detected in Sector 7G", delay: 500, class: "warning" },
            { text: "Bypassing Security Firewall...", delay: 600 },
            { text: "Welcome, User 734.", delay: 400 }
        ];
        this.asciiArt = `
   _   _  _____  ____  _   _       ____  _   _    _    ____  _____
  | \\ | || ____|/ __ \\| \\ | |     |  _ \\| | | |  / \\  / ___|| ____|
  |  \\| ||  _| | |  | |  \\| |_____| |_) | |_| | / _ \\| |  _ |  _|
  | |\\  || |___| |__| | |\\  |_____|  __/|  _  |/ ___ \\ |_| || |___
  |_| \\_||_____|\\____/|_| \\_|     |_|   |_| |_/_/   \\_\\____||_____|
        `;
    }

    start() {
        // Skip for tests or if requested
        if (this._shouldSkip()) {
            this.onComplete();
            return;
        }

        this._createOverlay();
        this._runSequence();
    }

    _shouldSkip() {
        const urlParams = new URLSearchParams(window.location.search);
        return navigator.webdriver || urlParams.has('skipBoot');
    }

    _createOverlay() {
        this.container = document.createElement('div');
        this.container.id = 'boot-screen';

        const logo = document.createElement('div');
        logo.className = 'ascii-logo';
        logo.textContent = this.asciiArt;
        this.container.appendChild(logo);

        document.body.appendChild(this.container);

        // Add skip listener
        this._skipListener = (e) => {
            if (e.key) {
                this._finish();
            }
        };
        window.addEventListener('keydown', this._skipListener);
    }

    async _runSequence() {
        for (const line of this.lines) {
            if (!this.container) return; // Aborted
            await this._typeLine(line);
        }
        setTimeout(() => this._finish(), 1000);
    }

    _typeLine(lineData) {
        return new Promise(resolve => {
            const p = document.createElement('div');
            p.className = `boot-line ${lineData.class || ''}`;
            p.textContent = lineData.text;
            this.container.appendChild(p);

            // Auto-scroll
            this.container.scrollTop = this.container.scrollHeight;

            setTimeout(resolve, lineData.delay);
        });
    }

    _finish() {
        if (!this.container) return;

        window.removeEventListener('keydown', this._skipListener);
        this.container.remove();
        this.container = null;
        this.onComplete();
    }
}
