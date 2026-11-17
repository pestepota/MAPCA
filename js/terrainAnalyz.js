
export class TerrainAnalyzer {

    constructor(model) {
        this.model = model;
    }

    //find the continuos landmasses
    analyzeLandmasses() {

        const width = this.model.mapWidth;
        const height = this.model.mapHeight;
        const grid = this.model.grid;

        const visited = new Uint8Array(width * height);
        const landmasses = [];

        //movement by four dimensions
        const directions = [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0]
        ];

        for (let y = 0; y < height; y++) {

            for (let x = 0; x < width; x++) {

                const startIndex = y * width + x;

                //ignore previus cells and ocean
                if (grid[y][x] !== 0 || visited[startIndex]) {
                    continue;
                }

                const queue = [startIndex];
                let head = 0;

                visited[startIndex] = 1;

                const cells = [];

                let minX = x;
                let maxX = x;
                let minY = y;
                let maxY = y;

                //explore the entire conected landmass
                while (head < queue.length) {

                    const currentIndex = queue[head++];

                    const currentX = currentIndex % width;
                    const currentY = Math.floor(currentIndex / width);

                    cells.push({
                        x: currentX,
                        y: currentY
                    });

                    minX = Math.min(minX, currentX);
                    maxX = Math.max(maxX, currentX);
                    minY = Math.min(minY, currentY);
                    maxY = Math.max(maxY, currentY);

                    for (const [dx, dy] of directions) {

                        const nextX = currentX + dx;
                        const nextY = currentY + dy;

                        //check the map boundaries
                        if (
                            nextX < 0 ||
                            nextX >= width ||
                            nextY < 0 ||
                            nextY >= height
                        ) {
                            continue;
                        }

                        const nextIndex = nextY * width + nextX;

                        if (
                            grid[nextY][nextX] === 0 &&
                            !visited[nextIndex]
                        ) {

                            visited[nextIndex] = 1;
                            queue.push(nextIndex);
                        }
                    }
                }

                landmasses.push({
                    id: landmasses.length + 1,
                    size: cells.length,
                    cells: cells,
                    bounds: {
                        minX,
                        maxX,
                        minY,
                        maxY
                    }
                });
            }
        }

        //get the largest landmass first
        landmasses.sort((a, b) => b.size - a.size);

        return landmasses;
    }

    //remove small landmasses
    removeSmallLandmasses(minSize) {

        const landmasses = this.analyzeLandmasses();

        //preserve the largest landmass
        for (let i = 1; i < landmasses.length; i++) {

            const landmass = landmasses[i];

            if (landmass.size < minSize) {

                for (const cell of landmass.cells) {
                    this.model.grid[cell.y][cell.x] = -1;
                }
            }
        }

        return this.analyzeLandmasses();
    }

}
