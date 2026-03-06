export const PROTOCOLS = {
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
    },
    VIRAL: {
        id: 'VIRAL',
        name: "VIRAL",
        color: "#9D00FF", // Purple
        massMultiplier: 0.5, // Starts tiny
        speedMultiplier: 1.3, // Fast
        description: "HIGH RISK. CONSUME BOTS."
    },
    CYPHER: {
        id: 'CYPHER',
        name: "CYPHER",
        color: "#FFD700", // Gold
        massMultiplier: 1.0, // Normal
        speedMultiplier: 1.1, // Slightly Faster
        description: "OVERCLOCK. TIME DILATION."
    },
    ARCHITECT: {
        id: 'ARCHITECT',
        name: "ARCHITECT",
        color: "#FFFFFF", // White
        massMultiplier: 1.5, // Larger
        speedMultiplier: 1.2, // Fast
        description: "THE CREATOR. SOURCE CODE."
    }
};
