import { MapView } from "./MapView.js";
import { MapModel } from "./MapModel.js";

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
const model = new MapModel(800, 600);
const view = new MapView(canvas, model);

view.generateCountry(200,200);
console.log(model.countries);

view.drawTestMap();


