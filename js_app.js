let scale = 1, posX = 0, posY = 0, markers = [], isAdd = false, dIdx = null, aIdx = null;
let isPanning = false, startM = { x: 0, y: 0 };

const $ = id => document.getElementById(id);

function showS(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    $(id).style.display = 'flex';
}

function toggleDrop() { const d = $('myDrop'); d.style.display = d.style.display === 'block' ? 'none' : 'block'; }

// --- LOGICA DE INICIALIZAÇÃO DO MAPA ---
function abrirMapa() { showS('screen-map-config'); }

function iniciarComPadrao() {
    const img = $('m-img');
    if (img.complete) setupMap(); else img.onload = setupMap;
}

$('map-upload').onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => { $('m-img').src = ev.target.result; iniciarComPadrao(); };
    reader.readAsDataURL(file);
};

function setupMap() {
    $('up-p').style.display = 'none';
    $('m-foot').style.display = 'flex';
    posX = 0; posY = 0; scale = 1;
    updateTransform();
    initInteractions();
    startGPSTracking(); // Inicia tentativa de GPS
}

function initInteractions() {
    const wrap = $('wrapper'), cont = $('map-container');

    // Zoom (Mouse & Trackpad)
    wrap.onwheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        applyZoom(delta, e.clientX, e.clientY);
    };

    // Eventos Unificados (Mouse + Touch)
    const startAction = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        if (e.target.classList.contains('marker')) return;
        isPanning = true;
        startM = { x: clientX - posX, y: clientY - posY };
    };

    const moveAction = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        if (isPanning) {
            posX = clientX - startM.x;
            posY = clientY - startM.y;
            updateTransform();
        }
        if (dIdx !== null) {
            const rect = cont.getBoundingClientRect();
            markers[dIdx].x = (clientX - rect.left) / scale;
            markers[dIdx].y = (clientY - rect.top) / scale;
            renderMarkers();
        }
    };

    wrap.addEventListener('mousedown', startAction);
    wrap.addEventListener('touchstart', startAction);
    window.addEventListener('mousemove', moveAction);
    window.addEventListener('touchmove', moveAction, {passive: false});
    window.addEventListener('mouseup', () => { isPanning = false; dIdx = null; });
    window.addEventListener('touchend', () => { isPanning = false; dIdx = null; });

    wrap.onclick = (e) => {
        if (!isAdd || e.target.classList.contains('marker') || isPanning) return;
        const rect = cont.getBoundingClientRect();
        markers.push({ x: (e.clientX - rect.left)/scale, y: (e.clientY - rect.top)/scale, name: "" });
        renderMarkers();
    };
}

function applyZoom(delta, clientX, clientY) {
    const cont = $('map-container');
    const nextScale = Math.min(Math.max(0.3, scale * delta), 5);
    const rect = cont.getBoundingClientRect();
    posX -= ((clientX - rect.left) / scale) * (nextScale - scale);
    posY -= ((clientY - rect.top) / scale) * (nextScale - scale);
    scale = nextScale;
    updateTransform();
}

function updateTransform() {
    $('map-container').style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

function renderMarkers() {
    const layer = $('m-layer'), svg = $('map-svg');
    layer.innerHTML = ""; svg.innerHTML = "";
    let pathD = "";

    markers.forEach((m, i) => {
        const d = document.createElement('div'); d.className = 'marker';
        d.style.left = m.x + "px"; d.style.top = m.y + "px"; d.innerText = i + 1;
        
        d.onmousedown = d.ontouchstart = (e) => { e.stopPropagation(); dIdx = i; };
        d.onclick = (e) => {
            e.stopPropagation(); aIdx = i;
            $('m-opts').style.display = 'block';
            $('m-opts').style.left = (e.touches ? e.touches[0].clientX : e.clientX) + 'px';
            $('m-opts').style.top = (e.touches ? e.touches[0].clientY : e.clientY) + 'px';
        };
        layer.appendChild(d);
        pathD += (i === 0 ? "M " : " L ") + m.x + " " + m.y;
    });

    if (markers.length > 1) {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", pathD); p.setAttribute("stroke", "white");
        p.setAttribute("stroke-width", "3"); p.setAttribute("fill", "none");
        p.setAttribute("stroke-dasharray", "5,5");
        svg.appendChild(p);
    }
}

// --- FUNÇÃO BASE GPS (SÓ FUNCIONA COM CALIBRAÇÃO) ---
function startGPSTracking() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(pos => {
            console.log("Lat:", pos.coords.latitude, "Lon:", pos.coords.longitude);
            // Aqui entrará o cálculo de conversão pixel/lat-lon futuramente
        }, err => console.log("Erro GPS:", err), { enableHighAccuracy: true });
    }
}

function tAdd() { isAdd = !isAdd; $('btn-add').innerText = isAdd ? "MODO ADICIONAR: ON" : "ADICIONAR PONTOS (OFF)"; $('btn-add').style.background = isAdd ? "#d32f2f" : "#2e7d32"; }
function oRen() { const n = prompt("Nome:"); if(n) markers[aIdx].name = n; renderMarkers(); }
function oDel() { markers.splice(aIdx, 1); renderMarkers(); $('m-opts').style.display='none'; }
function fMap() { $('btn-final').disabled = false; $('btn-final').className = 'btn-f'; showS('screen-main-menu'); }
