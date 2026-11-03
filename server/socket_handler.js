/**
 * Socket event handler logic extracted to maintain clean separation
 * and adhere to strict line-count limits.
 */
import { isValidRoomId, validatePlayerUpdate } from './validators.js';

/**
 * Attaches validated socket handlers to incoming connections.
 * @param {import('socket.io').Server} io
 * @param {import('./rate_limiter.js').SocketRateLimiter} rateLimiter
 * @param {object} config
 */
export function registerSocketHandlers(io, rateLimiter, config) {
    const lastMassMap = new Map();

    io.on('connection', (socket) => {
        console.log(`[NETWORK] Socket connected: ${socket.id}`);

        socket.on('join_room', (roomId) => {
            if (!isValidRoomId(roomId)) return;

            const room = io.sockets.adapter.rooms.get(roomId);
            const currentCount = room ? room.size : 0;
            if (currentCount >= config.MAX_PLAYERS_PER_ROOM) {
                socket.emit('room_full', { roomId });
                return;
            }

            for (const existingRoom of socket.rooms) {
                if (existingRoom !== socket.id) {
                    socket.leave(existingRoom);
                }
            }

            socket.join(roomId);
            console.log(`[NETWORK] Socket ${socket.id} joined room ${roomId}`);
        });

        socket.on('player_update', (data) => {
            if (!rateLimiter.allow(socket.id)) return;

            // Only broadcast to a valid joined room
            let joinedRoom = null;
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    joinedRoom = room;
                    break;
                }
            }
            if (!joinedRoom) return;

            const lastMass = lastMassMap.get(socket.id) ?? null;
            const valid = validatePlayerUpdate(data, lastMass, config);
            if (!valid) return;

            lastMassMap.set(socket.id, valid.mass);

            socket.to(joinedRoom).emit('player_moved', {
                id: socket.id,
                x: valid.x,
                y: valid.y,
                mass: valid.mass,
                color: valid.color
            });
        });

        socket.on('disconnecting', () => {
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    socket.to(room).emit('player_disconnected', socket.id);
                }
            }
        });

        socket.on('disconnect', () => {
            rateLimiter.remove(socket.id);
            lastMassMap.delete(socket.id);
            console.log(`[NETWORK] Socket disconnected: ${socket.id}`);
        });
    });
}
