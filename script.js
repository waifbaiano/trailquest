let html5QrCode;
let map, imageOverlay, markers = [], maxPoints = 0;

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    target.style.display = 'flex';
    localStorage.setItem('currentScreen', id);
}

// CÂMERA (QR CODE)
async function startQRScanner() {
    showScreen('screen-qr-reader');
    
    // Pequeno delay para o navegador processar a troca de tela
    setTimeout(async () => {
        try {
            html5QrCode = new Html5Qrcode("reader");
            await html5QrCode.start(
                { facingMode: "environment" }, 
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    alert("Acesso Autorizado: " + decodedText);
                    stopQRScanner();
                }
            );
        } catch (err) {
            alert("Erro na Câmera: Verifique se deu permissão no navegador.");
            showScreen('screen-start');
        }
    }, 500);
}

function stopQRScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode = null;
            showScreen('screen-start');
        });
    }
}

function loginAs(role) {
    if (role === 'organizador') showScreen('screen-main-menu');
    else startQRScanner();
}

// LOGICA GRUPOS
function validateGroups() {
    const qty = parseInt(document.getElementById('qty-groups').value);
    const box = document.getElementById('group-logic');
    const btn = document.getElementById('btn-save-groups');
    
    if (qty >= 2) {
        box.style.display = 'block';
        btn.disabled = false;
        btn.classList.add('active-green');
        document.getElementById('label-leaders').innerText = `Líderes (Máx ${qty}):`;
    } else {
        box.style.display = 'none';
        btn.disabled = true;
        btn.classList.remove('active-green');
    }
}

// OBJETIVOS
function validateObjectives() {
    const val = parseInt(document.getElementById('fixed-obj').value);
    const btn = document.getElementById('btn-config-map');
    maxPoints = val;
    if (val > 0) {
        btn.disabled = false;
        btn.classList.add('active-green');
    } else {
        btn.disabled = true;
        btn.classList.remove('active-green');
    }
}

// MAPA
function startMapEditor() {
    showScreen('screen-map-editor');
    if (!map) {
        map = L.map('map', { crs: L.CRS.Simple, minZoom: -2 });
        map.on('click', (e) => {
            if (markers.length < maxPoints) {
                const m = L.marker(e.latlng, {draggable: true}).addTo(map);
                markers.push(m);
                document.getElementById('obj-counter').innerText = `${markers.length}/${maxPoints}`;
            }
        });
    }
}

function saveMap() {
    localStorage.setItem('mapReady', 'true');
    showScreen('screen-main-menu');
    document.getElementById('btn-proceed').disabled = false;
    document.getElementById('btn-proceed').classList.add('active-green');
}

function logout() {
    localStorage.clear();
    location.reload();
}

window.onload = () => {
    const last = localStorage.getItem('currentScreen');
    showScreen(last || 'screen-start');
};
