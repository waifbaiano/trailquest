const App = {
    root: document.getElementById('app-root'),

    // Telas em formato de String para facilitar o Reset
    telas: {
        inicio: () => `
            <div class="cenario bg-inicio">
                <div class="painel-vintage">
                    <h1>TrailQuest</h1>
                    <button class="btn-v" onclick="App.navegar('login')">Fazer Login</button>
                    <button class="btn-v" style="background:#795548" onclick="App.pedirCodigo()">Continuar como Participante</button>
                </div>
            </div>`,
        
        login: () => `
            <div class="cenario bg-inicio">
                <div class="painel-vintage">
                    <h2>Bem-vindos</h2>
                    <div style="text-align:left">
                        <label>E-mail</label>
                        <input type="email" id="email">
                        <label>Senha</label>
                        <input type="password" id="senha">
                        <span class="olhinho" onclick="App.verSenha()">👁️</span>
                    </div>
                    <button class="btn-v" onclick="App.navegar('menuInicial')">Entrar</button>
                </div>
            </div>`,

        menuInicial: () => `
            <div class="cenario bg-menu">
                <div class="painel-vintage">
                    <button class="btn-v" onclick="App.navegar('mestre')">Organizador</button>
                    <button class="btn-v" onclick="App.pedirCodigo()">Participante</button>
                </div>
            </div>`,

        mestre: () => `
            <div class="cenario bg-menu">
                <div class="painel-vintage">
                    <h2>Mestre</h2>
                    <button class="btn-v" onclick="App.navegar('percursos')">Organizar Percursos</button>
                    <button class="btn-v" onclick="App.navegar('grupos')">Organizar Grupos</button>
                    <button class="btn-v" style="background:#6d4c41" onclick="App.navegar('menuInicial')">Voltar</button>
                </div>
            </div>`,

        grupos: () => `
            <div class="cenario bg-menu">
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
                        <label>Grupos ímpares (±1 participante):</label>
                        <input type="text" placeholder="Diferença permitida">
                    </div>
                    <div id="boxLideres" class="hidden campo-container">
                        <label>Líderes por grupo:</label>
                        <input type="number" id="nLideres">
                    </div>
                    <button id="btnConfirmar" class="hidden btn-v" onclick="App.navegar('mestre')">Confirmar</button>
                </div>
            </div>`,

        percursos: () => `
            <div class="cenario bg-menu">
                <div class="painel-vintage">
                    <h2>Percursos</h2>
                    <div class="campo-container">
                        <label>Objetivos Fixos:</label>
                        <input type="number" id="fixos" oninput="App.logicaPercurso()">
                    </div>
                    <div id="boxMoveis" class="hidden campo-container">
                        <label>Objetivos Móveis:</label>
                        <input type="number">
                        <button class="btn-v" style="background:#ffa000">Configurar Mapas</button>
                    </div>
                    <button class="btn-v" style="background:#6d4c41" onclick="App.navegar('mestre')">Voltar</button>
                </div>
            </div>`
    },

    navegar(tela) {
        this.root.innerHTML = this.telas[tela]();
    },

    pedirCodigo() {
        const c = prompt("Código de 6 dígitos:");
        if(c?.length === 6) alert("Conectado ao Evento!");
    },

    verSenha() {
        const s = document.getElementById('senha');
        s.type = s.type === 'password' ? 'text' : 'password';
    },

    logicaGrupos() {
        const nG = document.getElementById('nGrupos').value;
        const nP = document.getElementById('nPessoas').value;
        
        if(nG >= 3) document.getElementById('boxPessoas').classList.remove('hidden');
        
        if(nP > 0) {
            document.getElementById('boxImpar').classList.remove('hidden');
            document.getElementById('btnConfirmar').classList.remove('hidden');
            const boxL = document.getElementById('boxLideres');
            // Regra: se nP == 1, esconde líderes. Se >= 2, mostra.
            nP == 1 ? boxL.classList.add('hidden') : boxL.classList.remove('hidden');
        }
    },

    logicaPercurso() {
        if(document.getElementById('fixos').value > 0) {
            document.getElementById('boxMoveis').classList.remove('hidden');
        }
    }
};

App.navegar('inicio');
