/**
 * Handles user input via mouse, keyboard, and touch.
 */
export class InputHandler {
    /**
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {HTMLElement} mobileDashBtn - The mobile dash button element.
     */
    constructor(canvas, mobileDashBtn) {
        this.canvas = canvas;
        this.mobileDashBtn = mobileDashBtn;
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.onDash = null;
        this.onAbility = null;

        this.joystickBase = document.getElementById('joystick-base');
        this.joystickStick = document.getElementById('joystick-stick');
        this.touchId = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.maxJoystickRadius = 50;
        this.isMobile = false;

        this._initListeners();
    }

    _initListeners() {
        window.addEventListener('mousemove', (e) => {
            if (this.isMobile) return;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        window.addEventListener('touchstart', (e) => {
            this.isMobile = true;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const t = e.changedTouches[i];
                // Ignore touches on UI buttons
                if (t.target && (t.target.tagName === 'BUTTON' || t.target.closest('#mobile-dash-btn') || t.target.closest('#ability-icon'))) continue;

                if (this.touchId === null) {
                    this.touchId = t.identifier;
                    this.touchStartX = t.clientX;
                    this.touchStartY = t.clientY;
                    this.mouseX = window.innerWidth / 2;
                    this.mouseY = window.innerHeight / 2;

                    if (this.joystickBase && this.joystickBase.classList.contains('active-game')) {
                        this.joystickBase.style.display = 'block';
                        this.joystickBase.style.left = `${this.touchStartX}px`;
                        this.joystickBase.style.top = `${this.touchStartY}px`;
                        this.joystickStick.style.transform = `translate(-50%, -50%)`;
                        this.joystickBase.style.opacity = '1';
                    }
                }
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!this.isMobile) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const t = e.changedTouches[i];
                if (t.identifier === this.touchId) {
                    e.preventDefault();

                    const dx = t.clientX - this.touchStartX;
                    const dy = t.clientY - this.touchStartY;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    const normalizedDist = Math.min(dist, this.maxJoystickRadius);
                    const angle = Math.atan2(dy, dx);

                    const stickX = Math.cos(angle) * normalizedDist;
                    const stickY = Math.sin(angle) * normalizedDist;

                    if (this.joystickStick && this.joystickBase && this.joystickBase.classList.contains('active-game')) {
                        this.joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
                    }

                    // Map joystick vector to player mouse target equivalent
                    this.mouseX = (window.innerWidth / 2) + stickX * 5;
                    this.mouseY = (window.innerHeight / 2) + stickY * 5;
                }
            }
        }, { passive: false });

        window.addEventListener('touchend', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === this.touchId) {
                    this.touchId = null;
                    if (this.joystickBase) {
                        this.joystickBase.style.opacity = '0';
                    }
                    this.mouseX = window.innerWidth / 2;
                    this.mouseY = window.innerHeight / 2;
                }
            }
        });

        window.addEventListener('touchcancel', (e) => {
            this.touchId = null;
            if (this.joystickBase) this.joystickBase.style.opacity = '0';
        });

        // Keyboard (Dash and Ability)
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (this.onDash) this.onDash();
            }
            if (e.code === 'KeyE') {
                if (this.onAbility) this.onAbility();
            }
        });

        // Right Click (Ability)
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.onAbility) this.onAbility();
        });

        // Mobile Dash Button
        if (this.mobileDashBtn) {
            this.mobileDashBtn.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent ghost clicks
                if (this.onDash) this.onDash();
            });
        }
    }

    /**
     * Get the current mouse/touch position.
     * @returns {{x: number, y: number}} The coordinates.
     */
    getMousePosition() {
        return { x: this.mouseX, y: this.mouseY };
    }

    /**
     * Reset the input coordinates to center of screen.
     */
    resetCenter() {
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
    }
}
