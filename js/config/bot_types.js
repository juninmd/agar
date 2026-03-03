export const BOT_TYPES = {
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
    ELITE_HUNTER: {
        color: '#FFFFFF', // White
        speedMultiplier: 1.8,
        massMultiplier: 1.1,
        aggression: 5.0, // Extreme aggression
        namePrefix: "PURGE_UNIT"
    },
    VOID_WALKER: {
        color: '#110011', // Almost Black
        speedMultiplier: 1.4,
        massMultiplier: 0.8,
        aggression: 10.0, // Absolute Hunter
        namePrefix: "VOID"
    },
    GHOST: {
        color: '#FFFFFF', // White with low alpha
        speedMultiplier: 0.1, // Drifting
        massMultiplier: 1.0,
        aggression: 0.0, // Passive
        namePrefix: "ECHO"
    },
    SENTINEL: {
        color: '#FF0000', // Bright Red
        speedMultiplier: 0.5, // Slow but menacing
        massMultiplier: 5.0, // Massive
        aggression: 10.0, // Relentless
        namePrefix: "KERNEL_GUARDIAN"
    },
    GREAT_FIREWALL: {
        color: '#FF4400', // Deep Orange
        speedMultiplier: 1.0,
        massMultiplier: 200.0, // Wall
        aggression: 0.0,
        namePrefix: "FIREWALL"
    },
    NORMAL: {
        color: null, // Random
        speedMultiplier: 1.0,
        massMultiplier: 1.0,
        aggression: 1.0,
        namePrefix: "BOT"
    }
};
