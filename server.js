import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { SERVER_CONFIG, getCorsOrigin } from './server/config.js';
import { SocketRateLimiter } from './server/rate_limiter.js';
import { registerSocketHandlers } from './server/socket_handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates and configures the Express and Socket.io server.
 * @param {object} [customConfig]
 * @returns {{app: express.Express, httpServer: import('http').Server, io: Server}}
 */
export function createKernelServer(customConfig = {}) {
    const config = { ...SERVER_CONFIG, ...customConfig };
    const app = express();
    const httpServer = createServer(app);

    const corsOrigin = customConfig.corsOrigin !== undefined
        ? customConfig.corsOrigin
        : getCorsOrigin();

    const io = new Server(httpServer, {
        cors: {
            origin: corsOrigin,
            methods: ['GET', 'POST']
        }
    });

    app.use(express.static(__dirname));

    const rateLimiter = new SocketRateLimiter(config.MAX_MESSAGES_PER_SEC);
    registerSocketHandlers(io, rateLimiter, config);

    return { app, httpServer, io };
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
    const { httpServer } = createKernelServer();
    httpServer.listen(SERVER_CONFIG.PORT, () => {
        console.log(`[SERVER] Kernel.io Multiplayer Server running on port ${SERVER_CONFIG.PORT}`);
    });
}
