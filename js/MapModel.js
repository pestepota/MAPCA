export class MapModel {

    constructor(width, height) {
        //dimensions
        this.mapWidth = width
        this.mapHeight = height

        //countries
        this.countries = []
    }

    //add a country
    addCountry(country) {
        this.countries.push(country);
    }
}