import { applySettings } from "./settings.js";

applySettings();

const mapGrid = document.querySelector(".map-grid");

function getSavedMaps() {
    return JSON.parse(localStorage.getItem("mapca_saved_maps")||"[]");
}

function renderSavedMaps() {
    const savedMaps = getSavedMaps ();
    mapGrid.innerHTML = "";
    if (savedMaps.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No saved maps yet.";
        mapGrid.appendChild(message);
        return;
    }

    savedMaps.forEach((map) => {
        const card = document.createElement("div");
        card.className = "map-card";

        const title = document.createElement("h3");
        title.textContent = map.name;

        const info = document.createElement("p");
        info.style.fontSize = "small";
        info.textContent =
            `Size: ${map.size}x${map.size} | Countries: ${map.countries.length}`;

        const seed = document.createElement("p");
        seed.style.fontSize = "medium";
        seed.textContent = `Seed: ${map.seed}`;

        const actions = document.createElement("div");
        actions.className = "map-card-actions";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteMap(map.id);
        });

        actions.appendChild(deleteButton);

        card.append(title, info, seed, actions);
        mapGrid.appendChild(card);
    });
}

function deleteMap(id) {
    const savedMaps = getSavedMaps();

    const updatedMaps = savedMaps.filter(
        map => map.id !== id
    );

    localStorage.setItem(
        "mapca_saved_maps",
        JSON.stringify(updatedMaps)
    );

    renderSavedMaps();
}

renderSavedMaps();
