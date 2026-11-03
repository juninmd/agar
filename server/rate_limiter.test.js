import { describe, it, expect } from 'vitest';
import { SocketRateLimiter } from './rate_limiter.js';
import { getCorsOrigin } from './config.js';

describe('server/rate_limiter.js', () => {
    it('allows requests up to maxPerSec in 1s window', () => {
        const limiter = new SocketRateLimiter(3);
        const now = 10000;
        expect(limiter.allow('sock1', now)).toBe(true);
        expect(limiter.allow('sock1', now + 100)).toBe(true);
        expect(limiter.allow('sock1', now + 200)).toBe(true);
        expect(limiter.allow('sock1', now + 300)).toBe(false);

        // Advance 1s
        expect(limiter.allow('sock1', now + 1001)).toBe(true);
    });

    it('cleans up on remove', () => {
        const limiter = new SocketRateLimiter(2);
        limiter.allow('sock1');
        expect(limiter.history.has('sock1')).toBe(true);
        limiter.remove('sock1');
        expect(limiter.history.has('sock1')).toBe(false);
    });
});

describe('server/config.js getCorsOrigin', () => {
    it('handles explicit CORS_ORIGINS environment variable', () => {
        expect(getCorsOrigin('*')).toBe('*');
        expect(getCorsOrigin('https://example.com')).toBe('https://example.com');
        expect(getCorsOrigin('https://a.com, https://b.com')).toEqual(['https://a.com', 'https://b.com']);
    });

    it('defaults correctly based on NODE_ENV', () => {
        expect(getCorsOrigin(undefined, 'development')).toBe('*');
        expect(getCorsOrigin(undefined, 'production')).toBe(false);
    });
});
