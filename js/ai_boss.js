import { Utils } from './utils.js';

/**
 * AI Logic for the Sentinel Boss.
 * Phases:
 * - IDLE: Drifts slowly.
 * - CHASE: Relentlessly pursues the player.
 * - CHARGE: Sudden burst of speed.
 */
export class AIBoss {
    /**
     * Updates the boss's behavior based on its state.
     * @param {Bot} boss - The boss entity.
     * @param {Player} player - The player entity.
     */
    static think(boss, player) {
        if (!boss.aiState) boss.aiState = 'IDLE';
        if (!boss.stateTimer) boss.stateTimer = 0;

        boss.stateTimer--;

        switch (boss.aiState) {
            case 'IDLE':
                this._idle(boss, player);
                break;
            case 'CHASE':
                this._chase(boss, player);
                break;
            case 'CHARGE':
                this._charge(boss);
                break;
        }

        // State Transitions
        if (boss.stateTimer <= 0) {
            this._transition(boss);
        }
    }

    static _idle(boss, player) {
        // Slow drift
        boss.targetX = boss.x + (Math.random() - 0.5) * 100;
        boss.targetY = boss.y + (Math.random() - 0.5) * 100;
    }

    static _chase(boss, player) {
        // Track player directly
        boss.targetX = player.x;
        boss.targetY = player.y;
    }

    static _charge(boss) {
        // Keep moving in current direction with high speed
        // Target is locked from previous state
        boss.speedBoost = 2.5; // Temporary boost
    }

    static _transition(boss) {
        const rand = Math.random();
        if (boss.aiState === 'IDLE') {
            boss.aiState = 'CHASE';
            boss.stateTimer = 600; // 10 seconds chase
        } else if (boss.aiState === 'CHASE') {
            if (rand < 0.3) {
                boss.aiState = 'CHARGE';
                boss.stateTimer = 120; // 2 seconds charge
            } else {
                boss.aiState = 'IDLE';
                boss.stateTimer = 180; // 3 seconds rest
            }
        } else if (boss.aiState === 'CHARGE') {
            boss.aiState = 'CHASE'; // Back to chase
            boss.stateTimer = 300;
            boss.speedBoost = 1.0; // Reset boost
        }
    }
}
