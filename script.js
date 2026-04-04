let html5QrCode;
let maxFixedPoints = 0;
let currentPoints = 0;
let markers = [];

// Iniciar Câmera do Participante
function startQRScanner() {
    showScreen('screen-qr-reader');
    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
        alert("Código detectado: " + decodedText);
        stopQRScanner();
    }).catch(err => alert("Erro ao acessar câmera: " + err));
}

function stopQRScanner() {
    if(html5QrCode) {
        html5QrCode.stop().then(() => showScreen('screen-start'));
    }
}

// Login Diferenciado
function loginAs(role) {
    if (role === 'organizador') {
        showScreen('screen-main-menu');
    } else {
        startQRScanner();
    }
}

// Validação de Objetivos Fixos (Obrigatórios)
function validateObjectives() {
    const fixedInput = document.getElementById('fixed-obj');
    const btnConfig = document.getElementById('btn-config-map');
    
    maxFixedPoints = parseInt(fixedInput.value);

    if (maxFixedPoints > 0) {
        btnConfig.disabled = false;
        btnConfig.classList.remove('btn-inactive');
        btnConfig.classList.add('btn-active-red');
    } else {
        btnConfig.disabled = true;
        btnConfig.classList.remove('btn-active-red');
        btnConfig.classList.add('btn-inactive');
    }
}

// Editor de Mapa com Limite de Pontos
function initMapEditor() {
    // ... (mesma base anterior) ...
    map.on('click', function(e) {
        if (markers.length < maxFixedPoints) {
            const marker = L.marker(e.latlng, { draggable: true }).addTo(map);
            markers.push(marker);
            updateCounter();
            
            marker.on('click', () => {
                map.removeLayer(marker);
                markers = markers.filter(m => m !== marker);
                updateCounter();
            });
        } else {
            alert(`Limite de ${maxFixedPoints} objetivos atingido!`);
        }
    });
}

function updateCounter() {
    document.getElementById('obj-counter').innerText = `Pontos: ${markers.length} / ${maxFixedPoints}`;
}
