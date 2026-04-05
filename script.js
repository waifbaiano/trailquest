let html5QrCode;

// Função Navegação
function showScreen(id) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'flex';
        // Limpa campos ao voltar para telas iniciais
        if (id === 'screen-start' || id === 'screen-login') {
            const email = document.getElementById('login-email');
            const pass = document.getElementById('login-pass');
            if(email) email.value = "";
            if(pass) pass.value = "";
        }
    }
}

// Lógica de Login
function loginAs(role) {
    const email = document.getElementById('login-email').value;
    if (email.trim() === "") {
        alert("Digite seu e-mail de explorador.");
        return;
    }
    showScreen('screen-main-menu');
}

// Lógica da Câmera (QR Code)
async function startQRScanner() {
    showScreen('screen-qr-reader');
    
    // Delay para garantir que a div "reader" está pronta
    setTimeout(async () => {
        try {
            html5QrCode = new Html5Qrcode("reader");
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };
            
            await html5QrCode.start(
                { facingMode: "environment" }, 
                config,
                (decodedText) => {
                    alert("Código encontrado: " + decodedText);
                    stopQRScanner();
                }
            );
        } catch (err) {
            alert("Câmera não disponível. Verifique as permissões do navegador.");
            showScreen('screen-start');
        }
    }, 500);
}

function stopQRScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode = null;
            showScreen('screen-start');
        }).catch(() => showScreen('screen-start'));
    }
}

// Inicia na tela inicial
window.onload = () => {
    showScreen('screen-start');
};
