export const Utils = {
    randomRange: (min, max) => {
        return Math.random() * (max - min) + min;
    },

    randomColor: (colors) => {
        return colors[Math.floor(Math.random() * colors.length)];
    },

    getDistance: (x1, y1, x2, y2) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // Convert hex to rgba for glow effects
    hexToRgba: (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    // Calculate radius from mass (area)
    getRadiusFromMass: (mass) => {
        return Math.sqrt(mass / Math.PI);
    },

    // Calculate mass (area) from radius
    getMassFromRadius: (radius) => {
        return Math.PI * radius * radius;
    }
};
