const URL_GOOGLE = "https://script.google.com/macros/s/AKfycbyNt62sjWcVWP3m9vX70bi0nTNxjLdHFPtToKKCy5HAv94PwholFqf1Jgk-jgovtemZ/exec";

function unlockWedding() {
    document.getElementById('opening-overlay').style.transform = "translateY(-100%)";
    document.getElementById('wedding-song').play();
    carregarDadosSheets();
}

// MÚSICA INTELIGENTE
document.addEventListener('visibilitychange', () => {
    const song = document.getElementById('wedding-song');
    if (document.visibilityState === 'hidden') song.pause();
    else if (document.getElementById('opening-overlay').style.transform === "translateY(-100%)") song.play();
});

// CONTAGEM REGRESSIVA
const weddingDate = new Date("Nov 27, 2026 15:30:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const diff = weddingDate - now;
    if (diff > 0) {
        document.getElementById('days').innerText = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById('hours').innerText = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById('minutes').innerText = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById('seconds').innerText = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
    }
}, 1000);

// CARREGAR TUDO DO GOOGLE
async function carregarDadosSheets() {
    try {
        const res = await fetch(URL_GOOGLE);
        const data = await res.json();
        
        // MURAL
        const mural = document.getElementById('mural-exibicao');
        mural.innerHTML = data.mensagens.reverse().map(m => `
            <div class="msg-card">
                <p style="font-style:italic;">"${m[1]}"</p>
                <p style="text-align:right; margin-top:10px; color:#D4AF37;"><strong>— ${m[0]}</strong></p>
            </div>
        `).join('');

        // PRESENTES (Cache global)
        window.bancoPresentes = data.presentes;
    } catch(e) { console.error("Erro ao carregar dados."); }
}

// ENVIAR MENSAGEM
async function enviarMensagem() {
    const nome = document.getElementById('msg-name').value;
    const msg = document.getElementById('msg-text').value;
    if(!nome || !msg) return alert("Por favor, preencha o nome e a mensagem.");
    
    await fetch(URL_GOOGLE, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ tipo: "MENSAGEM", nome: nome, mensagem: msg })
    });
    alert("Obrigada! Mensagem enviada para o mural.");
    location.reload();
}

// MOSTRAR PRESENTES
function mostrarLista() {
    const cont = document.getElementById('container-lista');
    cont.classList.toggle('hidden-list');
    const lista = document.getElementById('presentes-lista');
    lista.innerHTML = window.bancoPresentes.map(p => `
        <div class="gift-card">
            <h4>${p[0]}</h4>
            <p class="price-highlight">${p[1]} MT</p>
            ${p[2] === 'Reservado' ? '<p style="color:red; font-weight:bold;">JÁ RESERVADO</p>' : `<button class="btn-primary" style="padding:10px; font-size:11px;" onclick="abrirModal('${p[0]}','${p[1]}')">Oferecer</button>`}
        </div>
    `).join('');
}

let selecionado = "";
function abrirModal(n, p) { 
    selecionado = n;
    document.getElementById('nome-presente-modal').innerText = n;
    document.getElementById('valor-presente-modal').innerText = p + " MT";
    document.getElementById('modal-reserva').style.display = 'flex'; 
}
function fecharModal() { document.getElementById('modal-reserva').style.display = 'none'; }

async function confirmarReserva() {
    const nome = document.getElementById('donor-name').value;
    const tel = document.getElementById('donor-phone').value;
    if(!nome || !tel) return alert("Dados obrigatórios.");
    
    await fetch(URL_GOOGLE, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ tipo: "PRESENTE", item: selecionado, nome: nome, telefone: tel })
    });
    alert("Reserva efectuada! Entraremos em contacto.");
    location.reload();
}