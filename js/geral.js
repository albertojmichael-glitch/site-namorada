function atualizarContador(){const e=document.getElementById("contador-visitas");if(!e)return;let t=parseInt(localStorage.getItem("visitasSite")||"0",10);t+=1,localStorage.setItem("visitasSite",t),e.textContent=String(t).padStart(6,"0")}
function iniciarCoracoesClique(){document.addEventListener("click",function(e){if(e.target.closest(".modal-overlay")||e.target.closest("button")||e.target.closest("a")||e.target.closest("input")||e.target.closest("audio")||e.target.closest("#retro-player"))return;const t=document.createElement("div");t.textContent=["💗","💖","💕","💓"][Math.floor(4*Math.random())],t.style.position="fixed",t.style.left=e.clientX+"px",t.style.top=e.clientY+"px",t.style.fontSize="22px",t.style.pointerEvents="none",t.style.zIndex="9999",t.style.transition="all 1s ease-out",document.body.appendChild(t),requestAnimationFrame(()=>{t.style.transform="translateY(-60px) scale(1.5)",t.style.opacity="0"}),setTimeout(()=>t.remove(),1e3)})}
function criarModalDOM(){if(document.getElementById("retro-modal-overlay"))return;const e=`<div class="modal-overlay" id="retro-modal-overlay"><div class="modal-box"><h3 id="modal-titulo">Aviso</h3><p id="modal-mensagem"></p><input type="text" id="modal-input" style="display:none;" placeholder="exemplo@email.com"><div class="modal-botoes"><button class="btn-retro" id="btn-modal-ok">OK</button><button class="btn-retro" id="btn-modal-cancelar" style="display:none;">Cancelar</button></div></div></div>`;document.body.insertAdjacentHTML("beforeend",e)}
window.alert=function(e){criarModalDOM(),document.getElementById("modal-titulo").innerText="Aviso 💖",document.getElementById("modal-mensagem").innerText=e,document.getElementById("modal-input").style.display="none",document.getElementById("btn-modal-cancelar").style.display="none";const t=document.getElementById("retro-modal-overlay");t.style.display="flex",document.getElementById("btn-modal-ok").onclick=()=>{t.style.display="none"}};
function garantirEmail(e){const t=localStorage.getItem("usuarioEmail");if(t)return void e(t);criarModalDOM(),document.getElementById("modal-titulo").innerText="Identifique-se 💌",document.getElementById("modal-mensagem").innerText="Para deixar uma marca na nossa história, digite seu e-mail:";const o=document.getElementById("modal-input");o.style.display="block",o.value="";const n=document.getElementById("btn-modal-ok"),l=document.getElementById("btn-modal-cancelar");l.style.display="inline-block";const i=document.getElementById("retro-modal-overlay");i.style.display="flex",n.onclick=()=>{const t=o.value.trim(),n=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;t?n.test(t)?(localStorage.setItem("usuarioEmail",t),i.style.display="none",e(t)):alert("Opa! Parece que esse e-mail não é válido.\nTente algo como: nome@email.com"):alert("Precisamos saber quem é você para salvar!")},l.onclick=()=>{i.style.display="none"}}

function injectNav() {
    const links = `<a href="index.html">🏠 início</a><a href="memorias.html">💌 nossa história</a><a href="fotos.html">📸 fotos</a><a href="jogos.html">🎮 minijogos</a><a href="musicas.html">🎵 músicas</a><a href="recados.html">💬 recados</a>`;
    const oldNav = document.querySelector(".topnav");
    if (oldNav) { oldNav.innerHTML = links; } 
    else { const t = document.querySelector(".topbar"); t && t.insertAdjacentHTML("afterend", `<nav class="topnav">${links}</nav>`); }
}

function setupGirando(){const e=document.querySelector(".img-girando");e&&e.addEventListener("click",()=>{alert("Você me deixa tontinho de amor! 💖💫")})}

// RESET DO APP
window.limparDados = function() {
    if(confirm("Tem certeza que deseja resetar o app? Você precisará colocar seu e-mail de novo para enviar memórias.")) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = window.location.pathname + "?_t=" + Date.now();
    }
};

window.tocarMusica = function(nome, src, capa) {
    sessionStorage.setItem("musicName", nome);
    sessionStorage.setItem("musicSrc", src);
    sessionStorage.setItem("musicCapa", capa || "images/casal2022.jpg");
    sessionStorage.setItem("musicTime", "0");
    sessionStorage.setItem("musicPlaying", "true");
    
    const audio = document.getElementById("bg-music");
    const title = document.getElementById("player-title");
    const cover = document.getElementById("album-cover");
    const vinyl = document.getElementById("vinyl-record");
    
    if(audio && title && cover) {
        audio.src = src;
        title.textContent = "🎵 Tocando: " + nome + " 🎵";
        cover.src = capa || "images/casal2022.jpg";
        audio.play().then(() => {
            if(vinyl) vinyl.classList.remove("paused");
        }).catch(()=>{});
    }
};

// ANIMAÇÕES DE SUAVIZAÇÃO INJETADAS GLOBALMENTE
function aplicarSuavizacao() {
    if(!document.getElementById("smooth-styles")){
        const s = document.createElement("style");
        s.id = "smooth-styles";
        s.innerHTML = `
            html { scroll-behavior: smooth; }
            .box, .timeline-item, .card-jogo { 
                animation: fadeUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; 
                opacity: 0; 
                transform: translateY(20px);
            }
            img { transition: opacity 0.5s ease-in-out; }
            img[loading] { opacity: 0; }
            
            /* Staggering (fazer os itens aparecerem um de cada vez) */
            .box:nth-child(1) { animation-delay: 0.1s; }
            .box:nth-child(2) { animation-delay: 0.2s; }
            .box:nth-child(3) { animation-delay: 0.3s; }
            
            @keyframes fadeUp {
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(s);
    }
    
    // Suaviza as imagens assim que carregam
    document.addEventListener('load', function(e){
        if(e.target.tagName === 'IMG'){ e.target.style.opacity = 1; }
    }, true);
}

function injectMusicPlayer(){
    if(!document.getElementById("retro-player")){
        let currentSrc = sessionStorage.getItem("musicSrc") || "musica.mp3";
        let currentName = sessionStorage.getItem("musicName") || "Nossa Música Especial";
        let currentCapa = sessionStorage.getItem("musicCapa") || "images/casal2022.jpg";
        let isMin = sessionStorage.getItem("musicMin") === "true";

        if(!document.getElementById("player-styles")){
            const s = document.createElement("style");
            s.id = "player-styles";
            s.innerHTML = `
                #retro-player { position: fixed; bottom: 15px; left: 50%; transform: translateX(-50%); z-index: 10000; background: #fff4fb; border: 4px ridge #ffb703; padding: 10px; box-shadow: 4px 4px 0px #7a1fa2; width: 90%; max-width: 380px; transition: 0.3s; }
                .player-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; color: #4b0082; margin-bottom: 8px; font-size: 14px; border-bottom: 2px dashed #9b5de5; padding-bottom: 4px; }
                .min-btn { background: #ff6fb0; border: 2px outset #ffb6e6; color: white; cursor: pointer; font-weight: bold; font-size: 16px; padding: 0px 8px; border-radius: 0; line-height: 1; }
                .min-btn:active { border: 2px inset #ffb6e6; }
                .player-body { display: flex; align-items: center; gap: 15px; }
                #retro-player.minimized .player-body { display: none; }
                #retro-player.minimized { padding-bottom: 5px; }
                #retro-player.minimized .player-header { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                .visuals { position: relative; width: 85px; height: 55px; flex-shrink: 0; }
                .album-cover { width: 55px; height: 55px; position: absolute; left: 0; top: 0; z-index: 2; border: 2px solid #4b0082; object-fit: cover; box-shadow: 2px 2px 4px rgba(0,0,0,0.4); background: #9b5de5; }
                .vinyl { width: 53px; height: 53px; border-radius: 50% !important; background: repeating-radial-gradient(#111, #111 2px, #333 3px, #333 4px); border: 1px solid #000; position: absolute; left: 25px; top: 1px; z-index: 1; display: flex; justify-content: center; align-items: center; box-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
                .vinyl::after { content: ''; width: 18px; height: 18px; background: #ff6a00; border-radius: 50% !important; border: 2px solid #2b0a3d; }
                .vinyl::before { content: ''; width: 5px; height: 5px; background: #fff; border-radius: 50% !important; position: absolute; z-index: 10; }
                .spinning { animation: spin 3s linear infinite; }
                .paused { animation-play-state: paused; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .player-controls { flex-grow: 1; min-width: 0; }
                .player-controls audio { height: 30px; width: 100%; outline: none; }
            `;
            document.head.appendChild(s);
        }
        
        const playerHTML = `
        <div id="retro-player" class="${isMin ? 'minimized' : ''}">
            <div class="player-header">
                <span>📻 Rádio do Casal</span>
                <button class="min-btn" id="min-btn" title="Minimizar Rádio">${isMin ? '+' : '-'}</button>
            </div>
            <div class="player-body">
                <div class="visuals">
                    <div class="vinyl spinning paused" id="vinyl-record"></div>
                    <img class="album-cover" id="album-cover" src="${currentCapa}" onerror="this.src='images/casal2022.jpg'">
                </div>
                <div class="player-controls">
                    <marquee id="player-title" behavior="scroll" direction="left" scrollamount="4" style="width: 100%; color: #ff6a00; font-size: 13px; font-weight: bold; margin-bottom: 5px;">
                    🎵 Tocando: ${currentName} 🎵
                    </marquee>
                    <audio id="bg-music" src="${currentSrc}" controls loop></audio>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', playerHTML);
        
        const audio = document.getElementById("bg-music");
        const vinyl = document.getElementById("vinyl-record");
        const minBtn = document.getElementById("min-btn");
        const player = document.getElementById("retro-player");
        
        const savedTime = sessionStorage.getItem("musicTime");
        const isPlaying = sessionStorage.getItem("musicPlaying");
        
        if(savedTime) audio.currentTime = parseFloat(savedTime);
        if(isPlaying === "true") {
            audio.play().then(() => { vinyl.classList.remove("paused"); }).catch(()=>{});
        }

        audio.addEventListener("timeupdate", () => { sessionStorage.setItem("musicTime", audio.currentTime); });
        audio.addEventListener("play", () => { sessionStorage.setItem("musicPlaying", "true"); vinyl.classList.remove("paused"); });
        audio.addEventListener("pause", () => { sessionStorage.setItem("musicPlaying", "false"); vinyl.classList.add("paused"); });

        minBtn.addEventListener("click", () => {
            if (player.classList.contains("minimized")) {
                player.classList.remove("minimized"); minBtn.textContent = "-"; sessionStorage.setItem("musicMin", "false");
            } else {
                player.classList.add("minimized"); minBtn.textContent = "+"; sessionStorage.setItem("musicMin", "true");
            }
        });
    }
}

document.addEventListener("DOMContentLoaded",function(){
    aplicarSuavizacao();
    injectNav();
    atualizarContador();
    iniciarCoracoesClique();
    setupGirando();
    injectMusicPlayer();
});
