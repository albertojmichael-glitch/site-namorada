// ============================================
// EFEITOS GERAIS DO SITE - ALBERTO & CAMILLY
// ============================================

function atualizarContador() {
  const el = document.getElementById("contador-visitas");
  if (!el) return;
  let visitas = parseInt(localStorage.getItem("visitasSite") || "0", 10);
  visitas += 1;
  localStorage.setItem("visitasSite", visitas);
  el.textContent = String(visitas).padStart(6, "0");
}

function iniciarCoracoesClique() {
  document.addEventListener("click", function (e) {
    if(e.target.closest('.modal-overlay')) return; // Nao spawnar no modal
    const coracao = document.createElement("div");
    coracao.textContent = ["💗", "💖", "💕", "💓"][Math.floor(Math.random() * 4)];
    coracao.style.position = "fixed"; coracao.style.left = e.clientX + "px"; coracao.style.top = e.clientY + "px";
    coracao.style.fontSize = "22px"; coracao.style.pointerEvents = "none";
    coracao.style.zIndex = "9999"; coracao.style.transition = "all 1s ease-out";
    document.body.appendChild(coracao);
    requestAnimationFrame(() => { coracao.style.transform = "translateY(-60px) scale(1.5)"; coracao.style.opacity = "0"; });
    setTimeout(() => coracao.remove(), 1000);
  });
}

// --------------------------------------------------
// SISTEMA DE ALERTAS E LOGIN RETRÔ
// --------------------------------------------------
function criarModalDOM() {
  if (document.getElementById('retro-modal-overlay')) return;
  const html = `
    <div class="modal-overlay" id="retro-modal-overlay">
      <div class="modal-box">
        <h3 id="modal-titulo">Aviso</h3>
        <p id="modal-mensagem"></p>
        <input type="text" id="modal-input" style="display:none;" placeholder="Digite aqui...">
        <div class="modal-botoes">
          <button class="btn-retro" id="btn-modal-ok">OK</button>
          <button class="btn-retro" id="btn-modal-cancelar" style="display:none;">Cancelar</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

// Substitui o "alert()" feio do navegador por este bonito
window.alert = function(mensagem) {
  criarModalDOM();
  document.getElementById('modal-titulo').innerText = "Aviso 💖";
  document.getElementById('modal-mensagem').innerText = mensagem;
  document.getElementById('modal-input').style.display = 'none';
  document.getElementById('btn-modal-cancelar').style.display = 'none';
  
  const overlay = document.getElementById('retro-modal-overlay');
  overlay.style.display = 'flex';
  
  document.getElementById('btn-modal-ok').onclick = () => { overlay.style.display = 'none'; };
};

// Pede email SÓ quando a pessoa for adicionar algo
function garantirEmail(callback) {
  const emailLogado = localStorage.getItem("usuarioEmail");
  if (emailLogado) { callback(emailLogado); return; }
  
  criarModalDOM();
  document.getElementById('modal-titulo').innerText = "Identifique-se 💌";
  document.getElementById('modal-mensagem').innerText = "Para deixar uma marca na nossa história, digite seu nome ou email:";
  
  const input = document.getElementById('modal-input');
  input.style.display = 'block'; input.value = '';
  
  const btnOk = document.getElementById('btn-modal-ok');
  const btnCancelar = document.getElementById('btn-modal-cancelar');
  btnCancelar.style.display = 'inline-block';
  
  const overlay = document.getElementById('retro-modal-overlay');
  overlay.style.display = 'flex';
  
  btnOk.onclick = () => {
    const email = input.value.trim();
    if (email) {
      localStorage.setItem("usuarioEmail", email);
      overlay.style.display = 'none';
      callback(email);
    } else {
      alert("Precisamos saber quem é você para salvar!");
    }
  };
  btnCancelar.onclick = () => { overlay.style.display = 'none'; };
}

document.addEventListener("DOMContentLoaded", function () {
  atualizarContador();
  iniciarCoracoesClique();
});
