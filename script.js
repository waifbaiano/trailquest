let html5QrCode;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(screenId);
    if (target) target.style.display = 'flex';
}

function startQRScanner() {
    showScreen('screen-qr-reader');
    html5QrCode = new Html5Qrcode("reader");
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrCode.start(
        { facingMode: "environment" }, 
        config, 
        (decodedText) => {
            alert("Mapa de Participante Carregado: " + decodedText);
            stopQRScanner();
        }
    ).catch(err => {
        alert("Erro na Câmera: Certifique-se de dar permissão.");
        showScreen('screen-start');
    });
}

function stopQRScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => showScreen('screen-start'));
    }
}

// Inicia na tela inicial
window.onload = () => showScreen('screen-start');
