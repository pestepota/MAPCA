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
        const countryRadius = 45 + Math.pow(Math.random(),2) * 110;
        const numberOfPoints = 18;
        const frontier = this.generateCountryFrontier(centerX, centerY, countryRadius, numberOfPoints);
        const country = {frontier: frontier};
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
}