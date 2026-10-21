import { describe, it, expect, vi } from 'vitest';
import { Game } from './game.js';
import { CONSTANTS } from './constants.js';

describe('Game win condition', () => {
    const makeGame = (mass, protocolId = 'HACKER') => {
        const game = Object.create(Game.prototype);
        game.player = { markedForDeletion: false, mass, protocol: { id: protocolId } };
        game.bots = [{}];
        game.gameRunning = true;
        game.ui = { showWin: vi.fn(), showTrueWin: vi.fn() };
        return game;
    };

    it('wins and stops the loop once the player reaches WIN_MASS', () => {
        const game = makeGame(CONSTANTS.WIN_MASS);
        game.update();
        expect(game.ui.showWin).toHaveBeenCalledTimes(1);
        expect(game.gameRunning).toBe(false);
    });

    it('shows the true win screen for OMNI', () => {
        const game = makeGame(CONSTANTS.WIN_MASS, 'OMNI');
        game.update();
        expect(game.ui.showTrueWin).toHaveBeenCalledTimes(1);
        expect(game.ui.showWin).not.toHaveBeenCalled();
    });
});
