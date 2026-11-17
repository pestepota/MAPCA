import { MapView } from "./MapView.js";
import { MapModel } from "./MapModel.js";
import { TerrainGenerator } from "./terrainGenerator.js";
import { Random } from "./random.js";
import { TerrainAnalyzer } from "./terrainAnalyz.js";

//HTML
const countryMode = document.getElementById("country-mode");
const automaticConfig = document.getElementById("automatic-config");
const manualConfig = document.getElementById("manual-config");

console.log(countryMode);

countryMode.addEventListener("change", () => {
    const isAutomatic = countryMode.value === "automatic";
    automaticConfig.hidden = !isAutomatic;
    manualConfig.hidden = isAutomatic;
});

const canvas = document.getElementById("mapCanvas");
const model = new MapModel(100, 100);
const view = new MapView(canvas, model);
const random = new Random("mapca1")
const terrainGenerator = new TerrainGenerator(model, random)

terrainGenerator.generate("continents");
const terrainAnalyz = new TerrainAnalyzer(model);
const landmasses = terrainAnalyz.analyzeLandmasses();

console.table(
    landmasses.map(landmass => ({
        id: landmass.id,
        size: landmass.size,
        minX: landmass.bounds.minX,
        maxX: landmass.bounds.maxX,
        minY: landmass.bounds.minY,
        maxY: landmass.bounds.maxY}))    
);

view.drawTerrain();
//view.generateCountry(200,200);
//console.log(model.countries);

//view.drawTestMap();

console.log(model.grid.length);
console.log(model.grid[0].length);
console.log(model.grid[10][20]);


