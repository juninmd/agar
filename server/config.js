/**
 * Server configuration helper.
 */

/**
 * Returns allowed CORS origin(s) based on environment.
 * @param {string} [envOrigins]
 * @param {string} [nodeEnv]
 * @returns {string|string[]|boolean}
 */
export function getCorsOrigin(envOrigins = process.env.CORS_ORIGINS, nodeEnv = process.env.NODE_ENV) {
    if (envOrigins) {
        const trimmed = envOrigins.trim();
        if (trimmed === '*') return '*';
        const split = trimmed.split(',').map((origin) => origin.trim()).filter(Boolean);
        return split.length === 1 ? split[0] : split;
    }

    if (nodeEnv === 'production') {
        return false; // Disallow arbitrary origins by default in production
    }

    return '*'; // Default to wildcard in local/dev environments
}

export const SERVER_CONFIG = {
    PORT: Number(process.env.PORT) || 3000,
    MAX_PLAYERS_PER_ROOM: Number(process.env.MAX_PLAYERS_PER_ROOM) || 20,
    MAX_MESSAGES_PER_SEC: 40,
    MAX_MASS_GAIN_PER_UPDATE: 200,
    WORLD_WIDTH: 3000,
    WORLD_HEIGHT: 3000
};
