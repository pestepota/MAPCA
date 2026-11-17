export class MapModel {

    constructor(width, height) {
        //dimensions
        this.mapWidth = width
        this.mapHeight = height

        //countries
        this.countries = []

        //grid
        this.grid = []
        this.generateGrid();
    }

    //add a country
    addCountry(country) {
        this.countries.push(country);
    }

    //grid generator
    generateGrid() {
        this.grid= []

        for (let y=0; y < this.mapHeight; y++) {
            const row = [];

            for (let x = 0; x < this.mapWidth; x++) {
                row.push(0)
            }

            this.grid.push(row);
        }
    }
}