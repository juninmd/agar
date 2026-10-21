import { BOT_TYPES } from './config/bot_types.js';
import { POWERUP_TYPES } from './config/powerup_types.js';
import { PROTOCOLS } from './config/protocols.js';

export const CONSTANTS = {
    WORLD_WIDTH: 3000,
    WORLD_HEIGHT: 3000,
    GRID_SIZE: 50,
    INITIAL_RADIUS: 20,
    MIN_FOOD_RADIUS: 4,
    MAX_FOOD_RADIUS: 8,
    FOOD_COUNT: 400,
    BOT_COUNT: 25,
    WIN_MASS: 5000,
    PLAYER_SPEED_BASE: 5,
    ZOOM_BASE: 1,
    COLORS: [
        '#FF00FF', // Neon Pink
        '#00FFFF', // Cyan
        '#00FF00', // Lime
        '#FFFF00', // Yellow
        '#FF0000', // Red
        '#9D00FF', // Purple
        '#FF8800'  // Neon Orange
    ],
    POWERUP: {
        RADIUS: 15
    },
    BOT_TYPES,
    POWERUP_TYPES,
    PROTOCOLS,
    ECLIPSE_DASH_DURATION_FRAMES: 30,
    ECLIPSE_PHASING_ALPHA: 0.3
};
