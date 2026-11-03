import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { io as Client } from 'socket.io-client';
import { createKernelServer } from '../server.js';

describe('Server integration tests', () => {
    let server, io, httpServer, port;

    beforeEach(async () => {
        server = createKernelServer({ MAX_PLAYERS_PER_ROOM: 2 });
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

    const createClient = () => Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        forceNew: true
    });

    it('does not throw or retransmit when player_update has undefined or invalid payload', async () => {
        const c1 = createClient();
        const c2 = createClient();
        await Promise.all([new Promise((r) => c1.on('connect', r)), new Promise((r) => c2.on('connect', r))]);

        c1.emit('join_room', 'roomA');
        c2.emit('join_room', 'roomA');
        await new Promise((r) => setTimeout(r, 50));

        let received = false;
        c2.on('player_moved', () => { received = true; });

        c1.emit('player_update');
        c1.emit('player_update', null);
        c1.emit('player_update', { x: NaN, y: 10, mass: 10, color: '#00ffcc' });
        c1.emit('player_update', { x: 10, y: 10, mass: 10, color: 'notacolor' });

        await new Promise((r) => setTimeout(r, 100));
        expect(received).toBe(false);
        c1.disconnect();
        c2.disconnect();
    });

    it('prevents broadcasting to unjoined rooms', async () => {
        const c1 = createClient();
        const c2 = createClient();
        await Promise.all([new Promise((r) => c1.on('connect', r)), new Promise((r) => c2.on('connect', r))]);

        c2.emit('join_room', 'roomB');
        await new Promise((r) => setTimeout(r, 50));

        let received = false;
        c2.on('player_moved', () => { received = true; });

        c1.emit('player_update', { roomId: 'roomB', x: 100, y: 100, mass: 20, color: '#00FFCC' });
        await new Promise((r) => setTimeout(r, 100));
        expect(received).toBe(false);
        c1.disconnect();
        c2.disconnect();
    });

    it('relays valid player_update to other clients in the same room', async () => {
        const c1 = createClient();
        const c2 = createClient();
        await Promise.all([new Promise((r) => c1.on('connect', r)), new Promise((r) => c2.on('connect', r))]);

        c1.emit('join_room', 'roomValid');
        c2.emit('join_room', 'roomValid');
        await new Promise((r) => setTimeout(r, 50));

        const movedPromise = new Promise((resolve) => {
            c2.on('player_moved', resolve);
        });

        c1.emit('player_update', { x: 500, y: 600, mass: 25, color: '#00ffcc' });
        const moved = await movedPromise;
        expect(moved).toMatchObject({ x: 500, y: 600, mass: 25, color: '#00FFCC' });

        c1.disconnect();
        c2.disconnect();
    });

    it('enforces room capacity limit', async () => {
        const c1 = createClient();
        const c2 = createClient();
        const c3 = createClient();

        await Promise.all([
            new Promise((r) => c1.on('connect', r)),
            new Promise((r) => c2.on('connect', r)),
            new Promise((r) => c3.on('connect', r))
        ]);

        c1.emit('join_room', 'fullRoom');
        c2.emit('join_room', 'fullRoom');
        await new Promise((r) => setTimeout(r, 50));

        const fullPromise = new Promise((resolve) => c3.on('room_full', resolve));
        c3.emit('join_room', 'fullRoom');
        const res = await fullPromise;
        expect(res).toEqual({ roomId: 'fullRoom' });

        c1.disconnect();
        c2.disconnect();
        c3.disconnect();
    });
});
