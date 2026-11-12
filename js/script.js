const $ = (s) => document.querySelector(s);
const raiz = document.documentElement;
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const ler = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

/* ---------- Acessibilidade: tema, contraste, fonte ---------- */
let fonte = parseInt(ler("fonte")) || 100;
const aplicaFonte = () => { raiz.style.setProperty("--fs", fonte + "%"); guardar("fonte", fonte); };
const setTema = (escuro) => {
  if (escuro) raiz.setAttribute("data-theme", "dark"); else raiz.removeAttribute("data-theme");
  const b = $("#tema"); b.setAttribute("aria-pressed", escuro);
  b.textContent = escuro ? "Modo claro" : "Modo escuro";
  guardar("tema", escuro ? "dark" : "light");
};
const setContraste = (on) => {
  if (on) raiz.setAttribute("data-contrast", "alto"); else raiz.removeAttribute("data-contrast");
  $("#contraste").setAttribute("aria-pressed", on);
  guardar("contraste", on ? "1" : "0");
};
$("#fMais").onclick = () => { fonte = Math.min(fonte + 10, 140); aplicaFonte(); };
$("#fMenos").onclick = () => { fonte = Math.max(fonte - 10, 80); aplicaFonte(); };
$("#tema").onclick = () => setTema(!raiz.hasAttribute("data-theme"));
$("#contraste").onclick = () => setContraste(!raiz.hasAttribute("data-contrast"));
aplicaFonte();
setTema(ler("tema") === "dark");
setContraste(ler("contraste") === "1");

/* ---------- Dados fictícios: [código, nome, preço, variação %] ---------- */
const dados = {
  acoes: [["PETR4","Petrobras",38.2,1.2],["VALE3","Vale",62.4,-0.8],["ITUB4","Itaú Unibanco",33.1,0.5],["WEGE3","WEG",45.7,2.1],["BBAS3","Banco do Brasil",15.60,-7.6],["MGLU3","Magazine Luiza",9.4,3.4]],
  fiis: [["MXRF11","Maxi Renda",10.1,0.4],["HGLG11","CSHG Logística",158.3,-0.2],["KNRI11","Kinea Renda",142.6,0.1],["XPML11","XP Malls",109.8,0.9]],
  criptos: [["BTC","Bitcoin",350000,-2.1],["ETH","Ethereum",17500,1.6],["SOL","Solana",820,4.2]]
};
let aba = "acoes";
const real = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function desenha() {
  const alvo = $("#cards");
  if (!alvo) return;
  const q = $("#busca").value.trim().toLowerCase();
  const lista = dados[aba].filter((d) => d[0].toLowerCase().includes(q) || d[1].toLowerCase().includes(q));
  alvo.innerHTML = lista.length
    ? lista.map((d) => {
        const sobe = d[3] >= 0;
        return `<article class="card"><h3>${d[0]}</h3><p>${d[1]}</p>
          <p class="preco">${real(d[2])}</p>
          <p class="${sobe ? "up" : "down"}">${sobe ? "▲ alta" : "▼ queda"} de ${Math.abs(d[3]).toFixed(1)}%</p></article>`;
      }).join("")
    : "<p>Nenhum resultado. Tente outro código ou nome.</p>";
}

/* ---------- Abas ---------- */
document.querySelectorAll("[data-aba]").forEach((b) => {
  b.onclick = () => {
    aba = b.dataset.aba;
    document.querySelectorAll("[data-aba]").forEach((x) => x.setAttribute("aria-selected", x === b));
    desenha();
  };
});
if ($("#busca")) { $("#busca").oninput = desenha; desenha(); }

/* ---------- Carrossel ---------- */
const slides = document.querySelectorAll(".slide");
if (slides.length) {
  let i = 0;
  const mostra = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("ativo", k === i));
    $("#pos").textContent = `${i + 1} / ${slides.length}`;
  };
  $("#prev").onclick = () => mostra(i - 1);
  $("#next").onclick = () => mostra(i + 1);
  setInterval(() => mostra(i + 1), 6000);
}

/* ---------- Formulários (validação simples) ---------- */
function valida(form, aviso, ok) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const campos = [...form.querySelectorAll("[required]")];
    const vazio = campos.find((c) => !c.value.trim() || (c.type === "email" && !c.value.includes("@")));
    const r = form.querySelector("#retorno");
    if (vazio) { r.textContent = aviso; vazio.focus(); return; }
    r.textContent = ok; form.reset();
  });
}
if ($("#formContato")) valida($("#formContato"), "Preencha todos os campos com um e-mail válido.", "Mensagem enviada! (simulação, nenhum dado foi salvo)");
if ($("#formLogin")) valida($("#formLogin"), "Informe um e-mail válido e a senha.", "Login realizado! (simulação, sem servidor)");
