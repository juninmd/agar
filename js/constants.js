export const CONSTANTS = {
    WORLD_WIDTH: 3000,
    WORLD_HEIGHT: 3000,
    GRID_SIZE: 50,
    INITIAL_RADIUS: 20,
    MIN_FOOD_RADIUS: 4,
    MAX_FOOD_RADIUS: 8,
    FOOD_COUNT: 400,
    BOT_COUNT: 25,
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
    BOT_TYPES: {
        SEEKER: {
            color: '#FF0000', // Red
            speedMultiplier: 1.5,
            massMultiplier: 0.8,
            aggression: 2.0,
            namePrefix: "SEEKER"
        },
        GUARDIAN: {
            color: '#0000FF', // Blue
            speedMultiplier: 0.6,
            massMultiplier: 3.0,
            aggression: 0.2, // Defensive
            namePrefix: "WARDEN"
        },
        GLITCH: {
            color: '#00FF41', // Matrix Green (placeholder, will change dynamically)
            speedMultiplier: 1.2,
            massMultiplier: 1.0,
            aggression: 1.0,
            teleportChance: 0.02,
            namePrefix: "ERR"
        },
        NORMAL: {
            color: null, // Random
            speedMultiplier: 1.0,
            massMultiplier: 1.0,
            aggression: 1.0,
            namePrefix: "BOT"
        }
    }
};
