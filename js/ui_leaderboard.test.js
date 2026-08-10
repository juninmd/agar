import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UILeaderboard } from './ui_leaderboard.js';

describe('UILeaderboard', () => {
    let mockContainer;
    let mockList;
    let leaderboard;

    beforeEach(() => {
        // Setup mock DOM elements
        mockContainer = document.createElement('div');
        mockContainer.id = 'leaderboard';
        mockContainer.classList.add('hidden');

        mockList = document.createElement('ol');
        mockList.id = 'leaderboard-list';
        mockContainer.appendChild(mockList);

        document.body.appendChild(mockContainer);

        leaderboard = new UILeaderboard();
        // Reset lastUpdate to ensure update proceeds
        leaderboard.lastUpdate = 0;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should show and hide container', () => {
        leaderboard.show(true);
        expect(mockContainer.classList.contains('hidden')).toBe(false);

        leaderboard.show(false);
        expect(mockContainer.classList.contains('hidden')).toBe(true);
    });

    it('should sort entities by mass and truncate to top 10', () => {
        const player = { name: 'Player1', mass: 50, type: 'HACKER' };
        const bots = [];
        for (let i = 0; i < 15; i++) {
            bots.push({ name: `Bot${i}`, mass: 10 + i * 5, type: 'SEEKER' });
        }

        leaderboard.update(player, bots);

        expect(mockList.children.length).toBe(10);

        // The bot with the highest mass (10 + 14*5 = 80) should be first
        expect(mockList.children[0].textContent).toContain('Bot14');
        expect(mockList.children[0].textContent).toContain('80 KB');

        // Player has mass 50, so they should be somewhere in the middle
        let playerFound = false;
        for (let i = 0; i < mockList.children.length; i++) {
            if (mockList.children[i].textContent.includes('Player1')) {
                playerFound = true;
                // Check if highlighted
                expect(mockList.children[i].style.color).toBe('var(--neon-green)');
                break;
            }
        }
        expect(playerFound).toBe(true);
    });
});
