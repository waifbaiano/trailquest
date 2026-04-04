let map;
let playerMarker;
let watchId = null;

// 1. Cria o mapa visual
map = L.map('map').setView([-15.7801, -47.9292], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Adiciona 3 objetivos de teste no mapa
const objetivos = [
    { coords: [-15.7850, -47.9350], nome: "Objetivo 1" },
    { coords: [-15.7750, -47.9200], nome: "Objetivo 2" },
    { coords: [-15.7900, -47.9150], nome: "Objetivo 3" }
];

objetivos.forEach(obj => {
    L.marker(obj.coords).addTo(map).bindPopup(obj.nome);
});

// 3. Função que roda quando o GPS se mexe
function atualizarLocalizacao(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    document.getElementById('coordinates').innerText = `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`;
    document.getElementById('message').innerText = "Rastreando...";

    if (!playerMarker) {
        playerMarker = L.marker([lat, lng]).addTo(map).bindPopup("Você").openPopup();
    } else {
        playerMarker.setLatLng([lat, lng]);
    }
    map.setView([lat, lng], 16);
}

// 4. Botão para ligar o GPS
document.getElementById('start-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(atualizarLocalizacao, (err) => {
            alert("Erro no GPS: " + err.message);
        }, { enableHighAccuracy: true });
        
        document.getElementById('start-btn').innerText = "GPS Ativo";
        document.getElementById('start-btn').style.opacity = "0.7";
    }
});
