/**
 * Manages UI event listeners.
 */
export class UIEvents {
    /**
     * Initializes all event listeners for UI buttons.
     * @param {import('./ui.js').UIManager} uiManager - The UI Manager instance.
     */
    static initListeners(uiManager) {
        if (uiManager.startBtn) {
            uiManager.startBtn.addEventListener('click', () => {
                const name = uiManager.nameInput.value || "Unit 734";
                const roomId = uiManager.roomIdInput?.value.trim() || null;
                const protocol = document.querySelector('.protocol-card.selected')?.dataset.id || 'HACKER';

                const mutations = [];
                if (document.getElementById('mut-chaos')?.checked) mutations.push('chaos-mode');
                if (document.getElementById('mut-scarcity')?.checked) mutations.push('scarcity');
                if (document.getElementById('mut-gigantism')?.checked) mutations.push('gigantism');
                if (document.getElementById('mut-hyper-decay')?.checked) mutations.push('hyper-decay');

                const skinSelector = document.getElementById('skin-selector');
                const skin = skinSelector ? skinSelector.value : 'DEFAULT';

                if (uiManager.onStart) uiManager.onStart(name, protocol, mutations, skin, roomId);
            });
        }


        const mutationCheckboxes = document.querySelectorAll('.mutation-btn input[type="checkbox"]');
        mutationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    e.target.parentElement.classList.add('active');
                } else {
                    e.target.parentElement.classList.remove('active');
                }
            });
        });

        const protocolCards = document.querySelectorAll('.protocol-card');
        protocolCards.forEach(card => {
            card.addEventListener('click', () => {
                protocolCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });

        if (uiManager.restartBtn) {
            uiManager.restartBtn.addEventListener('click', () => {
                if (uiManager.onRestart) uiManager.onRestart();
            });
        }

        if (uiManager.winBtn) {
            uiManager.winBtn.addEventListener('click', () => {
                if (uiManager.onRestart) uiManager.onRestart();
            });
        }

        if (uiManager.trueWinBtn) {
            uiManager.trueWinBtn.addEventListener('click', () => {
                if (uiManager.onRestart) uiManager.onRestart();
            });
        }
    }
}
