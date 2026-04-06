<script>
const App = {
    root: document.getElementById('app-root'),
    mapa: null,
    marcos: [], // Array de objetos {id, marker, nome, ordem}
    modoEdicao: false,
    corAtual: '#2e7d32',
    dadosConfig: { grupos: null, objetivos: null },

    telas: {
        inicio: () => `<div class="cenario bg-inicio"><div class="painel-vintage"><h1 class="fonte-manuscrita">TrailQuest</h1><button class="btn-v fonte-forte" onclick="App.navegar('login')">Login</button><button class="btn-v fonte-forte" style="background:#795548" onclick="App.navegar('participanteAcesso')">Participante</button></div></div>`,
        
        menuInicial: () => `<div class="cenario bg-menu"><div class="painel-vintage"><button class="btn-v fonte-forte" onclick="App.navegar('mestre')">Organizador</button><button class="btn-v fonte-forte" onclick="App.navegar('participanteAcesso')">Participante</button></div></div>`,

        mestre: () => {
            const pronto = App.dadosConfig.grupos && App.dadosConfig.objetivos;
            return `<div class="cenario bg-menu"><div class="painel-vintage"><h2 class="fonte-manuscrita">Mestre</h2>
                <button class="btn-v fonte-forte" onclick="App.navegar('percursos')">Configurar Percursos</button>
                <button class="btn-v fonte-forte" onclick="App.navegar('grupos')">Configurar Grupos</button>
                ${pronto ? `<button class="btn-v fonte-forte" style="background:#ffa000" onclick="App.navegar('loginObjetivoMovel')">CONTINUAR</button>` : ''}
                <button class="btn-v fonte-forte" style="background:#6d4c41" onclick="App.navegar('menuInicial')">Voltar</button></div></div>`;
        },

        grupos: () => `<div class="cenario bg-menu"><div class="painel-vintage"><h2 class="fonte-manuscrita">Grupos</h2>
            <input type="number" id="nGrupos" placeholder="Nº Grupos (Máx 30)" oninput="App.logicaGrupos()" value="">
            <div id="boxPessoas" class="hidden"><input type="number" id="nPessoas" placeholder="Pessoas por Grupo" oninput="App.logicaGrupos()" value=""></div>
            <div id="boxLideres" class="hidden"><input type="number" id="nLideres" placeholder="Líderes por Grupo" oninput="App.logicaGrupos()" value=""></div>
            <div id="boxImpar" class="hidden"><input type="text" id="ajusteImpar" placeholder="Ajuste de Ímpares" value=""></div>
            <div style="display:flex; gap:10px; margin-top:20px;"><button class="btn-v fonte-forte" style="background:#6d4c41" onclick="App.navegar('mestre')">Voltar</button>
            <button id="btnConfirmar" class="hidden btn-v fonte-forte" onclick="App.confirmarDadosMestre('grupos')">Confirmar</button></div></div></div>`,

        percursos: () => `<div class="cenario bg-menu"><div class="painel-vintage"><h2 class="fonte-manuscrita">Percursos</h2>
            <input type="number" id="fixos" placeholder="Qtd Objetivos Fixos" oninput="App.logicaPercurso()" value="">
            <div id="boxMoveis" class="hidden"><input type="number" id="moveis" placeholder="Qtd Objetivos Móveis" value="">
            <button class="btn-v fonte-forte" style="background:#ffa000" onclick="App.abrirMapa()">Mapear Rota</button></div>
            <div style="display:flex; gap:10px; margin-top:20px;"><button class="btn-v fonte-forte" style="background:#6d4c41" onclick="App.navegar('mestre')">Voltar</button>
            <button id="btnConfirmarPercurso" class="hidden btn-v fonte-forte" onclick="App.confirmarDadosMestre('percurso')">Confirmar</button></div></div></div>`
    },

    navegar(t) { this.root.innerHTML = this.telas[t] ? this.telas[t]() : ''; },

    logicaGrupos() {
        const nG = document.getElementById('nGrupos'), nP = document.getElementById('nPessoas'), nL = document.getElementById('nLideres'), btn = document.getElementById('btnConfirmar');
        if (nG.value > 30) nG.value = 30;
        if (nG.value >= 1) document.getElementById('boxPessoas').classList.remove('hidden');
        if (nP.value >= 1) { 
            document.getElementById('boxLideres').classList.remove('hidden'); 
            document.getElementById('boxImpar').classList.remove('hidden');
            btn.classList.remove('hidden'); 
        }
    },

    logicaPercurso() {
        const f = document.getElementById('fixos'), btn = document.getElementById('btnConfirmarPercurso');
        if(f.value > 0) { document.getElementById('boxMoveis').classList.remove('hidden'); btn.classList.remove('hidden'); }
    },

    confirmarDadosMestre(tipo) {
        if(tipo === 'grupos') this.dadosConfig.grupos = document.getElementById('nGrupos').value;
        if(tipo === 'percurso') this.dadosConfig.objetivos = document.getElementById('fixos').value;
        this.navegar('mestre');
    },

    abrirMapa() {
        document.getElementById('map-container').style.display = 'block';
        if (!this.mapa) {
            this.mapa = L.map('map').setView([-12.5, -38.3], 13);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(this.mapa);
            
            this.mapa.on('click', (e) => {
                if (this.modoEdicao) this.adicionarPonto(e.latlng);
            });
        }
        setTimeout(() => this.mapa.invalidateSize(), 200);
    },

    adicionarPonto(latlng) {
        const id = Date.now();
        const ordem = this.marcos.length + 1;
        const marker = L.circleMarker(latlng, { radius: 10, fillColor: this.corAtual, color: "#fff", weight: 2, fillOpacity: 0.8 }).addTo(this.mapa);
        
        const ponto = { id, marker, nome: `Ponto ${ordem}`, ordem, latlng, codigo: `TQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}` };
        this.marcos.push(ponto);
        this.renderPopup(ponto);
        this.desenharLinha();
    },

    renderPopup(p) {
        const content = `
            <div>
                <b>Editando: ${p.nome}</b><br>
                <input type="text" id="editNome-${p.id}" value="${p.nome}" style="font-size:12px; margin:2px">
                <input type="number" id="editOrdem-${p.id}" value="${p.ordem}" style="font-size:12px; margin:2px">
                <div style="background:#eee; padding:5px; margin:5px 0; font-size:10px;">CÓDIGO: ${p.codigo}</div>
                <button class="btn-salvar-pop" onclick="App.salvarPonto(${p.id})">Salvar</button>
                <button class="btn-excluir" onclick="App.removerPonto(${p.id})">Excluir</button>
            </div>`;
        p.marker.bindPopup(content).openPopup();
    },

    salvarPonto(id) {
        const p = this.marcos.find(x => x.id === id);
        p.nome = document.getElementById(`editNome-${id}`).value;
        p.ordem = parseInt(document.getElementById(`editOrdem-${id}`).value);
        this.marcos.sort((a, b) => a.ordem - b.ordem);
        this.desenharLinha();
        this.mapa.closePopup();
    },

    removerPonto(id) {
        const idx = this.marcos.findIndex(x => x.id === id);
        this.mapa.removeLayer(this.marcos[idx].marker);
        this.marcos.splice(idx, 1);
        this.desenharLinha();
    },

    desenharLinha() {
        if (this.polyline) this.mapa.removeLayer(this.polyline);
        const latlngs = this.marcos.sort((a, b) => a.ordem - b.ordem).map(p => p.marker.getLatLng());
        this.polyline = L.polyline(latlngs, { color: '#ffa000', weight: 4, dashArray: '10, 10' }).addTo(this.mapa);
    },

    alternarModoEdicao() {
        this.modoEdicao = !this.modoEdicao;
        const btn = document.getElementById('btnAcaoMapa');
        btn.innerText = this.modoEdicao ? "SALVAR EDIÇÃO" : "ADICIONAR PONTOS";
        btn.style.background = this.modoEdicao ? "#d32f2f" : "var(--verde)";
        if(!this.modoEdicao) this.corAtual = '#' + Math.floor(Math.random()*16777215).toString(16);
    },

    localizarUsuario() {
        navigator.geolocation.getCurrentPosition(p => {
            const loc = [p.coords.latitude, p.coords.longitude];
            this.mapa.setView(loc, 17);
            if (this.meuCirculo) this.mapa.removeLayer(this.meuCirculo);
            this.meuCirculo = L.circle(loc, { radius: p.coords.accuracy, color: '#1976d2' }).addTo(this.mapa);
        });
    },

    fecharMapa() { document.getElementById('map-container').style.display = 'none'; }
};

window.onload = () => App.navegar('inicio');
</script>
