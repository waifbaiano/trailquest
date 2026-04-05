const App = {
    container: document.getElementById('app'),

    // --- TEMPLATES DAS TELAS ---
    telas: {
        inicio: () => `
            <div class="cenario floresta-aberta">
                <div class="painel-vintage">
                    <h1>TrailQuest</h1>
                    <button class="btn-vintage" onclick="App.irPara('login')">Fazer Login</button>
                    <button class="btn-vintage" onclick="App.solicitarCodigo()">Continuar como Participante</button>
                </div>
            </div>`,
        
        login: () => `
            <div class="cenario floresta-aberta">
                <div class="painel-vintage">
                    <h2>Bem-vindos</h2>
                    <input type="email" placeholder="E-mail">
                    <input type="password" id="pass" placeholder="Senha">
                    <span class="olhinho" onclick="App.toggleVerSenha()">👁️</span>
                    <button class="btn-vintage" onclick="App.irPara('menuInicial')">Entrar</button>
                </div>
            </div>`,

        menuInicial: () => `
            <div class="cenario floresta-fechada">
                <div class="painel-vintage">
                    <button class="btn-vintage" onclick="App.irPara('mestre')">Organizador</button>
                    <button class="btn-vintage" onclick="App.solicitarCodigo()">Participante</button>
                </div>
            </div>`,

        mestre: () => `
            <div class="cenario floresta-fechada">
                <div class="painel-vintage">
                    <h2>Mestre</h2>
                    <button class="btn-vintage" onclick="App.irPara('percursos')">Organizar Percursos</button>
                    <button class="btn-vintage" onclick="App.irPara('grupos')">Organizar Grupos</button>
                </div>
            </div>`,

        grupos: () => `
            <div class="cenario floresta-fechada">
                <div class="painel-vintage">
                    <h2>Grupos</h2>
                    <div class="campo-container">
                        <label>Número de grupos (≥3):</label>
                        <input type="number" id="nGrupos" oninput="App.logicaGrupos()">
                    </div>
                    <div id="boxPessoas" class="hidden campo-container">
                        <label>Pessoas por grupo:</label>
                        <input type="number" id="nPessoas" oninput="App.logicaGrupos()">
                    </div>
                    <div id="boxImpar" class="hidden campo-container">
                        <label>Ajuste grupos ímpares (±1):</label>
                        <input type="text" placeholder="Diferença permitida">
                    </div>
                    <div id="boxLideres" class="hidden campo-container">
                        <label>Líderes por grupo:</label>
                        <input type="number" id="nLideres">
                    </div>
                    <button id="btnConfirmar" class="hidden btn-vintage" onclick="App.irPara('mestre')">Confirmar</button>
                </div>
            </div>`,

        percursos: () => `
            <div class="cenario floresta-fechada">
                <div class="painel-vintage">
                    <label>Quantidade de objetivos fixos:</label>
                    <input type="number" id="fixos" oninput="App.logicaPercurso()">
                    <div id="boxMoveis" class="hidden">
                        <label>Quantidade de objetivos móveis:</label>
                        <input type="number">
                        <button class="btn-vintage">Configurar Mapas</button>
                    </div>
                </div>
            </div>`
    },

    // --- LÓGICA DE NAVEGAÇÃO E CAMPOS ---
    irPara(tela) {
        this.container.innerHTML = this.telas[tela]();
    },

    solicitarCodigo() {
        const cod = prompt("Insira o código de 6 dígitos:");
        if(cod && cod.length === 6) alert("Progresso conectado!");
    },

    toggleVerSenha() {
        const p = document.getElementById('pass');
        p.type = p.type === 'password' ? 'text' : 'password';
    },

    logicaGrupos() {
        const nG = document.getElementById('nGrupos').value;
        const nP = document.getElementById('nPessoas').value;
        
        if(nG >= 3) document.getElementById('boxPessoas').classList.remove('hidden');
        
        if(nP > 0) {
            document.getElementById('boxImpar').classList.remove('hidden');
            document.getElementById('btnConfirmar').classList.remove('hidden');
            
            const boxL = document.getElementById('boxLideres');
            // Se pessoas por grupo for 1, esconde líderes, senão mostra se for >= 2
            nP == 1 ? boxL.classList.add('hidden') : boxL.classList.remove('hidden');
        }
    },

    logicaPercurso() {
        const f = document.getElementById('fixos').value;
        if(f > 0) document.getElementById('boxMoveis').classList.remove('hidden');
    }
};

// Inicialização
App.irPara('inicio');
