import { MapModel } from './controller/MapModel.js';
import { MapView } from './view/MapView.js';

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

export class MapView {
    constructor(containerElementId) {
        this.container = document.getElementById(containerElementId);
    }

    // Renderiza o mapa em formato de grid HTML ou Canvas
    renderMap(grid) {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        
        // Criando uma tabela ou elementos visuais para o grid
        const table = document.createElement('table');
        table.classList.add('map-grid');

        grid.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.classList.add('map-tile', `tile-${cell.toLowerCase()}`);
                td.textContent = cell; // Exibe a letra ou pode ser estilizado com CSS
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        this.container.appendChild(table);
    }

    bindGenerateButton(handler) {
        const btn = document.getElementById('generate-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                handler();
            });
        }
    }
}