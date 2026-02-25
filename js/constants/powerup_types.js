export const POWERUP_TYPES = {
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
    },
    VIRUS: {
        id: 'VIRUS',
        color: '#32CD32', // Lime Green
        value: 1000, // High Mass Reward
        duration: 300, // 5 seconds of Inverted Controls
        symbol: 'ERR'
    }
};
