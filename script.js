function showScreen(id) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'flex';
        
        // Reset de campos ao entrar nas telas
        if (id === 'screen-pin-entry') document.getElementById('input-pin').value = "";
    }
}

// Lógica de Login
function loginAs(role) {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    if (email.trim() === "" || pass.trim() === "") {
        alert("Preencha as credenciais de Mestre.");
        return;
    }
    showScreen('screen-main-menu');
}

// Validação do PIN de 6 Dígitos
function validatePIN() {
    const pin = document.getElementById('input-pin').value;
    const PIN_CORRETO = "654321"; // Exemplo de PIN para teste

    if (pin.length !== 6) {
        alert("O código deve ter exatamente 6 dígitos.");
        return;
    }

    if (pin === PIN_CORRETO) {
        alert("Acesso Autorizado! Localizando equipe...");
        // Futuro: showScreen('screen-player-map');
    } else {
        alert("Código inválido.");
        document.getElementById('input-pin').value = "";
    }
}

window.onload = () => {
    showScreen('screen-start');
};
