// STORAGE KEY
const STORAGE_KEY = 'wedding_data_karen_neques_2026';

// Inicializar dados
function initData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const initialData = {
            mensagens: [
                ["Karen e Neques", "Que Deus abençoe este amor lindo! ❤️"],
                ["Família Machado", "Felicidades ao casal! Desejo tudo de bom!"]
            ],
            presentes: [
                { nome: "Jogo de Taças Cristal", valor: 3500, reservado: false, reservadoPor: null, telefone: null },
                { nome: "Jogo de Panelas Antiaderentes", valor: 4500, reservado: false, reservadoPor: null, telefone: null },
                { nome: "Kit Jantar Prata 24 Peças", valor: 2800, reservado: false, reservadoPor: null, telefone: null },
                { nome: "Máquina de Café Expresso", valor: 8900, reservado: false, reservadoPor: null, telefone: null },
                { nome: "Jogo de Lençóis Casal", valor: 2200, reservado: false, reservadoPor: null, telefone: null },
                { nome: "Liquidificadora Professional", valor: 3200, reservado: false, reservadoPor: null, telefone: null },
                { nome: "Baixela de Prata", valor: 12500, reservado: false, reservadoPor: null, telefone: null },
                { nome: "Conjunto de Toalhas", valor: 1800, reservado: false, reservadoPor: null, telefone: null }
            ]
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
}

// ABRIR CONVITE (COM SELO)
function unlockWedding() {
    const overlay = document.getElementById('opening-overlay');
    const mainContent = document.getElementById('main-content');
    
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        mainContent.style.display = 'block';
        document.body.style.overflow = 'auto';
    }, 1000);
    
    const song = document.getElementById('wedding-song');
    song.play().catch(e => console.log("Auto-play bloqueado"));
    
    initData();
    carregarMensagens();
}

// TOGGLE DETALHES DAS CERIMÓNIAS
function toggleDetails(tipo) {
    const element = document.getElementById(`details-${tipo}`);
    element.classList.toggle('show');
}

// CARREGAR MENSAGENS DO MURAL
function carregarMensagens() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    
    const mural = document.getElementById('mural-exibicao');
    if (mural) {
        mural.innerHTML = data.mensagens.slice().reverse().map(msg => `
            <div class="msg-card">
                <p style="margin-bottom:10px;">"${msg[1].replace(/</g, '&lt;').replace(/>/g, '&gt;')}"</p>
                <p style="text-align:right; color:var(--gold);"><strong>— ${msg[0].replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong></p>
                <p style="font-size:10px; color:#999; text-align:right;">${new Date().toLocaleDateString('pt-PT')}</p>
            </div>
        `).join('');
    }
}

// ENVIAR MENSAGEM
function enviarMensagem() {
    const nome = document.getElementById('msg-name')?.value.trim();
    const mensagem = document.getElementById('msg-text')?.value.trim();
    
    if (!nome || !mensagem) {
        alert("Por favor, preencha o seu nome e a mensagem.");
        return;
    }
    
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    data.mensagens.push([nome, mensagem]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    alert("💝 Mensagem publicada com sucesso! Obrigado pelo carinho.");
    
    document.getElementById('msg-name').value = '';
    document.getElementById('msg-text').value = '';
    carregarMensagens();
}

// CONTAGEM REGRESSIVA
const targetDate = new Date("Nov 27, 2026 15:30:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// MOSTRAR LISTA DE PRESENTES (MODAL)
function mostrarListaPresentes() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const container = document.getElementById('presentes-lista');
    
    if (!container) return;
    
    container.innerHTML = data.presentes.map((p, index) => `
        <div class="gift-card">
            <h4>${p.nome}</h4>
            <p class="price-highlight">${p.valor.toLocaleString('pt-PT')} MT</p>
            ${p.reservado ? 
                `<p style="color:#e74c3c; font-size:12px;">✓ Já reservado por ${p.reservadoPor}</p>` : 
                `<button onclick="reservarPresente(${index})">🎁 Reservar</button>`
            }
        </div>
    `).join('');
    
    document.getElementById('modal-lista').style.display = 'flex';
}

function fecharModalLista() {
    document.getElementById('modal-lista').style.display = 'none';
}

function reservarPresente(index) {
    const nome = prompt("Digite seu nome completo:");
    if (!nome) return;
    
    const telefone = prompt("Digite seu telefone (WhatsApp):");
    if (!telefone) return;
    
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const presente = data.presentes[index];
    
    if (presente.reservado) {
        alert("Este presente já foi reservado!");
        return;
    }
    
    presente.reservado = true;
    presente.reservadoPor = nome;
    presente.telefone = telefone;
    presente.dataReserva = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    alert(`✅ Presente "${presente.nome}" reservado com sucesso!\n\nObrigado ${nome}!`);
    
    // Atualizar a lista
    mostrarListaPresentes();
    
    // Opcional: enviar WhatsApp
    const mensagem = `Olá! Acabei de reservar o presente "${presente.nome}" para o casamento de Karen e Neques. Meu nome é ${nome}.`;
    window.open(`https://wa.me/258827142762?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// CONTRIBUIÇÃO PARA LUA DE MEL
function mostrarContribuicao() {
    document.getElementById('modal-contribuicao').style.display = 'flex';
}

function fecharModalContribuicao() {
    document.getElementById('modal-contribuicao').style.display = 'none';
}

function copiarPix() {
    const chave = document.getElementById('pix-chave').innerText;
    navigator.clipboard.writeText(chave);
    alert("✅ Chave PIX copiada: " + chave);
}

function enviarComprovativo() {
    window.open('https://wa.me/258827142762?text=Olá!%20Acabei%20de%20fazer%20uma%20contribuição%20para%20a%20Lua%20de%20Mel%20de%20Karen%20e%20Neques!%20❤️', '_blank');
}

// SCROLL SMOOTH PARA HERO
document.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.querySelector('.hero-scroll');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        });
    }
});

// EXPOR FUNÇÕES GLOBAIS
window.unlockWedding = unlockWedding;
window.toggleDetails = toggleDetails;
window.enviarMensagem = enviarMensagem;
window.mostrarListaPresentes = mostrarListaPresentes;
window.fecharModalLista = fecharModalLista;
window.reservarPresente = reservarPresente;
window.mostrarContribuicao = mostrarContribuicao;
window.fecharModalContribuicao = fecharModalContribuicao;
window.copiarPix = copiarPix;
window.enviarComprovativo = enviarComprovativo;