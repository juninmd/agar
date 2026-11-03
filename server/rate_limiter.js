/**
 * Sliding window rate limiter for socket connections.
 */
import { SERVER_CONFIG } from './config.js';

export class SocketRateLimiter {
    /**
     * @param {number} [maxPerSec]
     */
    constructor(maxPerSec = SERVER_CONFIG.MAX_MESSAGES_PER_SEC) {
        this.maxPerSec = maxPerSec;
        /** @type {Map<string, number[]>} */
        this.history = new Map();
    }

    /**
     * Records a message attempt. Returns true if allowed, false if throttled.
     * @param {string} socketId
     * @param {number} [now]
     * @returns {boolean}
     */
    allow(socketId, now = Date.now()) {
        const timestamps = this.history.get(socketId) || [];
        const windowStart = now - 1000;

        // Prune older than 1 second
        const validTimestamps = timestamps.filter((t) => t > windowStart);

        if (validTimestamps.length >= this.maxPerSec) {
            this.history.set(socketId, validTimestamps);
            return false;
        }

        validTimestamps.push(now);
        this.history.set(socketId, validTimestamps);
        return true;
    }

    /**
     * Cleans up tracking data for disconnected sockets.
     * @param {string} socketId
     */
    remove(socketId) {
        this.history.delete(socketId);
    }
}
