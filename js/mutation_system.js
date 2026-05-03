/**
 * Handles global gameplay modifiers that can be injected at the start of a Recompile.
 */
export class MutationSystem {
    constructor() {
        this.activeMutations = [];
        this.baseConstants = null;
    }

    /**
     * Applies the selected mutations to the given constants object.
     * @param {Array<string>} mutations - List of mutation IDs to apply.
     * @param {Object} constants - The CONSTANTS object to modify.
     */
    applyModifiers(mutations, constants) {
        this.activeMutations = mutations || [];

        // Save base constants on first run to allow clean resets
        if (!this.baseConstants) {
            this.baseConstants = {
                BOT_SPEED: constants.BOT_SPEED || 1.5,
                ELITE_SPEED_MULTIPLIER: constants.ELITE_SPEED_MULTIPLIER || 2.0,
                FOOD_COUNT: constants.FOOD_COUNT || 400,
                BOT_COUNT: constants.BOT_COUNT || 25,
                INITIAL_RADIUS: constants.INITIAL_RADIUS || 20,
                MASS_DECAY_RATE: constants.MASS_DECAY_RATE || 0.05
            };
        }

        // Reset to base before applying new mutations (prevents stacking on restart)
        constants.BOT_SPEED = this.baseConstants.BOT_SPEED;
        constants.ELITE_SPEED_MULTIPLIER = this.baseConstants.ELITE_SPEED_MULTIPLIER;
        constants.FOOD_COUNT = this.baseConstants.FOOD_COUNT;
        constants.BOT_COUNT = this.baseConstants.BOT_COUNT;
        constants.INITIAL_RADIUS = this.baseConstants.INITIAL_RADIUS;
        constants.MASS_DECAY_RATE = this.baseConstants.MASS_DECAY_RATE;

        if (this.activeMutations.includes('chaos-mode')) {
            constants.BOT_SPEED = this.baseConstants.BOT_SPEED * 2;
            constants.ELITE_SPEED_MULTIPLIER = this.baseConstants.ELITE_SPEED_MULTIPLIER * 1.5;
        }

        if (this.activeMutations.includes('scarcity')) {
            constants.FOOD_COUNT = Math.floor(this.baseConstants.FOOD_COUNT / 2);
            constants.BOT_COUNT = Math.floor(this.baseConstants.BOT_COUNT / 2);
        }

        if (this.activeMutations.includes('gigantism')) {
            constants.INITIAL_RADIUS = this.baseConstants.INITIAL_RADIUS * 2;
        }

        if (this.activeMutations.includes('hyper-decay')) {
             constants.MASS_DECAY_RATE = this.baseConstants.MASS_DECAY_RATE * 3;
        }
    }
}
