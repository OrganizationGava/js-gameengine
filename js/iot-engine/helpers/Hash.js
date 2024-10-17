const maxNumObjects = 10000;
const tableSize = 5 * maxNumObjects;

export class SHash {
    constructor() {
        this.cellSize = 0;
        this.entCount = 0;
        this.pool = new Array(maxNumObjects).fill(0);
        this.cellStart = new Array(tableSize + 1).fill(0);
        this.cellEntries = new Array(maxNumObjects).fill(0);
        this.queryIds = new Array(500).fill(0);
    }

    static hashCoords(x, y) {
        const h = (x * 73856093) ^ (y * 83492791);
        return h % tableSize;
    }

    clear() {
        this.entCount = 0;
        this.pool.fill(0);
        this.cellStart.fill(0);
        this.cellEntries.fill(0);
    }

    add(id, x, y) {
        if (this.entCount < maxNumObjects) {
            const index = SHash.hashCoords(Math.floor(x / this.cellSize), Math.floor(y / this.cellSize));
            this.cellStart[index]++;
            this.pool[this.entCount] = id;
            this.entCount = Math.min(this.entCount + 1, maxNumObjects - 1);
        }
    }

    process(cells) {
        let start = 0;
        for (let i = 0; i < tableSize; i++) {
            start += this.cellStart[i];
            this.cellStart[i] = start;
        }
        this.cellStart[tableSize] = start;

        for (let i = 0; i < this.entCount; i++) {
            const id = this.pool[i];
            const x = Math.floor(cells[id].x / this.cellSize);
            const y = Math.floor(cells[id].y / this.cellSize);
            const index = SHash.hashCoords(x, y);

            this.cellStart[index]--;
            this.cellEntries[this.cellStart[index]] = id;
        }
    }

    query(x, y, maxDist) {
        this.queryIds.fill(0);

        const x1 = Math.floor((x - maxDist) / this.cellSize);
        const y1 = Math.floor((y - maxDist) / this.cellSize);
        const x2 = Math.floor((x + maxDist) / this.cellSize);
        const y2 = Math.floor((y + maxDist) / this.cellSize);
        let querySize = 0;

        for (let xi = x1; xi <= x2; xi++) {
            for (let yi = y1; yi <= y2; yi++) {
                const index = SHash.hashCoords(xi, yi);
                const start = this.cellStart[index];
                const finish = this.cellStart[index + 1];

                for (let i = start; i < finish; i++) {
                    this.queryIds[querySize] = this.cellEntries[i];
                    querySize++;
                }
            }
        }

        return querySize;
    }
}





