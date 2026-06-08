// STORAGE KEY
const STORAGE_KEY = 'wedding_data_karen_neques_2026';

// Inicializar dados (apenas mensagens, sem presentes)
function initData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const initialData = {
            mensagens: [
                ["Karen e Neques", "Que Deus abençoe este amor lindo! ❤️"],
                ["Família Machado", "Felicidades ao casal! Desejo tudo de bom!"]
            ]
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
}

let audioElement = null;
let isMusicPlaying = false;

// Configurar controlo da música - PAUSA ao sair da página
function setupMusicControl() {
    audioElement = document.getElementById('wedding-song');
    if (!audioElement) return;
    
    // Pausar música quando a página perde visibilidade (sair da aba/página)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && audioElement && !audioElement.paused) {
            audioElement.pause();
            isMusicPlaying = false;
            console.log("Música pausada - saiu da página");
        }
    });
    
    // Quando a página é descarregada (fechar ou recarregar)
    window.addEventListener('beforeunload', function() {
        if (audioElement) {
            audioElement.pause();
        }
    });
    
    // Opcional: pausar também quando perde foco (alternativa)
    window.addEventListener('blur', function() {
        if (audioElement && !audioElement.paused) {
            audioElement.pause();
            isMusicPlaying = false;
        }
    });
}

// ABRIR CONVITE - função principal
function unlockWedding() {
    const overlay = document.getElementById('opening-overlay');
    const mainContent = document.getElementById('main-content');
    
    if (overlay) {
        overlay.style.transition = "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
        overlay.style.opacity = "0";
        setTimeout(() => {
            overlay.style.display = "none";
            if (mainContent) {
                mainContent.style.display = "block";
                document.body.style.overflow = "auto";
            }
        }, 1200);
    }
    
    // Tentar tocar música (pode ser bloqueado pelo navegador)
    if (audioElement) {
        audioElement.play().catch(e => {
            console.log("Auto-play bloqueado pelo navegador. O usuário precisa interagir primeiro.");
        });
    }
    
    initData();
    carregarMensagens();
}

// TOGGLE DETALHES DAS CERIMÓNIAS
function toggleDetails(tipo) {
    const element = document.getElementById(`details-${tipo}`);
    if (element) {
        element.classList.toggle('show');
    }
}

// CARREGAR MENSAGENS DO MURAL
function carregarMensagens() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    
    const mural = document.getElementById('mural-exibicao');
    if (mural) {
        mural.innerHTML = data.mensagens.slice().reverse().map(msg => `
            <div class="msg-card">
                <p style="margin-bottom:12px;">"${msg[1].replace(/</g, '&lt;').replace(/>/g, '&gt;')}"</p>
                <p style="text-align:right; color:var(--gold);"><strong>— ${msg[0].replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong></p>
                <p style="font-size:10px; color:#b0a088; text-align:right;">${new Date().toLocaleDateString('pt-PT')}</p>
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
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    }
}

// Iniciar contagem
setInterval(updateCountdown, 1000);
updateCountdown();

// SCROLL SMOOTH PARA HERO
function initScroll() {
    const scrollBtn = document.querySelector('.hero-scroll');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        });
    }
}

// EVENTOS DE CLIQUE PARA ABERTURA DO CONVITE (fallback)
function setupOpenEvents() {
    const openBtn = document.getElementById('openInviteBtn');
    const overlay = document.getElementById('opening-overlay');
    
    if (openBtn) {
        openBtn.addEventListener('click', unlockWedding);
    }
    
    // Também permitir clicar no overlay inteiro para abrir
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            // Evitar que clique no botão dispare duas vezes
            if (e.target === openBtn || openBtn.contains(e.target)) {
                return;
            }
            unlockWedding();
        });
    }
}

// INICIALIZAR TUDO QUANDO O DOM CARREGAR
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM carregado - inicializando convite");
    setupMusicControl();
    setupOpenEvents();
    initScroll();
    initData();
    carregarMensagens();
});

// EXPOR FUNÇÕES GLOBAIS PARA USO NO HTML (onclick)
window.unlockWedding = unlockWedding;
window.toggleDetails = toggleDetails;
window.enviarMensagem = enviarMensagem;

// Adicione estas funções ao script.js

function mostrarContribuicao() {
    document.getElementById('modal-contribuicao').style.display = 'flex';
}

function fecharModalContribuicao() {
    document.getElementById('modal-contribuicao').style.display = 'none';
}

function copiarMpesa() {
    const chave = document.getElementById('mpesa-chave').innerText;
    navigator.clipboard.writeText(chave);
    alert("✅ Número MPESA copiado: " + chave);
}

function copiarEmola() {
    const chave = document.getElementById('emola-chave').innerText;
    navigator.clipboard.writeText(chave);
    alert("✅ Número EMOLA copiado: " + chave);
}

function enviarComprovativo() {
    window.open('https://wa.me/258827142762?text=Olá!%20Acabei%20de%20fazer%20uma%20contribuição%20para%20a%20Lua%20de%20Mel%20de%20Karen%20e%20Neques!%20❤️', '_blank');
}

// Não esquecer de exportar as funções globais
window.mostrarContribuicao = mostrarContribuicao;
window.fecharModalContribuicao = fecharModalContribuicao;
window.copiarMpesa = copiarMpesa;
window.copiarEmola = copiarEmola;
window.enviarComprovativo = enviarComprovativo;