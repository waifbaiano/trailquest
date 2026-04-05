let markers = [];
let maxFixedPoints = 0;

// Função Navegação
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'flex';
        localStorage.setItem('currentScreen', screenId);
    }
}

// VALIDAÇÃO EXCLUSIVA DO MENU DE OBJETIVOS
function validateObjectives() {
    const fixedInput = document.getElementById('fixed-obj');
    const btnConfig = document.getElementById('btn-config-map');
    
    maxFixedPoints = parseInt(fixedInput.value);

    // Regra: Se preencheu os fixos, o botão "acorda" em VERDE
    if (maxFixedPoints > 0) {
        btnConfig.disabled = false;
        btnConfig.classList.remove('btn-inactive');
        btnConfig.classList.add('active-green');
    } else {
        btnConfig.disabled = true;
        btnConfig.classList.add('btn-inactive');
        btnConfig.classList.remove('active-green');
    }
}

// SALVAR MAPA E LIBERAR PROSSEGUIR
function saveMap() {
    if (markers.length < maxFixedPoints) {
        alert(`Atenção Mestre: Você definiu ${maxFixedPoints} pontos, mas só marcou ${markers.length}. Complete a marcação!`);
        return;
    }
    
    alert("Mapa da trilha configurado com sucesso!");
    localStorage.setItem('mapReady', 'true');
    showScreen('screen-main-menu');
    checkMasterButton();
}

// Botão "Prosseguir" no Menu Principal também acorda verde
function checkMasterButton() {
    const isReady = localStorage.getItem('mapReady') === 'true';
    const btnProceed = document.getElementById('btn-proceed');
    
    if (isReady && btnProceed) {
        btnProceed.disabled = false;
        btnProceed.classList.remove('locked');
        btnProceed.classList.add('active-green');
    }
}

// Limpeza de campos ao voltar
function logout() {
    localStorage.clear();
    location.reload(); // Recarrega para limpar tudo
}

window.onload = () => {
    const last = localStorage.getItem('currentScreen');
    showScreen(last || 'screen-start');
    checkMasterButton();
};
