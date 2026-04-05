function showScreen(id) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'flex';
    }
}

// Limpeza de campos de Login
function sairLogin() {
    document.getElementById('login-email').value = "";
    document.getElementById('login-pass').value = "";
    showScreen('screen-start');
}

function loginMestre() {
    // Ao entrar com sucesso, também limpamos para segurança
    const email = document.getElementById('login-email').value;
    if(email.length > 0) {
        document.getElementById('login-email').value = "";
        document.getElementById('login-pass').value = "";
        showScreen('screen-main-menu');
    } else {
        alert("Preencha o e-mail");
    }
}

// Validação Objetivos (O botão "acorda" apenas com o Fixo preenchido)
function checkObjectives() {
    const fixed = document.getElementById('fixed-count').value;
    const btn = document.getElementById('btn-map');
    
    if (fixed > 0) {
        btn.disabled = false;
        btn.classList.remove('btn-inactive');
        btn.classList.add('active-green');
    } else {
        btn.disabled = true;
        btn.classList.add('btn-inactive');
        btn.classList.remove('active-green');
    }
}

// Validação Grupos
function checkGroups() {
    const qty = document.getElementById('group-qty').value;
    const btn = document.getElementById('btn-save-groups');
    
    if (qty > 1) {
        btn.disabled = false;
        btn.classList.remove('btn-inactive');
        btn.classList.add('active-green');
    } else {
        btn.disabled = true;
        btn.classList.add('btn-inactive');
        btn.classList.remove('active-green');
    }
}

function checkPIN(val) {
    if (val.length === 6) {
        if (val === "123456") {
            alert("Sucesso!");
        } else {
            alert("Código Errado");
            document.getElementById('input-pin').value = "";
        }
    }
}

window.onload = () => {
    showScreen('screen-start');
};
