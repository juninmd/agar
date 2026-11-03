import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { io as Client } from 'socket.io-client';
import { createKernelServer } from '../server.js';

describe('Server flood and rate-limiting tests', () => {
    let server, io, httpServer, port;

    beforeEach(async () => {
        // max 2 messages per second for test
        server = createKernelServer({ MAX_MESSAGES_PER_SEC: 2 });
        httpServer = server.httpServer;
        io = server.io;

        await new Promise((resolve) => {
            httpServer.listen(0, () => {
                port = httpServer.address().port;
                resolve();
            });
        });
    });

    afterEach(async () => {
        await new Promise((resolve) => {
            io.close(() => {
                httpServer.close(resolve);
            });
        });
    });

    it('drops flood messages exceeding the rate limit', async () => {
        const client1 = Client(`http://localhost:${port}`, { transports: ['websocket'] });
        const client2 = Client(`http://localhost:${port}`, { transports: ['websocket'] });

        await Promise.all([
            new Promise((r) => client1.on('connect', r)),
            new Promise((r) => client2.on('connect', r))
        ]);

        client1.emit('join_room', 'rateLimitRoom');
        client2.emit('join_room', 'rateLimitRoom');
        await new Promise((r) => setTimeout(r, 50));

        let receivedCount = 0;
        client2.on('player_moved', () => {
            receivedCount++;
        });

        // Send 10 rapid messages
        for (let i = 0; i < 10; i++) {
            client1.emit('player_update', {
                x: 100 + i,
                y: 100 + i,
                mass: 20,
                color: '#00FFCC'
            });
        }

        await new Promise((r) => setTimeout(r, 200));
        // Max 2 should be received due to rate limit = 2 msgs/sec
        expect(receivedCount).toBe(2);

        client1.disconnect();
        client2.disconnect();
    });
});
