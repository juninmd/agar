import { initTouchListeners } from './input_touch.js';

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
        this.zoomLevel = 1;
        this.isMobile = false;

        this._initListeners();
    }

    _initListeners() {
        window.addEventListener('mousemove', (e) => {
            if (this.isMobile) return;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        initTouchListeners(this);

        // Mouse Wheel (Zoom) - leave scrolling alone on overlays and modals
        window.addEventListener('wheel', (e) => {
            if (this.isMobile || e.target.closest?.('.overlay, #database-modal')) return;
            e.preventDefault();
            const zoomSpeed = 0.1;
            if (e.deltaY < 0) {
                this.zoomLevel = Math.min(this.zoomLevel + zoomSpeed, 2);
            } else {
                this.zoomLevel = Math.max(this.zoomLevel - zoomSpeed, 0.5);
            }
        }, { passive: false });

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
