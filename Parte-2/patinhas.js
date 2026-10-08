/* FLUFFIFY — efeito decorativo de patinhas no clique. */
document.addEventListener('click',e=>{
 const el=document.createElement('span'); el.className='paw-pop'; el.textContent='';
 el.style.left=e.clientX+'px'; el.style.top=e.clientY+'px';
 document.body.appendChild(el); setTimeout(()=>el.remove(),800);
});


/* ============================================================
   FLUFFIFY — RASTRO DE BRILHOS
   Substitui as patinhas grandes por pequenos brilhos delicados.
============================================================ */

(function () {

    let ultimaX = 0;
    let ultimaY = 0;

    const distancia = 65;

    document.addEventListener("mousemove", function (event) {

        const dx = event.clientX - ultimaX;
        const dy = event.clientY - ultimaY;

        const distanciaPercorrida =
            Math.sqrt(dx * dx + dy * dy);

        if (distanciaPercorrida < distancia) {
            return;
        }

        ultimaX = event.clientX;
        ultimaY = event.clientY;

        const brilho =
            document.createElement("span");

        brilho.className =
            "ff-cursor-brilho";

        brilho.style.left =
            event.clientX + "px";

        brilho.style.top =
            event.clientY + "px";

        brilho.innerHTML =
            Math.random() > .45 ? "✦" : "·";

        document.body.appendChild(brilho);

        setTimeout(() => {
            brilho.remove();
        }, 900);

    });

})();