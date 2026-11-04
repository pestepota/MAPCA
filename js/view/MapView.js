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