import { MapView } from "./MapView.js";
import { MapModel } from "./MapModel.js";
import { TerrainGenerator } from "./terrainGenerator.js";
import { Random } from "./random.js";
import { TerrainAnalyzer } from "./terrainAnalyz.js";
import { PoliticalGenerator } from "./politicalGenerator.js";
import { applySettings } from "./settings.js";

applySettings();

//html
const canvas = document.getElementById("mapCanvas");
const countryMode = document.getElementById("country-mode");
const automaticConfig = document.getElementById("automatic-config");
const terrainType = document.getElementById("terrain-type");
const manualConfig = document.getElementById("manual-config");
const countryCount = document.getElementById("country-count");
const genButton = document.getElementById("generate-btn");
const seedInput = document.getElementById("map-seed");
const mapSize = document.getElementById("map-size");
const saveButton = document.getElementById("save-map-btn");


//mvc
const model = new MapModel(100, 100);
const view = new MapView(canvas, model);

//country config
countryMode.addEventListener("change", () => {
    const isAutomatic = countryMode.value === "automatic";
    automaticConfig.hidden = !isAutomatic;
    manualConfig.hidden = isAutomatic;
});
let currentMapData = null;

//mapgen
function generateMap() {
    currentMapData = null;
    saveButton.disabled = true;
    const seed = crypto.randomUUID();
    seedInput.value = seed
    const random = new Random(seed);

    //map dim
    const dimensions = {
        small: 50,
        medium: 100,
        large: 200
    };
    const size = dimensions[mapSize.value];
    model.mapWidth = size;
    model.mapHeight = size;
    model.generateGrid();
    model.countries = [];

    const terrainGenerator = new TerrainGenerator(model, random);
    terrainGenerator.generate(terrainType.value);

    const terrainAnalyzer = new TerrainAnalyzer(model);
    terrainAnalyzer.removeSmallLandmasses(50);

    if (countryMode.value === "manual") {
        alert("Manual country generation is not implemented yet!");
        return
    }

    const totalCountries = Math.max(1, Math.floor(Number(countryCount.value) || 1));
    const politicalGenerator = new PoliticalGenerator(
        model,
        terrainAnalyzer,
        random
    );
    politicalGenerator.generate(totalCountries);

    currentMapData = {
        seed: seed,
        size: size,
        terrain: terrainType.value,
        grid: model.grid,
        countries: model.countries,
    };
    saveButton.disabled = false;

    //rendering
    view.resize();
    view.drawTerrain();
    view.drawBorders();
    view.drawCountryNames();

    //console
    console.log("Seed:", seed);
    console.log("Map Size:", size);
    console.log("terrain", terrainType.value);
    console.log("Países:", model.countries);
}

function saveMap() {
    if (!currentMapData) return;
    const savedMaps = JSON.parse(localStorage.getItem("mapca_saved_maps") || "[]")
    const mapData = {
        id: crypto.randomUUID(),
        name: `Map_${String(savedMaps.length + 1).padStart(3, "0")}.map`,
        savedAt: new Date().toISOString(),
        ...currentMapData
    };
    savedMaps.push(mapData);
    localStorage.setItem("mapca_saved_maps", JSON.stringify(savedMaps));
    alert("Map Saved")
}

genButton.addEventListener("click", generateMap);
saveButton.addEventListener("click", saveMap);
generateMap();