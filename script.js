let mapImage = new Image();
let markers = [];
let maxMarkers = 0;

// --- LÓGICA DE GRUPOS ---
function checkGroups() {
    const qty = document.getElementById('group-qty').value;
    const container = document.getElementById('groups-setup-area');
    const list = document.getElementById('groups-inputs-list');
    const btn = document.getElementById('btn-save-groups');

    if (qty > 1) {
        container.style.display = 'block';
        btn.disabled = false;
        btn.classList.add('active-green');
        
        // Gera os inputs de nomes automaticamente
        list.innerHTML = "";
        for(let i=1; i<=qty; i++) {
            list.innerHTML += `<input type="text" placeholder="Equipe ${i}" class="group-name-input" style="padding: 8px; font-size: 0.9rem;">`;
        }
    } else {
        container.style.display = 'none';
        btn.disabled = true;
        btn.classList.remove('active-green');
    }
}

// --- LÓGICA DO MAPA ---
function handleMapUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    maxMarkers = parseInt(document.getElementById('fixed-count').value) || 0;
    document.getElementById('points-needed').innerText = maxMarkers;

    reader.onload = function(e) {
        mapImage.src = e.target.result;
        mapImage.onload = function() {
            document.getElementById('upload-area').style.display = 'none';
            document.getElementById('editor-container').style.display = 'block';
            drawCanvas();
        }
    }
    reader.readAsDataURL(file);
}

function drawCanvas() {
    const canvas = document.getElementById('map-canvas');
    const ctx = canvas.getContext('2d');
    
    // Ajusta o tamanho interno do canvas para a imagem
    canvas.width = mapImage.width;
    canvas.height = mapImage.height;
    
    ctx.drawImage(mapImage, 0, 0);
    
    // Desenha os pontos já marcados
    markers.forEach((p, index) => {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(p.x, p.y, canvas.width * 0.02, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText(index + 1, p.x - 5, p.y + 5);
    });
}

// Clique no Canvas para marcar pontos
document.getElementById('map-canvas').addEventListener('click', function(e) {
    if (markers.length >= maxMarkers) return;

    const rect = this.getBoundingClientRect();
    const scaleX = this.width / rect.width;
    const scaleY = this.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    markers.push({x, y});
    drawCanvas();

    if (markers.length === maxMarkers) {
        const btn = document.getElementById('btn-save-map');
        btn.disabled = false;
        btn.classList.add('active-green');
    }
});

function saveMapPoints() {
    alert(markers.length + " pontos salvos com sucesso!");
    showScreen('screen-main-menu');
}
