let html5QrCode;
let map, imageOverlay, markers = [], maxPoints = 0;

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
    localStorage.setItem('lastScreen', id);
}

// CÂMERA COM PERMISSÃO FORÇADA
function startQRScanner() {
    showScreen('screen-qr-reader');
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, 
        (text) => { alert("Lido: " + text); stopQRScanner(); },
        (err) => { console.log("Aguardando câmera..."); }
    );
}

function stopQRScanner() {
    if(html5QrCode) html5QrCode.stop().then(() => showScreen('screen-start'));
}

// LÓGICA DE GRUPOS
function validateGroups() {
    const qty = parseInt(document.getElementById('qty-groups').value);
    const logicDiv = document.getElementById('group-logic');
    const btn = document.getElementById('btn-save-groups');

    if (qty >= 2) {
        logicDiv.style.display = 'block';
        btn.disabled = false;
        btn.classList.add('active-green');
        document.getElementById('label-leaders').innerText = `Qtd. Líderes (Máx: ${qty}):`;
    } else {
        logicDiv.style.display = 'none';
        btn.disabled = true;
        btn.classList.remove('active-green');
    }
}

// OBJETIVOS E MAPA
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

function startMapEditor() {
    showScreen('screen-map-editor');
    if (!map) {
        map = L.map('map', { crs: L.CRS.Simple });
        map.on('click', (e) => {
            if (markers.length < maxPoints) {
                const m = L.marker(e.latlng, {draggable:true}).addTo(map);
                markers.push(m);
                document.getElementById('obj-counter').innerText = `${markers.length} / ${maxPoints}`;
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

window.onload = () => showScreen(localStorage.getItem('lastScreen') || 'screen-start');
