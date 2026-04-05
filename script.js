let html5QrCode;
let map;
let imageOverlay;
let markers = [];
let maxFixedPoints = 0;

// --- FUNÇÃO DE NAVEGAÇÃO COM MEMÓRIA ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'flex';
        // SALVA NA MEMÓRIA: Qual tela o usuário parou
        localStorage.setItem('currentScreen', screenId);
    }
}

// --- RECUPERAÇÃO AUTOMÁTICA AO RECARREGAR ---
window.onload = () => {
    const lastScreen = localStorage.getItem('currentScreen');
    
    // Se o usuário já estava em uma tela, volta para ela (exceto se for o início)
    if (lastScreen && lastScreen !== 'screen-start') {
        showScreen(lastScreen);
        // Se parou no mapa, reinicia o motor do mapa
        if(lastScreen === 'screen-map-editor') initMapEditor();
    } else {
        showScreen('screen-start');
    }
};

// --- LÓGICA DE LOGIN ---
function loginAs(role) {
    if (role === 'organizador') {
        showScreen('screen-main-menu');
    } else {
        startQRScanner(); // Participante logado também vai para a câmera
    }
}

// --- CÂMERA (PARTICIPANTE) ---
function startQRScanner() {
    showScreen('screen-qr-reader');
    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
        alert("Acesso Confirmado!");
        stopQRScanner();
    }).catch(err => {
        alert("Câmera bloqueada ou erro de permissão.");
        showScreen('screen-start');
    });
}

function stopQRScanner() {
    if(html5QrCode) {
        html5QrCode.stop().then(() => showScreen('screen-start'));
    }
}

// --- MAPA E PONTOS (TRAVAS DE SEGURANÇA) ---
function initMapEditor() {
    if (map) return;
    map = L.map('map', { crs: L.CRS.Simple, minZoom: -2 });
    map.setView([0, 0], 1);

    // Upload de Imagem
    document.getElementById('map-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = function() {
                const bounds = [[0, 0], [this.height, this.width]];
                if (imageOverlay) map.removeLayer(imageOverlay);
                imageOverlay = L.imageOverlay(ev.target.result, bounds).addTo(map);
                map.fitBounds(bounds);
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Clique para marcar com limite de Objetivos Fixos
    map.on('click', (e) => {
        if (markers.length < maxFixedPoints) {
            const m = L.marker(e.latlng, {draggable: true}).addTo(map);
            markers.push(m);
            m.on('click', () => { map.removeLayer(m); markers = markers.filter(x => x !== m); });
        } else {
            alert(`Você só pode marcar ${maxFixedPoints} pontos fixos!`);
        }
    });
}

// Botão SAIR (Limpa a memória para começar do zero)
function logout() {
    localStorage.clear();
    showScreen('screen-start');
}
