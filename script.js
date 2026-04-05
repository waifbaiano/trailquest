function showScreen(id) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'flex';
    }
}

// Verifica se o Organizador preencheu os objetivos para o botão "acordar"
function checkObjectives() {
    const val = document.getElementById('fixed-count').value;
    const btn = document.getElementById('btn-map');
    
    if (val > 0) {
        btn.disabled = false;
        btn.classList.remove('btn-inactive');
        btn.classList.add('active-green');
    } else {
        btn.disabled = true;
        btn.classList.add('btn-inactive');
        btn.classList.remove('active-green');
    }
}

// PIN de 6 dígitos
function checkPIN(val) {
    if (val.length === 6) {
        if (val === "123456") {
            alert("Código de Trilha Aceito!");
        } else {
            alert("Código Inválido");
            document.getElementById('input-pin').value = "";
        }
    }
}

window.onload = () => {
    showScreen('screen-start');
};
