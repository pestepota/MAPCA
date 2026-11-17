export class TerrainGenerator {
    constructor(model, random) {
        this.model = model;
        this.random = random;
    }

    //main terrain gen method
    generate(type) {
        this.resetGrid();
        switch (type) {
            case "archipelago":
                this.generateArchipelago();
                break
            case "continents":
                this.generateContinents();
                break
            case "pangea":
                this.generatePangea();
                break
            default:
                throw new Error("Terrain type error");
        }

        return this.model.grid
    }

    //reset map grid
    resetGrid() {
        this.model.grid = [];
        for (let y = 0; y < this.model.mapHeight; y++) {
            const row = [];

            for (let x = 0; x < this.model.mapWidth; x++) {
                row.push(0)
            }
            this.model.grid.push(row);
        }
    }

    //gen archipelago
    generateArchipelago() {
        const noiseMap = this.generateNoiseMap(7, 5, 3);

        this.classifyTerrain(noiseMap, 0.57);
    }

    //gen multi continents
    generateContinents() {
        const noiseMap = this.generateNoiseMap(3,2,4);
        this.classifyTerrain(noiseMap, 0.51);
    }

    //gen pangea
    generatePangea() {
        const noiseMap = this.generateNoiseMap(3, 2, 4);
        const width = this.model.mapWidth;
        const height = this.model.mapHeight;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const normalizedX = x / (width - 1);
                const normalizedY = y / (height - 1);
            
                //dis from map center
                const dx = (normalizedX - 0.5) / 0.43;
                const dy = (normalizedY - 0.5) / 0.35;
                const distance = Math.sqrt(dx*dx+dy*dy);

                //create a smooth continental mask
                const mask = 1 - this.smoothStep(0.75,1.15,distance);
                const landScore = noiseMap[y][x] * 0.35 + mask * 0.8;

                this.model.grid[y][x] = landScore > 0.65 ? 0 : -1
            }
        }
    }

    //generate a multi-scale noise map
    generateNoiseMap(baseScaleX, baseScaleY, octaves) {

        const width = this.model.mapWidth;
        const height = this.model.mapHeight;

        const noiseMap = [];

        for (let y = 0; y < height; y++) {
            noiseMap.push(new Array(width).fill(0));
        }

        let amplitude = 1;
        let totalAmplitude = 0;

        for (let octave = 0; octave < octaves; octave++) {

            const scaleX = baseScaleX * Math.pow(2, octave);
            const scaleY = baseScaleY * Math.pow(2, octave);

            const noise = this.generateValueNoise(scaleX, scaleY);

            for (let y = 0; y < height; y++) {

                for (let x = 0; x < width; x++) {

                    noiseMap[y][x] += noise[y][x] * amplitude;
                }
            }

            totalAmplitude += amplitude;
            amplitude *= 0.5;
        }

        //normalization
        for (let y = 0; y < height; y++) {

            for (let x = 0; x < width; x++) {

                noiseMap[y][x] /= totalAmplitude;
            }
        }

        return noiseMap;
    }

    //gen a interpol value noise
    generateValueNoise(scaleX, scaleY) {

        const width = this.model.mapWidth;
        const height = this.model.mapHeight;

        const lattice = [];

        //create random ctrl points
        for (let y = 0; y <= scaleY; y++) {

            const row = [];

            for (let x = 0; x <= scaleX; x++) {
                row.push(this.random.next());
            }

            lattice.push(row);
        }

        const noiseMap = [];

        // interpol values btwn ctrl points
        for (let y = 0; y < height; y++) {

            const row = [];

            for (let x = 0; x < width; x++) {

                const sampleX = (x / (width - 1)) * scaleX;
                const sampleY = (y / (height - 1)) * scaleY;

                const x0 = Math.floor(sampleX);
                const y0 = Math.floor(sampleY);

                const x1 = Math.min(x0 + 1, scaleX);
                const y1 = Math.min(y0 + 1, scaleY);

                const tx = this.smoothStep(
                    0,
                    1,
                    sampleX - x0
                );

                const ty = this.smoothStep(
                    0,
                    1,
                    sampleY - y0
                );

                const top = this.interpolate(
                    lattice[y0][x0],
                    lattice[y0][x1],
                    tx
                );

                const bottom = this.interpolate(
                    lattice[y1][x0],
                    lattice[y1][x1],
                    tx
                );

                row.push(
                    this.interpolate(top, bottom, ty)
                );
            }

            noiseMap.push(row);
        }

        return noiseMap;
    }

    //linear interpol
    interpolate(a, b, t) {
        return a + (b - a) * t;
    }

    //smooth interpol
    smoothStep(min, max, value) {

        const t = Math.max(
            0,
            Math.min(1, (value - min) / (max - min))
        );

        return t * t * (3 - 2 * t);
    }

    //convert noise values into trrain cells
    classifyTerrain(noiseMap, threshold) {

        const width = this.model.mapWidth;
        const height = this.model.mapHeight;

        for (let y = 0; y < height; y++) {

            for (let x = 0; x < width; x++) {

                if (noiseMap[y][x] > threshold) {
                    this.model.grid[y][x] = 0;
                } else {
                    this.model.grid[y][x] = -1;
                }
            }
        }
    }

}
