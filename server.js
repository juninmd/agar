import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for local dev
        methods: ["GET", "POST"]
    }
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log(`[NETWORK] Socket connected: ${socket.id}`);

    socket.on('join_room', (roomId) => {
        // Leave all current rooms except their own socket ID room
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
            }
        }

        socket.join(roomId);
        console.log(`[NETWORK] Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('player_update', (data) => {
        if (!data.roomId) return;
        // Broadcast to everyone else in the room
        socket.to(data.roomId).emit('player_moved', {
            id: socket.id,
            x: data.x,
            y: data.y,
            mass: data.mass,
            color: data.color
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
        console.log(`[NETWORK] Socket disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`[SERVER] Kernel.io Multiplayer Server running on port ${PORT}`);
});
