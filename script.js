let html5QrCode;

// FUNÇÃO DE NAVEGAÇÃO
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'flex';
        localStorage.setItem('currentScreen', screenId);
    }
}

// CORREÇÃO: Função que decide para onde o usuário vai
function loginAs(role) {
    if (role === 'organizador') {
        showScreen('screen-main-menu');
    } else {
        // Se for participante, abre a câmera direto
        startQRScanner();
    }
}

// VALIDAÇÃO DOS OBJETIVOS (BOTÃO ACORDA VERDE)
function validateObjectives() {
    const fixedInput = document.getElementById('fixed-obj');
    const btnConfig = document.getElementById('btn-config-map');
    const val = parseInt(fixedInput.value);

    if (val > 0) {
        btnConfig.disabled = false;
        btnConfig.classList.remove('btn-inactive');
        btnConfig.classList.add('btn-active-green');
    } else {
        btnConfig.disabled = true;
        btnConfig.classList.add('btn-inactive');
        btnConfig.classList.remove('btn-active-green');
    }
}

// CÂMERA
function startQRScanner() {
    showScreen('screen-qr-reader');
    setTimeout(() => {
        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
            { facingMode: "environment" }, 
            { fps: 10, qrbox: 250 },
            (text) => { alert("Código: " + text); stopQRScanner(); }
        ).catch(err => {
            alert("Câmera não autorizada.");
            showScreen('screen-start');
        });
    }, 300);
}

function stopQRScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode = null;
            showScreen('screen-start');
        });
    }
}

// SAIR E LIMPAR
function logout() {
    localStorage.clear();
    // Limpa campos de texto fisicamente
    document.getElementById('login-email').value = "";
    document.getElementById('login-pass').value = "";
    showScreen('screen-start');
}

window.onload = () => {
    const last = localStorage.getItem('currentScreen');
    showScreen(last || 'screen-start');
};
