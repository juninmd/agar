/**
 * Wires the virtual-joystick touch listeners onto an InputHandler.
 * @param {import('./input.js').InputHandler} input - The handler whose state is updated.
 */
export function initTouchListeners(input) {
        window.addEventListener('touchstart', (e) => {
            input.isMobile = true;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const t = e.changedTouches[i];
                // Ignore touches on UI buttons
                if (t.target && (t.target.tagName === 'BUTTON' || t.target.closest('#mobile-dash-btn') || t.target.closest('#ability-icon'))) continue;

                if (input.touchId === null) {
                    input.touchId = t.identifier;
                    input.touchStartX = t.clientX;
                    input.touchStartY = t.clientY;
                    input.mouseX = window.innerWidth / 2;
                    input.mouseY = window.innerHeight / 2;

                    if (input.joystickBase && input.joystickBase.classList.contains('active-game')) {
                        input.joystickBase.style.display = 'block';
                        input.joystickBase.style.left = `${input.touchStartX}px`;
                        input.joystickBase.style.top = `${input.touchStartY}px`;
                        input.joystickStick.style.transform = `translate(-50%, -50%)`;
                        input.joystickBase.style.opacity = '1';
                    }
                }
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!input.isMobile) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const t = e.changedTouches[i];
                if (t.identifier === input.touchId) {
                    e.preventDefault();

                    const dx = t.clientX - input.touchStartX;
                    const dy = t.clientY - input.touchStartY;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    const normalizedDist = Math.min(dist, input.maxJoystickRadius);
                    const angle = Math.atan2(dy, dx);

                    const stickX = Math.cos(angle) * normalizedDist;
                    const stickY = Math.sin(angle) * normalizedDist;

                    if (input.joystickStick && input.joystickBase && input.joystickBase.classList.contains('active-game')) {
                        input.joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
                    }

                    // Map joystick vector to player mouse target equivalent
                    input.mouseX = (window.innerWidth / 2) + stickX * 5;
                    input.mouseY = (window.innerHeight / 2) + stickY * 5;
                }
            }
        }, { passive: false });

        window.addEventListener('touchend', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === input.touchId) {
                    input.touchId = null;
                    if (input.joystickBase) {
                        input.joystickBase.style.opacity = '0';
                    }
                    input.mouseX = window.innerWidth / 2;
                    input.mouseY = window.innerHeight / 2;
                }
            }
        });

        window.addEventListener('touchcancel', (e) => {
            input.touchId = null;
            if (input.joystickBase) input.joystickBase.style.opacity = '0';
        });
}
