/**
 * NetworkSystem handles connection to the Socket.io server and manages remote players state.
 */
export class NetworkSystem {
    constructor() {
        this.socket = null;
        this.roomId = null;
        this.otherPlayers = new Map(); // id -> {x, y, mass, color, lastUpdate}
        this.isConnected = false;
    }

    /**
     * Connects to the local server and joins the specified room.
     * @param {string} roomId
     */
    connect(roomId) {
        if (!roomId) return;

        this.roomId = roomId;

        try {
            // Wait for window.io to be available via script tag
            if (!window.io) {
                console.warn("[NETWORK] Socket.io client not loaded");
                return;
            }

            this.socket = window.io("http://localhost:3000");

            this.socket.on('connect', () => {
                console.log(`[NETWORK] Connected to server, joining room: ${roomId}`);
                this.isConnected = true;
                this.socket.emit('join_room', roomId);
            });

            this.socket.on('player_moved', (data) => {
                this.otherPlayers.set(data.id, {
                    x: data.x,
                    y: data.y,
                    mass: data.mass,
                    color: data.color,
                    lastUpdate: Date.now()
                });
            });

            this.socket.on('player_disconnected', (id) => {
                this.otherPlayers.delete(id);
            });

            this.socket.on('disconnect', () => {
                console.log("[NETWORK] Disconnected from server");
                this.isConnected = false;
                this.otherPlayers.clear();
            });

        } catch (e) {
            console.error("[NETWORK] Connection failed", e);
        }
    }

    /**
     * Broadcasts player's current state to the room.
     * @param {import('./player.js').Player} player
     */
    update(player) {
        if (!this.isConnected || !this.socket || !this.roomId) return;

        // Rate limit updates a bit to not flood the server
        const now = Date.now();
        if (!this._lastEmit || now - this._lastEmit > 32) { // roughly 30 ticks per second
            this.socket.emit('player_update', {
                roomId: this.roomId,
                x: player.x,
                y: player.y,
                mass: player.mass,
                color: player.color
            });
            this._lastEmit = now;
        }

        // Clean up stale players (haven't sent update in 5 seconds)
        for (const [id, data] of this.otherPlayers.entries()) {
            if (now - data.lastUpdate > 5000) {
                this.otherPlayers.delete(id);
            }
        }
    }
}
