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
        CORRUPTER: {
            color: '#1a0000', // Very dark red/black
            speedMultiplier: 0.9,
            massMultiplier: 0.5, // Small but deadly
            aggression: 3.0, // Very aggressive seeking
            namePrefix: "TROJAN"
        },
        NORMAL: {
            color: null, // Random
            speedMultiplier: 1.0,
            massMultiplier: 1.0,
            aggression: 1.0,
            namePrefix: "BOT"
        }
    },
    POWERUP: {
        RADIUS: 15
    },
    POWERUP_TYPES: {
        MASS: {
            id: 'MASS',
            color: '#FFD700', // Gold
            value: 500, // Mass added
            duration: 0,
            symbol: 'DATA'
        },
        SPEED: {
            id: 'SPEED',
            color: '#00FFFF', // Cyan
            value: 2.5, // Speed multiplier
            duration: 300, // 5 seconds at 60fps
            symbol: 'SPD'
        },
        SHIELD: {
            id: 'SHIELD',
            color: '#FFFFFF', // White
            value: 1,
            duration: 300, // 5 seconds
            symbol: 'SHLD'
        }
    },
    PROTOCOLS: {
        BASTION: {
            id: 'BASTION',
            name: "BASTION",
            color: "#0000FF", // Blue
            massMultiplier: 2.0, // Starts bigger
            speedMultiplier: 0.8, // Slower
            description: "HEAVY ARMOR. SLOW DECAY."
        },
        PHANTOM: {
            id: 'PHANTOM',
            name: "PHANTOM",
            color: "#FF00FF", // Pink
            massMultiplier: 0.8, // Smaller
            speedMultiplier: 1.5, // Faster
            description: "HIGH SPEED. LOW MASS."
        },
        HACKER: {
            id: 'HACKER',
            name: "HACKER",
            color: "#00FF41", // Green
            massMultiplier: 1.0, // Normal
            speedMultiplier: 1.0, // Normal
            description: "BALANCED. STANDARD ISSUE."
        }
    }
};
