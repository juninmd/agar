/**
 * SpatialHash implementation for O(N) collision broad-phase.
 * Divides the space into a grid and hashes entities into cells.
 */
export class SpatialHash {
    /**
     * @param {number} cellSize - The size of each grid cell.
     */
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.cells = new Map();
    }

    /**
     * Hashes an x, y coordinate to an integer key to avoid GC pressure.
     * @param {number} x - X coordinate index.
     * @param {number} y - Y coordinate index.
     * @returns {number} The cell integer key.
     */
    _hash(x, y) {
        return (x + 1000) * 10000 + (y + 1000);
    }

    /**
     * Clears all entities from the spatial hash.
     */
    clear() {
        this.cells.clear();
    }

    /**
     * Inserts an entity into the spatial hash.
     * @param {Object} entity - The entity to insert. Must have x, y, and radius.
     */
    insert(entity) {
        const minX = Math.floor((entity.x - entity.radius) / this.cellSize);
        const maxX = Math.floor((entity.x + entity.radius) / this.cellSize);
        const minY = Math.floor((entity.y - entity.radius) / this.cellSize);
        const maxY = Math.floor((entity.y + entity.radius) / this.cellSize);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                const key = this._hash(x, y);
                if (!this.cells.has(key)) {
                    this.cells.set(key, []);
                }
                this.cells.get(key).push(entity);
            }
        }
    }

    /**
     * Queries for potential collisions near a specific coordinate and radius.
     * Populates and returns a Set of unique entities.
     * @param {number} px - The x coordinate to query.
     * @param {number} py - The y coordinate to query.
     * @param {number} radius - The search radius.
     * @param {Set} [result] - Optional existing Set to reuse (it will be cleared).
     * @returns {Set} A Set of entities within the bounding box of the query.
     */
    query(px, py, radius, result = new Set()) {
        result.clear();
        const minX = Math.floor((px - radius) / this.cellSize);
        const maxX = Math.floor((px + radius) / this.cellSize);
        const minY = Math.floor((py - radius) / this.cellSize);
        const maxY = Math.floor((py + radius) / this.cellSize);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                const key = this._hash(x, y);
                const cell = this.cells.get(key);
                if (cell) {
                    for (let i = 0; i < cell.length; i++) {
                        result.add(cell[i]);
                    }
                }
            }
        }

        return result;
    }
}
