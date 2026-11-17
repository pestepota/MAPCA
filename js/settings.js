const SETTINGS_KEY = "mapca_settings";

export function getSettings() {
    return JSON.parse(
        localStorage.getItem(SETTINGS_KEY) || JSON.stringify({
            mainColor: "#02c802",
            bgColor: "#001200"
        })
    );
}

export function saveSettings(mainColor, bgColor) {
    const settings = {mainColor, bgColor}
    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );
    applySettings();
}

export function applySettings() {
    const settings = getSettings();
    document.documentElement.style.setProperty(
        "--text",
        settings.mainColor
    );
    document.documentElement.style.setProperty(
    "--bg",
    settings.bgColor
    );

    return settings;
}
