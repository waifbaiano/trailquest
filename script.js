// --- VARIÁVEIS GLOBAIS ---
let map;
let imageOverlay;
let modoMestre = false;
let pontosMarcados = [];

// --- FUNÇÃO DE NAVEGAÇÃO ---
function showScreen(screenId) {
    // Esconde todas as telas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    // Mostra a tela desejada
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'flex';
        
        // Se for a tela do mapa, precisamos dar um "refresh" no Leaflet
        if (screenId === 'screen-map-editor' && map) {
            setTimeout(() => map.invalidateSize(), 100);
        }
    }
}

// --- LOGICA DE GRUPOS (SUAS REGRAS) ---
function validateGroups() {
    const qtyGroups = parseInt(document.getElementById('qty-groups').value);
    const details = document.getElementById('group-details');
    const btnSave = document.getElementById('btn-save-groups');

    if (isNaN(qtyGroups) || qtyGroups < 2) {
        alert("Quantidade de grupos inválida! O mínimo é 2.");
        details.style.display = 'none';
        btnSave.disabled = true;
        return;
    }

    // Se for 2 ou mais, mostra os próximos campos
    details.style.display = 'block';
    btnSave.disabled = false;

    // Lógica de Líderes baseada na sua explicação:
    // A quantidade de líderes geralmente é limitada pela quantidade de grupos
    const inputLeaders = document.getElementById('qty-leaders');
    inputLeaders.placeholder = `Máximo sugerido: ${qtyGroups}`;
}

// --- LOGICA DOS OBJETIVOS ---
function startMapEditor() {
    const fixed = document.getElementById('fixed-obj').value;
    const mobile = document.getElementById('mobile-obj').value;

    if (!mobile || mobile < 1) {
        alert("A escolha de objetivos móveis é OBRIGATÓRIA!");
        return;
    }

    showScreen('screen-map-editor');
    initMapEditor();
}

// --- EDITOR DE MAPA (IMAGEM JPG) ---
function initMapEditor() {
    if (map) return; // Não recria o mapa se já existir

    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2
    });

    map.setView([0, 0], 1);

    // Upload da Imagem do Mapa
    document.getElementById('map-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const imgUrl = event.target.result;
            const img = new Image();
            img.onload = function() {
                const w = this.width;
                const h = this.height;
                const bounds = [[0, 0], [h, w]];

                if (imageOverlay) map.removeLayer(imageOverlay);
                imageOverlay = L.imageOverlay(imgUrl, bounds).addTo(map);
                map.fitBounds(bounds);
            };
            img.src = imgUrl;
        };
        reader.readAsDataURL(file);
    });

    // Clique para marcar/remover pontos (Editável)
    map.on('click', function(e) {
        const marker = L.marker(e.latlng, { draggable: true }).addTo(map);
        
        // Popup com opção de excluir (Como você pediu: 100% editável)
        const btnDelete = document.createElement('button');
        btnDelete.innerText = "Excluir Ponto";
        btnDelete.style.padding = "5px";
        btnDelete.style.background = "red";
        btnDelete.style.color = "white";
        btnDelete.style.border = "none";
        btnDelete.style.borderRadius = "3px";
        
        btnDelete.onclick = function() {
            map.removeLayer(marker);
        };

        marker.bindPopup(btnDelete).openPopup();
    });
}

function saveMap() {
    alert("Edição de mapa salva com sucesso!");
    showScreen('screen-main-menu');
}

// --- INICIALIZAÇÃO AO CARREGAR ---
window.onload = () => {
    showScreen('screen-start');
};
