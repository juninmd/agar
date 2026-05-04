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
    NORMAL: {
        color: null, // Random
        speedMultiplier: 1.0,
        massMultiplier: 1.0,
        aggression: 1.0,
        namePrefix: "BOT"
    },
    GLITCH_WEAVER: {
        color: '#8A2BE2', // BlueViolet
        speedMultiplier: 0.8,
        massMultiplier: 3.0,
        aggression: 0.5,
        namePrefix: "WEAVER"
    },
    PARASITE: {
        color: '#00FF88', // Bio-Green
        speedMultiplier: 2.0, // Very fast
        massMultiplier: 0.3, // Very small
        aggression: 4.0, // Highly aggressive, like a leech
        namePrefix: "PARASITE",
        drainAmount: 0.5,
        drainMassThreshold: 20
    },
    MIMIC: {
        color: '#FFD700', // Gold (looks like powerup/lore)
        speedMultiplier: 1.5,
        massMultiplier: 0.5, // Small, looks like item
        aggression: 5.0, // Very aggressive when close
        namePrefix: "MIMIC"
    },
    SOULBINDER: {
        color: '#8B008B', // Dark Magenta
        speedMultiplier: 1.2,
        massMultiplier: 1.5,
        aggression: 3.0,
        namePrefix: "SOUL"
    },
    MERCHANT: {
        color: '#FFD700', // Gold/Yellow
        speedMultiplier: 0.8, // Slightly slow and heavily armored conceptually
        massMultiplier: 2.0, // Large base mass
        aggression: 0.0, // Totally neutral
        namePrefix: "MERCHANT"
    },
    ILLUSIONIST: {
        color: '#00FFFF', // Cyan
        speedMultiplier: 1.1,
        massMultiplier: 1.0,
        aggression: 1.0,
        namePrefix: "MIRAGE"
    },
    DECOY: {
        color: '#FFFFFF', // Inherits player/bot color later
        speedMultiplier: 1.0,
        massMultiplier: 1.0,
        aggression: 0.0, // Passive
        namePrefix: "DECOY"
    },
    ANOMALY: {
        color: '#FFA500', // Orange
        speedMultiplier: 1.2,
        massMultiplier: 1.0,
        aggression: 1.0,
        namePrefix: "ANOMALY"
    },
    PULSAR: {
        color: '#E6E6FA', // Lavender
        speedMultiplier: 1.0,
        massMultiplier: 1.5,
        aggression: 1.5,
        namePrefix: "PULSAR"
    },
    DRONE: {
        color: '#FF8C00', // Dark Orange
        speedMultiplier: 2.0, // Very fast
        massMultiplier: 0.2, // Very small
        aggression: 3.0, // Aggressive
        namePrefix: "DRONE"
    },
    FRAGMENTER: {
        color: '#00FFCC', // Teal/Cyan
        speedMultiplier: 1.3,
        massMultiplier: 1.0,
        aggression: 0.5, // Erratic
        namePrefix: "FRAG"
    },
    ORACLE: {
        color: '#00FA9A', // MediumSpringGreen
        speedMultiplier: 0.0, // Stationary
        massMultiplier: 1.5,
        aggression: 0.0, // Passive
        namePrefix: "ORACLE"
    },
    SMITH: {
        color: '#A9A9A9', // DarkGray
        speedMultiplier: 1.1,
        massMultiplier: 1.2,
        aggression: 0.0, // Passive, follows bots
        namePrefix: "SMITH"
    },
    NEURON: {
        color: '#FF007F', // Deep Pink
        speedMultiplier: 1.1,
        massMultiplier: 1.0,
        aggression: 0.0, // Clusters, doesn't attack
        namePrefix: "NEURON"
    },
    BUMPER: {
        color: '#FF4500', // Orange Red
        speedMultiplier: 1.2,
        massMultiplier: 1.2,
        aggression: 2.0, // Aggressively bounces
        namePrefix: "BUMPER"
    },
    LODESTONE: {
        color: '#4B0082', // Indigo
        speedMultiplier: 0.8,
        massMultiplier: 1.5,
        aggression: 1.0,
        namePrefix: "LODESTONE"
    },
    GHOUL: {
        color: '#8B0000', // Dark Red / Crimson
        speedMultiplier: 1.3,
        massMultiplier: 0.8, // Typically smaller scavengers
        aggression: 4.0, // High aggression towards weak targets
        namePrefix: "GHOUL"
    },
    TANK: {
        color: '#8B4513', // SaddleBrown
        speedMultiplier: 0.5,
        massMultiplier: 2.5,
        aggression: 0.5,
        namePrefix: "TANK"
    },
    WRAITH: {
        color: '#E0FFFF', // Light Cyan
        speedMultiplier: 1.1,
        massMultiplier: 1.0,
        aggression: 1.0,
        namePrefix: "WRAITH"
    }
};
