import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createKernelServer } from '../server.js';

describe('static file exposure', () => {
    let server, base;

    beforeAll(async () => {
        server = createKernelServer();
        await new Promise((resolve) => server.httpServer.listen(0, resolve));
        base = `http://127.0.0.1:${server.httpServer.address().port}`;
    });

    afterAll(async () => {
        await new Promise((resolve) => server.io.close(() => server.httpServer.close(resolve)));
    });

    it.each(['/', '/index.html', '/css/style.css', '/js/main.js'])('serves client asset %s', async (url) => {
        expect((await fetch(base + url)).status).toBe(200);
    });

    it.each(['/package.json', '/server.js', '/server/config.js', '/verification/frontend_test.py', '/js/game_win.test.js', '/.git/config'])(
        'does not serve repo file %s',
        async (url) => {
            expect((await fetch(base + url)).status).toBe(404);
        }
    );
});
