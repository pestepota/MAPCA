export class MapModel {
    constructor(width = 50, height = 50) {
        this.width = width;
        this.height = height;
        this.seed = Math.random().toString(36.substring(2, 9));
        this.grid = [];
    }

    // Lógica para gerar o mapa proceduralmente
    generateMap(settings = {}) {
        // Exemplo simples de preenchimento da matriz do mapa
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                // Exemplo básico: escolhe aleatoriamente entre Água, Terra e Montanha
                const rand = Math.random();
                let tile = 'L'; // Land (Terra)
                if (rand < 0.3) tile = 'W'; // Water (Água)
                else if (rand > 0.85) tile = 'M'; // Mountain (Montanha)
                
                row.push(tile);
            }
            this.grid.push(row);
        }
        return this.grid;
    }

    getMapData() {
        return {
            width: this.width,
            height: this.height,
            seed: this.seed,
            grid: this.grid
        };
    }
}