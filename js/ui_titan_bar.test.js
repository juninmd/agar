import { describe, it, expect, beforeEach } from 'vitest';
import { UITitanBar } from './ui_titan_bar.js';

describe('UITitanBar', () => {
    let uiLayer;
    let titanBar;

    beforeEach(() => {
        document.body.innerHTML = '<div id="ui-layer"></div>';
        uiLayer = document.getElementById('ui-layer');
        titanBar = new UITitanBar(uiLayer);
    });

    it('should create the health bar dynamically when updated with a positive value', () => {
        titanBar.update(100);
        const container = uiLayer.querySelector('.titan-health-container');
        expect(container).not.toBeNull();
        const barFill = container.querySelector('.titan-health-bar-fill');
        expect(barFill.style.width).toBe('100%');
    });

    it('should clamp negative values to 0 and immediately remove the container', () => {
        titanBar.update(50); // First create it
        let container = uiLayer.querySelector('.titan-health-container');
        expect(container).not.toBeNull();

        titanBar.update(-10); // Then update to negative
        container = uiLayer.querySelector('.titan-health-container');
        expect(container).toBeNull(); // Should be removed
    });

    it('should remove the container when updated to 0', () => {
        titanBar.update(50); // First create it
        titanBar.update(0);
        const container = uiLayer.querySelector('.titan-health-container');
        expect(container).toBeNull();
    });

    it('should not create a new container if one already exists', () => {
        titanBar.update(100);
        const initialContainer = uiLayer.querySelector('.titan-health-container');
        titanBar._create(); // Force call to hit the early return
        const currentContainer = uiLayer.querySelector('.titan-health-container');
        expect(initialContainer).toBe(currentContainer);
    });
});
