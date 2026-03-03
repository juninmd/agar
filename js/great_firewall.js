import { Bot } from './bot.js';
import { CONSTANTS } from './constants.js';

/**
 * The Great Firewall: A massive vertical barrier that sweeps across the map.
 * Players must find the gap in the wall or dash through it to survive.
 */
export class GreatFirewall extends Bot {
    constructor(x, y) {
        // Pass dummy args, we'll override them
        super(x, y, 100, CONSTANTS.BOT_TYPES.GREAT_FIREWALL.color, 'GREAT_FIREWALL');

        this.type = 'GREAT_FIREWALL';
        this.color = CONSTANTS.BOT_TYPES.GREAT_FIREWALL.color;
        this.mass = 20000;

        // This boss is a horizontal sweeping wall. It spans the whole Y axis.
        this.width = 300; // Visual width
        this.height = CONSTANTS.WORLD_HEIGHT; // Visual height
        this.radius = 150; // Used for collision checking (approx half width)

        // Starts at x=0 and sweeps right
        this.x = 0;
        this.y = CONSTANTS.WORLD_HEIGHT / 2;

        this.speed = 1.0;
        this.sweepDirection = 1; // 1 = Right, -1 = Left

        // The wall has a "gap" that players can pass through safely
        this.gapY = Math.random() * (CONSTANTS.WORLD_HEIGHT - 600) + 300; // Between 300 and WORLD_HEIGHT - 300
        this.gapHeight = 400; // Size of the safe zone gap
    }

    update(worldWidth, worldHeight, entities, foods) {
        // Sweep horizontally
        this.x += this.speed * this.sweepDirection;

        // Reverse direction at edges and randomize gap
        if (this.x > worldWidth) {
            this.x = worldWidth;
            this.sweepDirection = -1;
            this.speed = Math.min(this.speed + 0.5, 8.0); // Gets faster but caps at 8
            this.randomizeGap(worldHeight);
            this.takeDamage();
        } else if (this.x < 0) {
            this.x = 0;
            this.sweepDirection = 1;
            this.speed = Math.min(this.speed + 0.5, 8.0);
            this.randomizeGap(worldHeight);
            this.takeDamage();
        }
    }

    takeDamage() {
        this.mass -= 2000;
        if (this.mass <= 0) {
            this.markedForDeletion = true;
        }
    }

    randomizeGap(worldHeight) {
        this.gapY = Math.random() * (worldHeight - 600) + 300;
    }

    /**
     * Custom collision logic since it's a rectangle with a gap, not a circle.
     * Returns true if the entity collides with the solid parts of the wall.
     */
    checkCollision(entity) {
        // Simple AABB collision with the two wall segments

        // Check X bounds
        if (entity.x + entity.radius < this.x - this.width/2 ||
            entity.x - entity.radius > this.x + this.width/2) {
            return false;
        }

        // Entity is within the X bounds of the wall.
        // Now check if it's NOT in the gap.

        const inTopWall = (entity.y - entity.radius < this.gapY - this.gapHeight/2);
        const inBottomWall = (entity.y + entity.radius > this.gapY + this.gapHeight/2);

        return inTopWall || inBottomWall;
    }
}
