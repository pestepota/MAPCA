import { getSettings } from "./settings.js";

export class MapView {


    constructor(canvas, model) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.model = model;

        this.resize();
    }

    //resize the map
    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    //test a rt map
    drawTestMap() {
        const ctx = this.context;

        //clear the canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //background
        ctx.fillStyle = "#001200";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


        //test country
        for (const country of this.model.countries) {
            this.drawCountry(country.frontier)
        }
    }

    //country generator
    generateCountry(centerX, centerY) {
        const countryRadius = 45 + Math.pow(Math.random(), 2) * 110;
        const numberOfPoints = 18;
        const frontier = this.generateCountryFrontier(centerX, centerY, countryRadius, numberOfPoints);
        const country = { frontier: frontier };
        this.model.addCountry(country);
        return country
    }

    //generate the country's center and points
    generateCountryFrontier(centerX, centerY, radius, numberOfPoints) {
        const angleStep = (2 * Math.PI) / numberOfPoints;
        const points = [];
        for (let i = 0; i < numberOfPoints; i++) {
            const angle = i * angleStep;
            const randomRadius = radius * (0.8 + Math.random() * 0.4);
            const x = centerX + randomRadius * Math.cos(angle);
            const y = centerY + randomRadius * Math.sin(angle);
            points.push({ x, y });
        }
        return points
    }

    //draw the country
    drawCountry(points) {
        const ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y)
        }

        ctx.closePath();
        ctx.fillStyle = "#001200";
        ctx.fill();
        ctx.strokeStyle = "#02c802";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    drawTerrain() {
        const settings = getSettings();

        const width = this.canvas.width;
        const height = this.canvas.height;

        const gridWidth = this.model.mapWidth;
        const gridHeight = this.model.mapHeight;

        const cellWidth = width / gridWidth;
        const cellHeight = height / gridHeight;

        this.context.fillStyle = settings.bgColor
        this.context.fillRect(0, 0, width, height);

        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                if (this.model.grid[y][x] >= 0) {
                    this.context.fillStyle = settings.mainColor;

                    this.context.fillRect(x * cellWidth, y * cellHeight, Math.ceil(cellWidth) + 1, Math.ceil(cellHeight) + 1);
                }
            }
        }
    }


    drawBorders() {
        const settings = getSettings();

        const grid = this.model.grid;
        const width = this.model.mapWidth;
        const height = this.model.mapHeight;

        const cellWidth = this.canvas.width / width;
        const cellHeight = this.canvas.height / height;

        const ctx = this.context;

        const variation = (x, y, axis) => {
            const value = Math.sin(x * 127.1 + y * 311.7 + axis * 74.7) * 43758;
            return (value - Math.floor(value))* 2-1;
        } 

        ctx.beginPath();
        ctx.strokeStyle = settings.bgColor;
        ctx.lineWidth = 1.5;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const country = grid[y][x];
                if (country <= 0) continue;
                if (
                    x < width - 1 &&
                    grid[y][x + 1] > 0 &&
                    grid[y][x + 1] !== country
                ) {
                    ctx.moveTo((x + 1) * cellWidth, y * cellHeight);
                    ctx.lineTo((x + 1) * cellWidth, (y + 1) * cellHeight);
                }
                if (
                    y < height - 1 &&
                    grid[y + 1][x] > 0 &&
                    grid[y + 1][x] !== country
                ) {
                    ctx.moveTo(x * cellWidth, (y + 1) * cellHeight);
                    ctx.lineTo((x + 1) * cellWidth, (y + 1) * cellHeight);
                }
            }
        }
        ctx.stroke();
    }

    drawCountryNames() {
        const settings = getSettings();

        const ctx = this.context;

        const cellWidth = this.canvas.width / this.model.mapWidth;
        const cellHeight = this.canvas.height / this.model.mapHeight;

        ctx.save();
        ctx.fillStyle = settings.bgColor;
        ctx.strokeStyle = settings.mainColor;
        ctx.lineWidth = 0.5;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 14px digitalClock";

        for (const country of this.model.countries) {
            let totalX = 0;
            let totalY = 0;
            let count = 0;

            for (let y = 0; y < this.model.mapHeight; y++) {
                for (let x = 0; x < this.model.mapWidth; x++) {
                    if (this.model.grid[y][x] === country.id) {
                        totalX += x;
                        totalY += y;
                        count++;
                    }
                }
            }

            if (count === 0) continue;

            const centerX = (totalX / count + 0.5) * cellWidth;
            const centerY = (totalY / count + 0.5) * cellHeight;

            ctx.strokeText(country.name, centerX, centerY);
            ctx.fillText(country.name, centerX, centerY);
        }

        ctx.restore();
    }
}