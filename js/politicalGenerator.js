export class PoliticalGenerator {
    constructor(model, analyzer, random) {
        this.model = model;
        this.analyzer = analyzer;
        this.random = random;
    }

    generate(totalCountries = 8) {
        this.model.countries = [];
        const landmasses = this.analyzer.analyzeLandmasses().filter(landmass => landmass.size >= 50);
        if (landmasses.length === 0) return;
        const totalLand = landmasses.reduce(
            (sum, landmass) => sum+landmass.size, 0
        );
        let countryId = 1;
        let remaining = totalCountries;
        

        const allocations = landmasses.map((landmass,index) => {
            const count = index === landmasses.length - 1
            ? Math.max(1, remaining)
            : Math.max(1, Math.floor(totalCountries*landmass.size/totalLand));
            remaining -= count
            return count
        })
           //generate countries on each landmass
        landmasses.forEach((landmass, index) => {
            const seeds = this.chooseSeeds(
                landmass.cells,
                allocations[index]
            );

            for (const seed of seeds) {
                this.model.countries.push({
                    id: countryId,
                    name: `Country ${countryId}`,
                    size: 0
                });

                seed.countryId = countryId;
                countryId++;
            }

            this.expandCountries(seeds);
        });
    }

    chooseSeeds(cells, count) {
        const seeds = [];
        const minDistances = new Array(cells.length).fill(Infinity);

        let selected = this.random.integer(0, cells.length - 1);
        seeds.push({ ...cells[selected] });

        for (let i = 1; i < count; i++) {
            const lastSeed = seeds[seeds.length - 1];

            for (let j = 0; j < cells.length; j++) {
                const dx = cells[j].x - lastSeed.x;
                const dy = cells[j].y - lastSeed.y;

                const distance = dx * dx + dy * dy;

                minDistances[j] = Math.min(
                    minDistances[j],
                    distance
                );
            }

            let farthest = 0;

            for (let j = 1; j < cells.length; j++) {
                if (minDistances[j] > minDistances[farthest]) {
                    farthest = j;
                }
            }

            seeds.push({ ...cells[farthest] });
        }

        return seeds;
    }

    expandCountries(seeds) {
        const grid = this.model.grid;
        const width = this.model.mapWidth;
        const height = this.model.mapHeight;

        const queue = [];
        let head = 0;

        const directions = [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0]
        ];

        for (const seed of seeds) {
            grid[seed.y][seed.x] = seed.countryId;

            queue.push({
                x: seed.x,
                y: seed.y,
                countryId: seed.countryId
            });
        }

        while (head < queue.length) {
            const current = queue[head++];

            for (const [dx, dy] of directions) {
                const x = current.x + dx;
                const y = current.y + dy;

                if (
                    x < 0 || x >= width ||
                    y < 0 || y >= height
                ) continue;

                if (grid[y][x] !== 0) continue;

                grid[y][x] = current.countryId;

                queue.push({
                    x,
                    y,
                    countryId: current.countryId
                });
            }
        }

        for (const row of grid) {
            for (const cell of row) {
                if (cell > 0) {
                    this.model.countries[cell - 1].size++;
                }
            }
        }
    }
}