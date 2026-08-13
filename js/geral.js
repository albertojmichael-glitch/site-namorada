// ============================================
// EFEITOS GERAIS DO SITE - ALBERTO & CAMILLY
// ============================================

// Contador de visitas (persiste no navegador via localStorage)
function atualizarContador() {
  const el = document.getElementById("contador-visitas");
  if (!el) return;
  let visitas = parseInt(localStorage.getItem("visitasSite") || "0", 10);
  visitas += 1;
  localStorage.setItem("visitasSite", visitas);
  el.textContent = String(visitas).padStart(6, "0");
}

// Coraçõezinhos saindo do cursor ao clicar (bem tosco, bem 2000s)
function iniciarCoracoesClique() {
  document.addEventListener("click", function (e) {
    const coracao = document.createElement("div");
    coracao.textContent = ["💗", "💖", "💕", "💓"][Math.floor(Math.random() * 4)];
    coracao.style.position = "fixed";
    coracao.style.left = e.clientX + "px";
    coracao.style.top = e.clientY + "px";
    coracao.style.fontSize = "22px";
    coracao.style.pointerEvents = "none";
    coracao.style.zIndex = "9999";
    coracao.style.transition = "all 1s ease-out";
    document.body.appendChild(coracao);

    requestAnimationFrame(() => {
      coracao.style.transform = "translateY(-60px) scale(1.5)";
      coracao.style.opacity = "0";
    });

    setTimeout(() => coracao.remove(), 1000);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  atualizarContador();
  iniciarCoracoesClique();
});


function pedirEmailLogin() {
  const emailLogado = localStorage.getItem("usuarioEmail");
  if (!emailLogado) {
    const email = prompt("💖 Bem-vindo! Por favor, insira seu e-mail para entrar:");
    if (email) {
      localStorage.setItem("usuarioEmail", email);
      alert("Login feito com sucesso, " + email + "!");
    } else {
      alert("Você precisa de um e-mail para acessar nossas memórias!");
      pedirEmailLogin(); // Força a colocar o email
    }
  }
}

// Chame a função quando a página carregar
document.addEventListener("DOMContentLoaded", function () {
  pedirEmailLogin();
});