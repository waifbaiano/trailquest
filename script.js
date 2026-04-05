// Função para mostrar telas
function showScreen(id) {
    // Esconde todas
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(s => s.style.display = 'none');
    
    // Mostra a selecionada
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'flex';
        localStorage.setItem('trail_screen', id);
    }
}

// Lógica de Login
function loginAs(role) {
    if (role === 'organizador') showScreen('screen-main-menu');
    else alert("Funcionalidade de participante em breve!");
}

// Trava de Objetivos (Botão Verde)
function validateObjectives() {
    const val = document.getElementById('fixed-obj').value;
    const btn = document.getElementById('btn-config-map');
    if (parseInt(val) > 0) {
        btn.disabled = false;
        btn.classList.add('active-green');
        btn.classList.remove('btn-inactive');
    } else {
        btn.disabled = true;
        btn.classList.remove('active-green');
        btn.classList.add('btn-inactive');
    }
}

// Limpar ao Sair
function logout() {
    localStorage.clear();
    location.reload();
}

// QUANDO A PÁGINA CARREGA
window.onload = () => {
    const saved = localStorage.getItem('trail_screen');
    showScreen(saved || 'screen-start');
};
