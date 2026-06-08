// STORAGE KEY
const STORAGE_KEY = 'wedding_data_karen_neques_2026';
let audioElement = null;

// INICIALIZAR DADOS
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

// CONFIGURAR MÚSICA
function setupMusicControl() {
    audioElement = document.getElementById('wedding-song');
    if (!audioElement) return;
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && audioElement && !audioElement.paused) {
            audioElement.pause();
        }
    });
    
    window.addEventListener('beforeunload', function() {
        if (audioElement) audioElement.pause();
    });
}

// ABRIR CONVITE
function abrirConvite() {
    const overlay = document.getElementById('opening-overlay');
    const mainContent = document.getElementById('main-content');
    
    if (overlay) {
        overlay.style.transition = "opacity 0.8s ease-in-out";
        overlay.style.opacity = "0";
        
        setTimeout(function() {
            overlay.style.display = "none";
            if (mainContent) {
                mainContent.style.display = "block";
                document.body.style.overflow = "auto";
            }
        }, 800);
    }
    
    if (audioElement) {
        audioElement.play().catch(function(e) {
            console.log("Auto-play bloqueado:", e);
        });
    }
    
    initData();
    carregarMensagens();
}

// TOGGLE DETALHES
function toggleDetails(tipo) {
    const element = document.getElementById(`details-${tipo}`);
    if (element) {
        element.classList.toggle('show');
    }
}

// CARREGAR MENSAGENS
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

setInterval(updateCountdown, 1000);
updateCountdown();

// SCROLL SMOOTH
function initScroll() {
    const scrollBtn = document.querySelector('.hero-scroll');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        });
    }
}

// MODAL CONTRIBUIÇÃO
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

// INICIALIZAR
document.addEventListener('DOMContentLoaded', function() {
    setupMusicControl();
    initScroll();
    initData();
    carregarMensagens();
    
    const overlay = document.getElementById('opening-overlay');
    if (overlay) {
        overlay.addEventListener('click', abrirConvite);
    }
});

// EXPOR FUNÇÕES GLOBAIS
window.abrirConvite = abrirConvite;
window.toggleDetails = toggleDetails;
window.enviarMensagem = enviarMensagem;
window.mostrarContribuicao = mostrarContribuicao;
window.fecharModalContribuicao = fecharModalContribuicao;
window.copiarMpesa = copiarMpesa;
window.copiarEmola = copiarEmola;
window.enviarComprovativo = enviarComprovativo;