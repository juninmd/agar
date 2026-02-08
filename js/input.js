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
        this.onDash = null; // Callback for dash action

        this._initListeners();
    }

    /**
     * Initialize event listeners.
     * @private
     */
    _initListeners() {
        // Mouse Movement
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Touch Start
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        }, { passive: false });

        // Touch Move (Prevent scrolling)
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                e.preventDefault();
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        }, { passive: false });

        // Keyboard (Dash)
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (this.onDash) this.onDash();
            }
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
