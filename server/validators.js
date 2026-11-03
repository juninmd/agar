/**
 * Validation helpers for server network payloads.
 */
import { SERVER_CONFIG } from './config.js';

const ROOM_ID_REGEX = /^[\w-]{1,32}$/;
const COLOR_HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

/**
 * Validates a room identifier string.
 * @param {unknown} roomId
 * @returns {boolean}
 */
export function isValidRoomId(roomId) {
    if (typeof roomId !== 'string') return false;
    return ROOM_ID_REGEX.test(roomId);
}

/**
 * Validates a color hex code (#RRGGBB).
 * @param {unknown} color
 * @returns {boolean}
 */
export function isValidColor(color) {
    if (typeof color !== 'string') return false;
    return COLOR_HEX_REGEX.test(color);
}

/**
 * Validates a coordinate number within world limits.
 * @param {unknown} val
 * @param {number} max
 * @returns {boolean}
 */
export function isValidCoordinate(val, max) {
    if (typeof val !== 'number' || !Number.isFinite(val)) return false;
    return val >= 0 && val <= max;
}

/**
 * Validates player mass.
 * @param {unknown} mass
 * @param {number} [lastMass]
 * @param {number} [maxGrowth]
 * @returns {boolean}
 */
export function isValidMass(mass, lastMass = null, maxGrowth = SERVER_CONFIG.MAX_MASS_GAIN_PER_UPDATE) {
    if (typeof mass !== 'number' || !Number.isFinite(mass) || mass <= 0) {
        return false;
    }
    if (lastMass !== null && Number.isFinite(lastMass)) {
        if (mass - lastMass > maxGrowth) {
            return false;
        }
    }
    return true;
}

/**
 * Validates and sanitizes a player update payload.
 * Returns null if invalid or unsafe.
 * @param {unknown} data
 * @param {number|null} [lastMass]
 * @param {object} [bounds]
 * @returns {{x: number, y: number, mass: number, color: string}|null}
 */
export function validatePlayerUpdate(data, lastMass = null, bounds = SERVER_CONFIG) {
    if (!data || typeof data !== 'object') {
        return null;
    }

    const { x, y, mass, color } = /** @type {Record<string, unknown>} */ (data);

    if (!isValidCoordinate(x, bounds.WORLD_WIDTH ?? 3000)) return null;
    if (!isValidCoordinate(y, bounds.WORLD_HEIGHT ?? 3000)) return null;
    if (!isValidMass(mass, lastMass, bounds.MAX_MASS_GAIN_PER_UPDATE)) return null;
    if (!isValidColor(color)) return null;

    return {
        x: Number(x),
        y: Number(y),
        mass: Number(mass),
        color: String(color).toUpperCase()
    };
}
