// Fluffify — núcleo do site. Tudo é simulado com LocalStorage.
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const brl=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugPath=location.pathname.split('/').pop();
function cart(){try{return JSON.parse(localStorage.getItem('fluffify_cart'))||[]}catch{return[]}}
function saveCart(c){localStorage.setItem('fluffify_cart',JSON.stringify(c));updateBadge()}
function updateBadge(){const n=cart().reduce((a,x)=>a+x.qty,0); $$('.cart-badge').forEach(e=>e.textContent=n)}
function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2600)}
function addToCart(slug){const p=ANIMAIS.find(x=>x.slug===slug);if(!p)return;let c=cart(),i=c.findIndex(x=>x.slug===slug);i>=0?c[i].qty++:c.push({slug:p.slug,name:p.nome,price:p.preco,image:p.imagem,qty:1});saveCart(c);toast(`${p.nome} foi para o carrinho ✦`)}
function updateQty(slug,d){let c=cart(),i=c.findIndex(x=>x.slug===slug);if(i<0)return;c[i].qty+=d;if(c[i].qty<=0)c.splice(i,1);saveCart(c);renderCart()}
function removeItem(slug){saveCart(cart().filter(x=>x.slug!==slug));renderCart();toast('Item removido.')}
function renderCart(){const box=$('#cart-items');if(!box)return;let c=cart();if(!c.length){box.innerHTML='<div class="empty"><div style="font-size:42px"></div><h3>Seu carrinho está vazio</h3><p>Escolha um amiguinho para começar sua simulação.</p><a class="btn soft" href="todos-os-pets.html">Explorar filhotes</a></div>';$('#cart-summary').innerHTML='';return}box.innerHTML=c.map(x=>`<div class="cart-row"><img src="${esc(x.image)}" alt="${esc(x.name)}" onerror="imgFallback(this,'${esc(x.name)}')"><div><strong>${esc(x.name)}</strong><div class="muted">${brl(parsePrice(x.price))} cada</div><div class="qty"><button onclick="updateQty('${x.slug}',-1)">−</button><span>${x.qty}</span><button onclick="updateQty('${x.slug}',1)">+</button><button class="header-action" onclick="removeItem('${x.slug}')">Remover</button></div></div><strong class="row-total">${brl(parsePrice(x.price)*x.qty)}</strong></div>`).join('');const subtotal=c.reduce((a,x)=>a+parsePrice(x.price)*x.qty,0);const frete=subtotal?39:0;$('#cart-summary').innerHTML=`<div class="summary-line"><span>Subtotal</span><strong>${brl(subtotal)}</strong></div><div class="summary-line"><span>Frete simulado</span><strong>${brl(frete)}</strong></div><div class="summary-line" style="font-size:20px"><span>Total</span><strong>${brl(subtotal+frete)}</strong></div><button class="btn" style="width:100%;margin-top:15px" onclick="checkout()">Finalizar simulação</button>`}function parsePrice(v){if(typeof v==='number')return v;return Number(String(v).replace(/R\$\s?/,'').replace(/\./g,'').replace(',','.'))||0}
function checkout(){if(!cart().length)return toast('Seu carrinho está vazio.');let orders=JSON.parse(localStorage.getItem('fluffify_orders')||'[]');orders.unshift({id:'FLF-'+Date.now().toString().slice(-6),date:new Date().toLocaleString('pt-BR'),items:cart(),total:cart().reduce((a,x)=>a+parsePrice(x.price)*x.qty,0)+39});localStorage.setItem('fluffify_orders',JSON.stringify(orders));localStorage.removeItem('fluffify_cart');updateBadge();renderCart();toast('Pedido fictício realizado com sucesso!')}
function renderPets(list,box){box.innerHTML=list.map(p=>`<article class="card"><img class="pet-img" src="${esc(p.imagem)}" alt="${esc(p.nome)}" onerror="imgFallback(this,'${esc(p.nome)}')"><div class="card-body"><span class="tag">${esc(p.categoria)}</span><h3>${esc(p.nome)}</h3><div class="muted">${esc(p.idade)} · ${esc(p.sexo)}</div><div class="price">${esc(p.preco)}</div><div class="card-actions"><a class="btn soft" href="animais/${p.slug}.html">Detalhes</a><button class="btn" onclick="addToCart('${p.slug}')">Comprar</button></div></div></article>`).join('')}
function setupListing(){const box=$('#pet-grid');if(!box)return;let category=$('#pet-page')?.dataset.category||'Todos';let list=category==='Todos'?ANIMAIS:ANIMAIS.filter(x=>x.categoria===category);const input=$('#pet-search'),select=$('#pet-sort');const apply=()=>{let q=(input?.value||'').toLowerCase();let a=list.filter(p=>p.nome.toLowerCase().includes(q));if(select?.value==='price')a.sort((x,y)=>parsePrice(x.preco)-parsePrice(y.preco));if(select?.value==='name')a.sort((x,y)=>x.nome.localeCompare(y.nome));renderPets(a,box)};input?.addEventListener('input',apply);select?.addEventListener('change',apply);apply()}
function renderDetail(){const el=$('#pet-detail');if(!el)return;let slug=el.dataset.slug,p=ANIMAIS.find(x=>x.slug===slug);if(!p)return;document.title=`${p.nome} — Fluffify`;const imgPath=location.pathname.includes('/animais/')?'../'+p.imagem:p.imagem;el.innerHTML=`<div class="pet-detail-media"><img src="${esc(imgPath)}" alt="${esc(p.nome)}" onerror="imgFallback(this,'${esc(p.nome)}')"></div><div><span class="tag">${esc(p.categoria)}</span><h1>${esc(p.nome)}</h1><p class="muted" style="font-size:16px">${esc(p.descricao)}</p><div class="facts"><div class="fact"><strong>Idade</strong><span>${esc(p.idade)}</span></div><div class="fact"><strong>Sexo</strong><span>${esc(p.sexo)}</span></div><div class="fact"><strong>Vacina</strong><span>${esc(p.vacina)}</span></div><div class="fact"><strong>Pedigree</strong><span>${esc(p.pedigree)}</span></div></div><div style="font:400 34px Georgia,serif;margin:20px 0">${esc(p.preco)}</div><div class="card-actions"><button class="btn" onclick="addToCart('${p.slug}')">Adicionar ao carrinho</button><button class="btn soft" onclick="toggleFav('${p.slug}')"><i class="fa-solid fa-heart"></i> Favoritar</button></div><p class="muted" style="margin-top:20px">Projeto acadêmico: compra, cadastro e entrega são simulações.</p></div>`}
function toggleFav(slug){let f=JSON.parse(localStorage.getItem('fluffify_favs')||'[]');f=f.includes(slug)?f.filter(x=>x!==slug):[...f,slug];localStorage.setItem('fluffify_favs',JSON.stringify(f));toast(f.includes(slug)?'Adicionado aos favoritos ♥':'Removido dos favoritos.')}
function setupForms(){const reg=$('#register-form');reg?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(reg);localStorage.setItem('fluffify_user',JSON.stringify({name:fd.get('name'),email:fd.get('email')}));toast('Cadastro fictício realizado!');setTimeout(()=>location.href='index.html',700)});const login=$('#login-form');login?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(login);localStorage.setItem('fluffify_user',JSON.stringify({name:fd.get('name')||fd.get('email'),email:fd.get('email')}));toast('Login fictício realizado!');setTimeout(()=>location.href='index.html',700)});const contact=$('#contact-form');contact?.addEventListener('submit',e=>{e.preventDefault();contact.reset();toast('Mensagem enviada com sucesso! (simulação)')})}
function headerState(){updateBadge();const user=JSON.parse(localStorage.getItem('fluffify_user')||'null');$$('[data-auth-name]').forEach(e=>e.textContent=user?.name||'Entrar');$('#logout')?.addEventListener('click',()=>{localStorage.removeItem('fluffify_user');toast('Você saiu da conta fictícia.');setTimeout(()=>location.reload(),500)});$('#theme')?.addEventListener('click',()=>{let d=document.body.classList.toggle('dark');localStorage.setItem('fluffify_theme',d?'dark':'light')});if(localStorage.getItem('fluffify_theme')==='dark')document.body.classList.add('dark')}
function imgFallback(img,name){const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f1e4e7"/><stop offset="1" stop-color="#dce7df"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><circle cx="300" cy="270" r="125" fill="#fff" opacity=".75"/><text x="300" y="330" text-anchor="middle" font-family="Georgia" font-size="34" fill="#5d535a">${esc(name)}</text><text x="300" y="380" text-anchor="middle" font-family="Arial" font-size="22" fill="#8b7d85">foto da pasta midia</text></svg>`;img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg)}
function intro(){const i=$('#fluffifyIntro');if(!i)return;const done=sessionStorage.getItem('fluffify_intro_seen');if(done)i.remove();else{setTimeout(()=>{i.classList.add('hide');sessionStorage.setItem('fluffify_intro_seen','1');setTimeout(()=>i.remove(),1000)},5200)}$('#skipIntro')?.addEventListener('click',()=>{i.classList.add('hide');sessionStorage.setItem('fluffify_intro_seen','1');setTimeout(()=>i.remove(),500)})}
function paws(){document.addEventListener('click',e=>{const p=document.createElement('span');p.className='paw';p.textContent='✦';p.style.left=e.clientX+'px';p.style.top=e.clientY+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),900)},{passive:true})}
const questions=[['Como é sua rotina?',['Passo pouco tempo em casa','Estou sempre em casa','Sou bem ativo(a) e adoro sair','Depende do dia']],['Onde você mora?',['Apartamento pequeno','Casa com quintal','Espaço compacto e tranquilo','Casa ampla']],['O que mais te atrai?',['Independência','Companhia','Interação e curiosidade','Fofura em tamanho pequeno']]];
function quiz(){const b=$('#quiz-btn');if(!b)return;b.addEventListener('click',()=>{let i=0,s={Cães:0,Gatos:0,Aves:0,Roedores:0};const m=$('#modal'),body=$('#modal-body');m.classList.add('open');function q(){body.innerHTML=`<div class="modal-top"><h2>${questions[i][0]}</h2><button class="modal-close" onclick="closeModal()">×</button></div>`+questions[i][1].map((x,j)=>`<button class="quiz-option" data-j="${j}">${x}</button>`).join('');$$('.quiz-option',body).forEach((x,j)=>x.onclick=()=>{const points=[[2,1,0,1],[1,2,2,0],[0,2,1,2],[1,1,2,1]][j];['Cães','Gatos','Aves','Roedores'].forEach((k,n)=>s[k]+=points[n]);i++;i<questions.length?q():result()})}function result(){let win=Object.entries(s).sort((a,b)=>b[1]-a[1])[0][0];body.innerHTML=`<div class="modal-top"><h2>Seu perfil combina com ${win} ✦</h2><button class="modal-close" onclick="closeModal()">×</button></div><p>Esse resultado é uma brincadeira baseada nas suas respostas. Explore a categoria e veja os filhotes disponíveis.</p><a class="btn" href="${win==='Cães'?'caes.html':win==='Gatos'?'gatos.html':win==='Aves'?'aves.html':'roedores.html'}">Ver ${win}</a>`}q()})}
function closeModal(){$('#modal')?.classList.remove('open')}
document.addEventListener('DOMContentLoaded',()=>{headerState();setupListing();renderDetail();renderCart();setupForms();intro();paws();quiz()});

/* ============================================================
   FLUFFIFY — EXPERIÊNCIA EXTRA 2.0
   Funcionalidades:
   • Quiz "Qual pet combina comigo?"
   • Popups de adoções recentes
   • Curiosidades flutuantes
   • Voltar ao topo
   • Brilhos/patinhas discretos
   • Cupom de desconto
   • Frete simulado por CEP
   • Histórico de pedidos
   • Favoritos
   • Pet do dia
   • Simulador de custo mensal
   • Barra de progresso da compra
============================================================ */

(function () {

    "use strict";

    /* =========================================================
       UTILITÁRIOS
    ========================================================= */

    const ffGet = (key, fallback) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    };

    const ffSet = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const ffMoney = value =>
        Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    const ffPage = location.pathname.split("/").pop() || "index.html";


    /* =========================================================
       1. VOLTAR AO TOPO
    ========================================================= */

    function ffCriarTopo() {

        if (document.getElementById("ff-voltar-topo")) return;

        const botao = document.createElement("button");

        botao.id = "ff-voltar-topo";
        botao.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        botao.title = "Voltar ao topo";
        botao.setAttribute("aria-label", "Voltar ao topo");

        document.body.appendChild(botao);

        window.addEventListener("scroll", () => {

            if (window.scrollY > 450) {
                botao.classList.add("visivel");
            } else {
                botao.classList.remove("visivel");
            }

        });

        botao.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });
    }


    /* =========================================================
       2. CURIOSIDADES FLUTUANTES
    ========================================================= */

    const ffCuriosidades = [

        "🐱 Gatos podem dormir até 16 horas por dia.",
        "🐶 O olfato dos cães é extremamente desenvolvido.",
        "🐰 Os dentes dos coelhos crescem durante toda a vida.",
        "🦜 Algumas aves conseguem aprender sons e palavras.",
        "🐹 Hamsters usam bolsas nas bochechas para transportar comida.",
        "✨ Filhotes precisam de bastante sono para crescer.",
        "🐾 Cada pet possui uma personalidade completamente diferente."
    ];

    function ffCriarCuriosidades() {

        if (document.getElementById("ff-curiosidade")) return;

        const botao = document.createElement("button");

        botao.id = "ff-curiosidade";
        botao.innerHTML = `
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Curiosidade</span>
        `;

        const caixa = document.createElement("div");

        caixa.id = "ff-curiosidade-box";
        caixa.innerHTML = `
            <button class="ff-curiosidade-fechar">×</button>
            <div class="ff-curiosidade-icone">
                <i class="fa-solid fa-paw"></i>
            </div>
            <strong>Você sabia?</strong>
            <p></p>
        `;

        document.body.appendChild(botao);
        document.body.appendChild(caixa);

        botao.addEventListener("click", () => {

            const texto =
                ffCuriosidades[
                    Math.floor(Math.random() * ffCuriosidades.length)
                ];

            caixa.querySelector("p").textContent = texto;

            caixa.classList.add("aberta");

        });

        caixa
            .querySelector(".ff-curiosidade-fechar")
            .addEventListener("click", () => {
                caixa.classList.remove("aberta");
            });
    }


    /* =========================================================
       3. POPUPS DE ADOÇÕES RECENTES
    ========================================================= */

    const ffAdotantes = [
        ["Mariana S.", "São Paulo", "Gatinho Mel"],
        ["Carlos R.", "Campinas", "Bidu"],
        ["Beatriz L.", "Santos", "Coelhinho"],
        ["Lucas M.", "Sorocaba", "Rajadinho"],
        ["Camila P.", "Jundiaí", "Pipoca"],
        ["Gabriel T.", "Rio de Janeiro", "Cinzinha"],
        ["Juliana K.", "Curitiba", "Frajolinha"],
        ["Rafael B.", "Belo Horizonte", "Bolota"]
    ];

    function ffPopupAdocao() {

        if (document.getElementById("ff-adocao-popup")) return;

        const popup = document.createElement("div");

        popup.id = "ff-adocao-popup";

        popup.innerHTML = `
            <div class="ff-popup-icone">
                <i class="fa-solid fa-heart"></i>
            </div>

            <div class="ff-popup-texto">
                <small>adoção recente</small>
                <strong></strong>
                <span></span>
            </div>

            <button aria-label="Fechar">×</button>
        `;

        document.body.appendChild(popup);

        popup.querySelector("button").addEventListener("click", () => {
            popup.classList.remove("mostrar");
        });

        function mostrar() {

            const pessoa =
                ffAdotantes[
                    Math.floor(Math.random() * ffAdotantes.length)
                ];

            popup.querySelector("strong").textContent =
                pessoa[0] + " adotou!";

            popup.querySelector("span").textContent =
                pessoa[2] + " · " + pessoa[1];

            popup.classList.add("mostrar");

            setTimeout(() => {
                popup.classList.remove("mostrar");
            }, 6000);
        }

        setTimeout(mostrar, 5000);

        setInterval(mostrar, 18000);
    }


    /* =========================================================
       4. QUIZ — QUAL PET COMBINA COM VOCÊ?
    ========================================================= */

    const ffPerguntas = [

        {
            pergunta: "Como é sua rotina?",
            respostas: [
                ["Passo bastante tempo fora de casa", { gato: 3, roedor: 1 }],
                ["Fico bastante em casa", { gato: 1, ave: 2 }],
                ["Sou muito ativo e adoro sair", { cao: 3 }],
                ["Minha rotina varia bastante", { gato: 1, ave: 1, roedor: 1 }]
            ]
        },

        {
            pergunta: "Onde você mora?",
            respostas: [
                ["Apartamento pequeno", { gato: 2, roedor: 2, ave: 1 }],
                ["Apartamento espaçoso", { gato: 2, ave: 1 }],
                ["Casa com quintal", { cao: 3 }],
                ["Casa sem quintal", { gato: 1, cao: 1 }]
            ]
        },

        {
            pergunta: "O que você procura em um pet?",
            respostas: [
                ["Companhia tranquila", { gato: 3 }],
                ["Muito carinho e interação", { cao: 3 }],
                ["Algo pequeno e curioso", { roedor: 3 }],
                ["Um companheiro que cante e interaja", { ave: 3 }]
            ]
        },

        {
            pergunta: "Quanto tempo você gostaria de dedicar às brincadeiras?",
            respostas: [
                ["Pouco, mas com bastante carinho", { gato: 2 }],
                ["Bastante! Quero brincar todos os dias", { cao: 3 }],
                ["Alguns momentos ao longo do dia", { roedor: 2 }],
                ["Quero interagir bastante", { ave: 2, cao: 1 }]
            ]
        }

    ];

    const ffResultados = {

        gato: {
            titulo: "🐱 Um gatinho pode combinar muito com seu estilo!",
            texto: "Você parece gostar de companhia, carinho e momentos tranquilos.",
            link: "gatos.html"
        },

        cao: {
            titulo: "🐶 Um cachorrinho pode combinar com você!",
            texto: "Sua rotina parece combinar com um companheiro ativo e muito interativo.",
            link: "caes.html"
        },

        ave: {
            titulo: "🦜 Uma avezinha pode ser seu match!",
            texto: "Você parece gostar de interação, personalidade e muita presença.",
            link: "aves.html"
        },

        roedor: {
            titulo: "🐹 Um pequeno roedor pode ser seu match!",
            texto: "Você parece gostar de pets pequenos, curiosos e cheios de personalidade.",
            link: "roedores.html"
        }

    };

    function ffModal(titulo, conteudo) {

        const antigo = document.getElementById("ff-modal");

        if (antigo) antigo.remove();

        const modal = document.createElement("div");

        modal.id = "ff-modal";

        modal.innerHTML = `
            <div class="ff-modal-card">

                <button class="ff-modal-close">×</button>

                <span class="ff-modal-eyebrow">
                    FLUFFIFY EXPERIENCE
                </span>

                <h2>${titulo}</h2>

                <div class="ff-modal-content">
                    ${conteudo}
                </div>

            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener("click", e => {

            if (e.target === modal) {
                modal.remove();
            }

        });

        modal
            .querySelector(".ff-modal-close")
            .addEventListener("click", () => modal.remove());

        return modal.querySelector(".ff-modal-content");
    }


    function ffAbrirQuiz() {

        let atual = 0;

        const pontos = {
            gato: 0,
            cao: 0,
            ave: 0,
            roedor: 0
        };

        function pergunta() {

            const p = ffPerguntas[atual];

            const corpo = ffModal(
                "Qual pet combina com você?",
                `
                <div class="ff-quiz-progress">
                    ${atual + 1} de ${ffPerguntas.length}
                </div>

                <h3 class="ff-quiz-pergunta">
                    ${p.pergunta}
                </h3>

                <div class="ff-quiz-opcoes"></div>
                `
            );

            const lista = corpo.querySelector(".ff-quiz-opcoes");

            p.respostas.forEach(resposta => {

                const botao = document.createElement("button");

                botao.className = "ff-quiz-opcao";
                botao.textContent = resposta[0];

                botao.addEventListener("click", () => {

                    Object.entries(resposta[1]).forEach(
                        ([tipo, valor]) => {
                            pontos[tipo] += valor;
                        }
                    );

                    atual++;

                    if (atual < ffPerguntas.length) {
                        pergunta();
                    } else {
                        resultado();
                    }

                });

                lista.appendChild(botao);

            });
        }


        function resultado() {

            const vencedor = Object.keys(pontos)
                .sort((a, b) => pontos[b] - pontos[a])[0];

            const r = ffResultados[vencedor];

            const corpo = ffModal(
                "Seu resultado ✦",
                `
                <div class="ff-resultado-icon">
                    ${r.titulo.substring(0, 2)}
                </div>

                <h3>${r.titulo}</h3>

                <p>${r.texto}</p>

                <div class="ff-resultado-botoes">

                    <a href="${r.link}" class="btn">
                        Ver filhotes
                    </a>

                    <button
                        class="btn soft"
                        id="ff-refazer-quiz">
                        Refazer quiz
                    </button>

                </div>
                `
            );

            corpo
                .querySelector("#ff-refazer-quiz")
                .addEventListener("click", ffAbrirQuiz);
        }

        pergunta();
    }


    /* =========================================================
       5. ATIVAR O QUIZ NO BOTÃO DO NOVO INDEX
    ========================================================= */

    function ffAtivarQuiz() {

        const botao = document.getElementById("quiz-btn");

        if (botao) {
            botao.addEventListener("click", ffAbrirQuiz);
        }

    }


    /* =========================================================
       6. CUPOM DE DESCONTO
    ========================================================= */

    const ffCupons = {
        FLUFFY10: 0.10,
        BEMVINDO5: 0.05,
        AMIGUINHO15: 0.15
    };

    function ffAplicarCupom() {

        const input = document.getElementById("ff-cupom");

        if (!input) return;

        const codigo = input.value
            .trim()
            .toUpperCase();

        const mensagem =
            document.getElementById("ff-cupom-msg");

        if (!ffCupons[codigo]) {

            mensagem.textContent =
                "Cupom inválido ou expirado.";

            mensagem.className = "ff-erro";

            return;
        }

        localStorage.setItem(
            "fluffify_cupom",
            codigo
        );

        mensagem.textContent =
            `Cupom ${codigo} aplicado!`;

        mensagem.className = "ff-ok";

        if (typeof renderCart === "function") {
            renderCart();
        }

    }


    /* =========================================================
       7. FRETE POR CEP
    ========================================================= */

    function ffFreteUF(uf) {

        if (uf === "SP") {
            return {
                valor: 15,
                prazo: "2 a 4 dias úteis"
            };
        }

        if (["RJ", "MG", "ES"].includes(uf)) {
            return {
                valor: 25,
                prazo: "3 a 6 dias úteis"
            };
        }

        if (["PR", "SC", "RS", "DF", "GO", "MS", "MT"].includes(uf)) {
            return {
                valor: 35,
                prazo: "4 a 8 dias úteis"
            };
        }

        return {
            valor: 45,
            prazo: "6 a 12 dias úteis"
        };
    }


    async function ffCalcularFrete() {

        const input = document.getElementById("ff-cep");

        const mensagem =
            document.getElementById("ff-frete-msg");

        if (!input || !mensagem) return;

        const cep = input.value
            .replace(/\D/g, "");

        if (cep.length !== 8) {

            mensagem.textContent =
                "Digite um CEP válido com 8 números.";

            mensagem.className = "ff-erro";

            return;
        }

        mensagem.textContent =
            "Calculando frete...";

        try {

            const resposta =
                await fetch(
                    `https://viacep.com.br/ws/${cep}/json/`
                );

            const dados =
                await resposta.json();

            if (dados.erro) {
                throw new Error();
            }

            const regra =
                ffFreteUF(dados.uf);

            const frete = {
                cep,
                cidade: dados.localidade,
                uf: dados.uf,
                valor: regra.valor,
                prazo: regra.prazo
            };

            ffSet("fluffify_frete", frete);

            mensagem.className = "ff-ok";

            mensagem.textContent =
                `${dados.localidade}/${dados.uf} · ` +
                `${ffMoney(regra.valor)} · ` +
                `${regra.prazo}`;

            if (typeof renderCart === "function") {
                renderCart();
            }

        } catch {

            mensagem.className = "ff-erro";

            mensagem.textContent =
                "Não conseguimos consultar o CEP. Tente novamente.";
        }
    }


    /* =========================================================
       8. HISTÓRICO DE PEDIDOS
    ========================================================= */

    function ffAbrirPedidos() {

        const pedidos =
            ffGet("fluffify_pedidos", []);

        let html = "";

        if (!pedidos.length) {

            html = `
                <div class="ff-vazio">
                    <div>🐾</div>
                    <h3>Nenhum pedido ainda</h3>
                    <p>
                        Seus pedidos fictícios aparecerão aqui
                        depois de uma compra simulada.
                    </p>
                </div>
            `;

        } else {

            html = pedidos.map(pedido => `

                <div class="ff-pedido">

                    <div class="ff-pedido-topo">
                        <strong>${pedido.numero}</strong>
                        <span>${pedido.data}</span>
                    </div>

                    <ul>
                        ${pedido.itens.map(item => `
                            <li>
                                ${item.qty}x ${item.name}
                                — ${ffMoney(
                                    Number(item.price) * item.qty
                                )}
                            </li>
                        `).join("")}
                    </ul>

                    <div class="ff-pedido-total">
                        Total:
                        <strong>
                            ${ffMoney(pedido.total)}
                        </strong>
                    </div>

                </div>

            `).join("");

        }

        ffModal(
            "Meus pedidos",
            html
        );
    }


    /* =========================================================
       9. BOTÃO DE PEDIDOS
    ========================================================= */

    function ffBotaoPedidos() {

        const ferramentas =
            document.querySelector(".header-tools");

        if (!ferramentas) return;

        if (
            document.getElementById(
                "ff-pedidos"
            )
        ) return;

        const botao =
            document.createElement("button");

        botao.id = "ff-pedidos";
        botao.className = "header-action";
        botao.title = "Meus pedidos";

        botao.innerHTML =
            '<i class="fa-solid fa-receipt"></i>' +
            '<span class="label">Pedidos</span>';

        ferramentas.insertBefore(
            botao,
            ferramentas.firstChild
        );

        botao.addEventListener(
            "click",
            ffAbrirPedidos
        );
    }


    /* =========================================================
       10. PET DO DIA
       NOVA FUNÇÃO
    ========================================================= */

    function ffPetDoDia() {

        if (
            !window.ANIMAIS ||
            document.getElementById("ff-pet-dia")
        ) return;

        const pet =
            ANIMAIS[
                new Date().getDate() %
                ANIMAIS.length
            ];

        const secao =
            document.createElement("section");

        secao.id = "ff-pet-dia";

        const imagem =
            location.pathname.includes("/animais/")
                ? "../" + pet.imagem
                : pet.imagem;

        secao.innerHTML = `

            <div class="ff-pet-dia-imagem">
                <img
                    src="${imagem}"
                    alt="${pet.nome}">
            </div>

            <div class="ff-pet-dia-texto">

                <span class="eyebrow">
                    seleção especial · hoje
                </span>

                <h2>
                    Pet do dia:
                    <strong>${pet.nome}</strong>
                </h2>

                <p>
                    Hoje o Fluffify escolheu
                    um amiguinho especial para
                    você conhecer.
                </p>

                <a
                    class="btn"
                    href="animais/${pet.slug}.html">
                    Conhecer ${pet.nome}
                </a>

            </div>

        `;

        const main =
            document.querySelector("main");

        if (main) {
            main.appendChild(secao);
        }
    }


    /* =========================================================
       11. SIMULADOR DE CUSTO MENSAL
       NOVA FUNÇÃO
    ========================================================= */

    function ffSimulador() {

        if (
            document.getElementById(
                "ff-simulador"
            )
        ) return;

        const main =
            document.querySelector("main");

        if (!main) return;

        const secao =
            document.createElement("section");

        secao.id = "ff-simulador";

        secao.innerHTML = `

            <div class="ff-simulador-card">

                <span class="eyebrow">
                    planejador Fluffify
                </span>

                <h2>
                    Quanto custa cuidar
                    de um amiguinho?
                </h2>

                <p>
                    Uma estimativa fictícia para
                    você brincar de planejar sua
                    nova rotina.
                </p>

                <div class="ff-simulador-grid">

                    <label>
                        Tipo de pet

                        <select id="ff-tipo-custo">

                            <option value="gato">
                                🐱 Gato
                            </option>

                            <option value="cao">
                                🐶 Cachorro
                            </option>

                            <option value="ave">
                                🦜 Ave
                            </option>

                            <option value="roedor">
                                🐹 Roedor
                            </option>

                        </select>
                    </label>

                    <label>
                        Porte / rotina

                        <select id="ff-nivel-custo">

                            <option value="basico">
                                Básico
                            </option>

                            <option value="completo">
                                Completo
                            </option>

                            <option value="premium">
                                Completo + extras
                            </option>

                        </select>
                    </label>

                </div>

                <div
                    class="ff-simulador-resultado"
                    id="ff-custo-resultado">
                </div>

            </div>
        `;

        main.appendChild(secao);

        const valores = {

            gato: {
                basico: 180,
                completo: 280,
                premium: 420
            },

            cao: {
                basico: 250,
                completo: 380,
                premium: 550
            },

            ave: {
                basico: 120,
                completo: 190,
                premium: 280
            },

            roedor: {
                basico: 100,
                completo: 150,
                premium: 220
            }

        };

        function calcular() {

            const tipo =
                document.getElementById(
                    "ff-tipo-custo"
                ).value;

            const nivel =
                document.getElementById(
                    "ff-nivel-custo"
                ).value;

            const valor =
                valores[tipo][nivel];

            document.getElementById(
                "ff-custo-resultado"
            ).innerHTML = `

                <span>
                    estimativa mensal fictícia
                </span>

                <strong>
                    ${ffMoney(valor)}
                </strong>

                <small>
                    alimentação + cuidados básicos +
                    rotina estimada
                </small>
            `;
        }

        document
            .getElementById("ff-tipo-custo")
            .addEventListener(
                "change",
                calcular
            );

        document
            .getElementById("ff-nivel-custo")
            .addEventListener(
                "change",
                calcular
            );

        calcular();
    }


    /* =========================================================
       12. INICIALIZAÇÃO
    ========================================================= */

    function ffInicializar() {

        ffCriarTopo();

        ffCriarCuriosidades();

        ffPopupAdocao();

        ffAtivarQuiz();

        ffBotaoPedidos();

        /*
         * Os dois recursos novos ficam somente
         * na home para não poluir as páginas internas.
         */

        if (
            ffPage === "index.html" ||
            ffPage === ""
        ) {

            ffPetDoDia();

            ffSimulador();
        }

    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            ffInicializar
        );

    } else {

        ffInicializar();

    }

})();

/* ============================================================
   CUPOM + HISTÓRICO DE PEDIDOS
   COLE ESTE BLOCO NO FINAL DO script.js (depois da última linha)
   Ele refaz as funções renderCart e checkout. Como vem por
   último, o navegador usa estas versões no lugar das antigas.
============================================================ */

/* cupons que existem (o nome tem que ser digitado em maiúsculas ou minúsculas, tanto faz) */
const CUPONS = {
    FLUFFY10: { valor: 10, texto: '10% de desconto' }
};

/* qual cupom está aplicado agora (fica salvo no navegador) */
function getCupom() {
    const cod = localStorage.getItem('fluffify_coupon');
    return cod && CUPONS[cod] ? cod : null;
}

/* calcula subtotal, desconto, frete e total */
function calcTotais() {
    const c = cart();
    const subtotal = c.reduce((a, x) => a + parsePrice(x.price) * x.qty, 0);
    const cupom = getCupom();
    const desconto = cupom ? Math.round(subtotal * CUPONS[cupom].valor) / 100 : 0;
    const frete = subtotal ? 39 : 0;
    return { subtotal, desconto, frete, cupom, total: subtotal - desconto + frete };
}

function aplicarCupom() {
    const campo = $('#cupom-input');
    const cod = (campo ? campo.value : '').trim().toUpperCase();
    if (!cod) return toast('Digite um cupom.');
    if (!CUPONS[cod]) {
        localStorage.removeItem('fluffify_coupon');
        renderCart();
        return toast('Cupom inválido.');
    }
    localStorage.setItem('fluffify_coupon', cod);
    renderCart();
    toast('Cupom ' + cod + ' aplicado: ' + CUPONS[cod].texto + '!');
}

function removerCupom() {
    localStorage.removeItem('fluffify_coupon');
    renderCart();
    toast('Cupom removido.');
}

/* carrinho: mesma aparência de antes, mas com cupom e desconto no resumo */
function renderCart() {
    const box = $('#cart-items');
    if (!box) return;
    const resumo = $('#cart-summary');
    const c = cart();

    if (!c.length) {
        box.innerHTML = '<div class="empty"><div style="font-size:42px"></div><h3>Seu carrinho está vazio</h3><p>Escolha um amiguinho para começar sua simulação.</p><a class="btn soft" href="todos-os-pets.html">Explorar filhotes</a></div>';
        if (resumo) resumo.innerHTML = '';
        return;
    }

    box.innerHTML = c.map(x =>
        `<div class="cart-row"><img src="${esc(x.image)}" alt="${esc(x.name)}" onerror="imgFallback(this,'${esc(x.name)}')"><div><strong>${esc(x.name)}</strong><div class="muted">${brl(parsePrice(x.price))} cada</div><div class="qty"><button onclick="updateQty('${x.slug}',-1)">−</button><span>${x.qty}</span><button onclick="updateQty('${x.slug}',1)">+</button><button class="header-action" onclick="removeItem('${x.slug}')">Remover</button></div></div><strong class="row-total">${brl(parsePrice(x.price) * x.qty)}</strong></div>`
    ).join('');

    if (!resumo) return;
    const t = calcTotais();

    const cupomHtml = t.cupom
        ? `<div class="summary-line"><span>Cupom ${t.cupom}</span><strong style="color:#4f8a68">− ${brl(t.desconto)}</strong></div><button class="btn outline" style="margin:6px 0 10px" onclick="removerCupom()">Remover cupom</button>`
        : `<div class="fx-cupom-box"><input id="cupom-input" placeholder="Cupom de desconto" onkeydown="if(event.key==='Enter')aplicarCupom()"><button type="button" onclick="aplicarCupom()">Aplicar</button></div>`;

    resumo.innerHTML =
        `<div class="summary-line"><span>Subtotal</span><strong>${brl(t.subtotal)}</strong></div>` +
        cupomHtml +
        `<div class="summary-line"><span>Frete simulado</span><strong>${brl(t.frete)}</strong></div>` +
        `<div class="summary-line" style="font-size:20px"><span>Total</span><strong>${brl(t.total)}</strong></div>` +
        `<button class="btn" style="width:100%;margin-top:15px" onclick="checkout()">Finalizar simulação</button>`;
}

/* finalizar: salva o pedido no histórico (com desconto) e limpa o carrinho */
function checkout() {
    const c = cart();
    if (!c.length) return toast('Seu carrinho está vazio.');
    const t = calcTotais();

    let pedidos;
    try { pedidos = JSON.parse(localStorage.getItem('fluffify_orders') || '[]'); }
    catch { pedidos = []; }

    pedidos.unshift({
        id: 'FLF-' + Date.now().toString().slice(-6),
        date: new Date().toLocaleString('pt-BR'),
        items: c,
        subtotal: t.subtotal,
        desconto: t.desconto,
        cupom: t.cupom,
        frete: t.frete,
        total: t.total
    });

    localStorage.setItem('fluffify_orders', JSON.stringify(pedidos));
    localStorage.removeItem('fluffify_cart');
    localStorage.removeItem('fluffify_coupon');
    updateBadge();
    renderCart();
    toast('Pedido fictício realizado com sucesso!');
}