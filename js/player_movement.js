import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';

export class PlayerMovement {
    static updateMovement(player, worldWidth, worldHeight) {
        const dist = Utils.getDistance(player.x, player.y, player.targetX, player.targetY);
        const speedDecay = Math.pow(CONSTANTS.INITIAL_RADIUS / player.radius, 0.4);
        let maxSpeed = CONSTANTS.PLAYER_SPEED_BASE * speedDecay * player.speedBoost * player.protocol.speedMultiplier;

        if (player.isSlowed) {
             maxSpeed *= 0.5;
             player.isSlowed = false; // Reset for next frame
        }

        if (dist > 5) {
            let dx = player.targetX - player.x;
            let dy = player.targetY - player.y;

            if (player.invertedControls) {
                dx = -dx;
                dy = -dy;
            }

            player.velocity.x = (dx / dist) * maxSpeed;
            player.velocity.y = (dy / dist) * maxSpeed;
        } else {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }

        const corruptionFactor = Math.max(0, (player.mass - 500) / 2000);
        if (corruptionFactor > 0 && player.speedBoost <= 1.2) {
            player.velocity.x += (Math.random() - 0.5) * corruptionFactor * 2;
            player.velocity.y += (Math.random() - 0.5) * corruptionFactor * 2;
            player.isGlitching = (Math.random() < corruptionFactor * 0.1);
        } else {
            player.isGlitching = false;
        }

        player.x += player.velocity.x;
        player.y += player.velocity.y;
        player.checkBounds(worldWidth, worldHeight);
    }
}
