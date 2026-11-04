import { MapModel } from '../model/MapModel.js';
import { MapView } from '../view/MapView.js';

export class MapController {
    constructor() {
        this.model = new MapModel(40, 40); // Mapa 40x40 padrão
        this.view = new MapView('map-container'); // Elemento onde o mapa vai aparecer

        this.init();
    }

    init() {
        // Configura os ouvintes de eventos da interface
        this.view.bindGenerateButton(() => this.handleGenerateMap());
        
        // Gera um mapa inicial ao carregar a página
        this.handleGenerateMap();
    }

    handleGenerateMap() {
        // 1. Pede pro Model gerar os dados novos
        const newGrid = this.model.generateMap();
        
        // 2. Pede pra View atualizar a tela com os novos dados
        this.view.renderMap(newGrid);
    }
}