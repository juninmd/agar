export const BOT_TYPES_SPECIAL = {
    STALKER: {
        color: '#1a1a1a', // Almost black
        speedMultiplier: 1.6,
        massMultiplier: 1.0,
        aggression: 5.0, // High aggression for hunting
        namePrefix: "STALKER"
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
    },
    COLLECTOR: {
        color: '#ADFF2F', // GreenYellow
        speedMultiplier: 1.4,
        massMultiplier: 0.8,
        aggression: 0.0,
        namePrefix: "COLLECTOR"
    },
    ENTANGLED: {
        color: '#8A2BE2', // BlueViolet
        speedMultiplier: 1.2,
        massMultiplier: 1.0,
        aggression: 1.5,
        namePrefix: "ENTANGLED"
    }
};