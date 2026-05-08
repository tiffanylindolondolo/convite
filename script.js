// Chave para armazenamento local
const STORAGE_KEY = 'wedding_data_karen_neques_2026';

// Variável para controlar estado da lista
let listaVisivel = false;

// Inicializar dados se não existirem
function initData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const initialData = {
            mensagens: [
                ["Karen e Neques", "Que Deus abençoe este amor lindo! ❤️"],
                ["Família Machado", "Felicidades ao casal! Que venham muitos anos de amor."]
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

// Função para mostrar/esconder a lista de presentes
function toggleListaPresentes() {
    const container = document.getElementById('container-lista-presentes');
    const botao = document.getElementById('btnMostrarLista');
    
    if (!listaVisivel) {
        // Mostrar lista
        container.style.display = 'block';
        botao.innerHTML = '🎁 Esconder Lista de Presentes';
        listaVisivel = true;
        
        // Carregar os presentes atualizados
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (data && data.presentes) {
            carregarPresentes(data.presentes);
        }
    } else {
        // Esconder lista
        container.style.display = 'none';
        botao.innerHTML = '🎁 Ver Lista de Presentes';
        listaVisivel = false;
    }
}

// Função para abrir o convite
function unlockWedding() {
    console.log("Função unlockWedding chamada!");
    const overlay = document.getElementById('opening-overlay');
    if (overlay) {
        overlay.style.transform = "translateY(-100%)";
        console.log("Overlay escondido");
    }
    
    const song = document.getElementById('wedding-song');
    if (song) {
        song.play().catch(e => console.log("Auto-play bloqueado pelo navegador"));
    }
    
    initData();
    carregarDados();
}

// Garantir que as funções estão disponíveis globalmente
window.unlockWedding = unlockWedding;
window.toggleListaPresentes = toggleListaPresentes;

// Gerenciar música quando a aba não está visível
document.addEventListener('visibilitychange', () => {
    const song = document.getElementById('wedding-song');
    const overlay = document.getElementById('opening-overlay');
    if (document.visibilityState === 'hidden') {
        if (song && !song.paused) song.pause();
    } else {
        if (overlay && overlay.style.transform === "translateY(-100%)") {
            song.play().catch(e => console.log("Não foi possível reproduzir"));
        }
    }
});

// Contagem regressiva com animação
const weddingDate = new Date("Nov 27, 2026 15:30:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        function updateWithAnimation(elementId, newValue) {
            const element = document.getElementById(elementId);
            if (element && element.innerText !== String(newValue).padStart(2, '0')) {
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    if (element) element.style.transform = 'scale(1)';
                }, 200);
            }
            if (element) element.innerText = String(newValue).padStart(2, '0');
        }
        
        updateWithAnimation('days', days);
        updateWithAnimation('hours', hours);
        updateWithAnimation('minutes', minutes);
        updateWithAnimation('seconds', seconds);
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Função para alternar detalhes das cerimónias
function toggleDetails(tipo) {
    const element = document.getElementById(`details-${tipo}`);
    if (element) {
        element.classList.toggle('hidden');
    }
}

window.toggleDetails = toggleDetails;

// Carregar dados do localStorage
function carregarDados() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    
    // Carregar mural
    const mural = document.getElementById('mural-exibicao');
    if (mural) {
        mural.innerHTML = data.mensagens.slice().reverse().map(msg => `
            <div class="msg-card">
                <p style="font-style:italic; margin-bottom:10px;">"${msg[1].replace(/</g, '&lt;').replace(/>/g, '&gt;')}"</p>
                <p style="text-align:right; margin-top:10px; color:#D4AF37;">
                    <strong>— ${msg[0].replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong>
                    <span style="font-size:11px; color:#999; display:block;">${new Date().toLocaleDateString('pt-PT')}</span>
                </p>
            </div>
        `).join('');
    }
}

// Carregar lista de presentes
function carregarPresentes(presentes) {
    const container = document.getElementById('presentes-lista');
    if (!container || !presentes || presentes.length === 0) return;
    
    container.innerHTML = presentes.map((presente, index) => `
        <div class="gift-card">
            <h4>${presente.nome.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h4>
            <p class="price-highlight">${presente.valor.toLocaleString('pt-PT')} MT</p>
            ${presente.reservado ? 
                `<p class="reservado">✓ Já foi reservado por ${presente.reservadoPor || 'alguém'}</p>` : 
                `<button onclick="abrirModal(${index})">🎁 Oferecer este presente</button>`
            }
        </div>
    `).join('');
}

// Variável global para o índice do presente selecionado
let selectedGiftIndex = null;

// Abrir modal para reserva
function abrirModal(index) {
    selectedGiftIndex = index;
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    
    const presente = data.presentes[index];
    if (!presente) return;
    
    const nomeModal = document.getElementById('nome-presente-modal');
    const valorModal = document.getElementById('valor-presente-modal');
    const modal = document.getElementById('modal-reserva');
    
    if (nomeModal) nomeModal.innerText = presente.nome;
    if (valorModal) valorModal.innerHTML = `${presente.valor.toLocaleString('pt-PT')} MT`;
    if (modal) modal.style.display = 'flex';
}

// Fechar modal
function fecharModal() {
    const modal = document.getElementById('modal-reserva');
    if (modal) modal.style.display = 'none';
    selectedGiftIndex = null;
    
    const nameInput = document.getElementById('donor-name');
    const phoneInput = document.getElementById('donor-phone');
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
}

// Confirmar reserva
function confirmarReserva() {
    const nome = document.getElementById('donor-name')?.value.trim();
    const telefone = document.getElementById('donor-phone')?.value.trim();
    
    if (!nome || !telefone) {
        alert("Por favor, preencha o seu nome e telefone.");
        return;
    }
    
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data || selectedGiftIndex === null) return;
    
    const presente = data.presentes[selectedGiftIndex];
    
    if (presente.reservado) {
        alert("Este presente já foi reservado por outra pessoa.");
        fecharModal();
        return;
    }
    
    presente.reservado = true;
    presente.reservadoPor = nome;
    presente.telefone = telefone;
    presente.dataReserva = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    alert(`✅ Presente reservado com sucesso!\n\n${nome}, muito obrigado pelo carinho! Em breve entraremos em contacto.`);
    
    fecharModal();
    carregarPresentes(data.presentes);
    
    const mensagem = `Olá! Acabei de reservar o presente "${presente.nome}" para o casamento de Karen e Neques. Meu nome é ${nome}.`;
    window.open(`https://wa.me/258827142762?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// Enviar mensagem para o mural
function enviarMensagem() {
    const nome = document.getElementById('msg-name')?.value.trim();
    const mensagem = document.getElementById('msg-text')?.value.trim();
    
    if (!nome || !mensagem) {
        alert("Por favor, preencha o seu nome e a mensagem.");
        return;
    }
    
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    
    data.mensagens.push([nome, mensagem]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    alert("💝 Mensagem publicada no mural com sucesso! Obrigado pelo carinho.");
    
    const nameInput = document.getElementById('msg-name');
    const msgText = document.getElementById('msg-text');
    if (nameInput) nameInput.value = '';
    if (msgText) msgText.value = '';
    
    carregarDados();
}

// Garantir que todas as funções estão disponíveis globalmente
window.enviarMensagem = enviarMensagem;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.confirmarReserva = confirmarReserva;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log("Página carregada com sucesso!");
    initData();
});