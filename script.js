let map;
let playerMarker;
let imageOverlay;
let nickname = "";
let modoMestre = false;

// 1. ESCUTAR O CLIQUE NO BOTÃO DE ENTRAR
document.getElementById('enter-btn').addEventListener('click', function() {
    nickname = document.getElementById('nickname').value.trim();
    
    if (nickname.length < 3) {
        alert("Escolha um codinome com pelo menos 3 letras!");
        return;
    }

    // SEGREDO: Se escrever MESTRE, liberas ferramentas de upload
    if (nickname.toUpperCase() === "MESTRE") {
        modoMestre = true;
        document.getElementById('admin-tools').style.display = 'block';
        alert("Modo Mestre Ativado! Podes carregar o teu mapa JPG.");
    }

    // Trocar de ecrã (Login -> Jogo)
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    document.getElementById('player-display').innerText = `Explorador: ${nickname}`;

    // Iniciar o mapa base
    initMap();
});

// 2. INICIALIZAR O MAPA (MODO SIMPLES PARA IMAGEM)
function initMap() {
    // Usamos L.CRS.Simple para que o mapa entenda pixels em vez de coordenadas globais
    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2
    });

    // Definir um ponto inicial vazio
    map.setView([0, 0], 1);

    // CONFIGURAR O UPLOAD DE IMAGEM
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
                const bounds = [[0, 0], [h, w]]; // Define os limites pelo tamanho da imagem

                // Se já existir um mapa, removemos para colocar o novo
                if (imageOverlay) map.removeLayer(imageOverlay);
                
                imageOverlay = L.imageOverlay(imgUrl, bounds).addTo(map);
                map.fitBounds(bounds);
                
                document.getElementById('message').innerText = "Mapa carregado com sucesso!";
            };
            img.src = imgUrl;
        };
        reader.readAsDataURL(file);
    });

    // 3. CLIQUE NO MAPA PARA MARCAR PONTOS (SÓ PARA O MESTRE)
    map.on('click', function(e) {
        if (modoMestre) {
            const y = e.latlng.lat.toFixed(0);
            const x = e.latlng.lng.toFixed(0);
            
            // Criar um marcador onde clicaste
            L.marker(e.latlng).addTo(map)
                .bindPopup(`<b>Ponto de Interesse</b><br>Coordenadas na Imagem:<br>X: ${x} | Y: ${y}`)
                .openPopup();
            
            document.getElementById('coordinates').innerText = `Ponto Marcado: X ${x}, Y ${y}`;
        }
    });
}
