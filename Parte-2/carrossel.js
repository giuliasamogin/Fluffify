/* =========================================================
   FLUFFIFY
   CARROSSEL PRINCIPAL DA HOME
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const containerSlides =
        document.querySelector(".carrossel-slides");

    const btnPrev =
        document.querySelector(".carousel-btn.prev");

    const btnNext =
        document.querySelector(".carousel-btn.next");

    const dotsContainer =
        document.querySelector(".carousel-dots");

    if (!containerSlides) {
        return;
    }

    const slides = Array.from(
        containerSlides.querySelectorAll(
            ".clickable-banner-slide"
        )
    );

    if (slides.length < 2) {
        return;
    }

    let slideAtual = 0;

    const tempoTroca = 4000;

    let timer = null;

    /* -----------------------------------------------------
       CRIA AS BOLINHAS
       ----------------------------------------------------- */

    if (dotsContainer) {

        slides.forEach((_, index) => {

            const dot =
                document.createElement("button");

            dot.type = "button";

            dot.className = "carousel-dot";

            dot.setAttribute(
                "aria-label",
                `Ir para o banner ${index + 1}`
            );

            dot.addEventListener("click", () => {

                slideAtual = index;

                mostrarSlide(slideAtual);

                iniciarAutoplay();

            });

            dotsContainer.appendChild(dot);
        });
    }

    /* -----------------------------------------------------
       MOSTRA UM SLIDE
       ----------------------------------------------------- */

    function mostrarSlide(index) {

        slides.forEach((slide, i) => {

            slide.classList.toggle(
                "ativo",
                i === index
            );

        });

        if (dotsContainer) {

            const dots =
                dotsContainer.querySelectorAll(
                    ".carousel-dot"
                );

            dots.forEach((dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === index
                );

            });
        }
    }

    /* -----------------------------------------------------
       PRÓXIMO
       ----------------------------------------------------- */

    function proximoSlide() {

        slideAtual =
            (slideAtual + 1) % slides.length;

        mostrarSlide(slideAtual);
    }

    /* -----------------------------------------------------
       ANTERIOR
       ----------------------------------------------------- */

    function slideAnterior() {

        slideAtual =
            (slideAtual - 1 + slides.length)
            % slides.length;

        mostrarSlide(slideAtual);
    }

    /* -----------------------------------------------------
       AUTOPLAY
       ----------------------------------------------------- */

    function iniciarAutoplay() {

        pararAutoplay();

        timer = setInterval(
            proximoSlide,
            tempoTroca
        );
    }

    function pararAutoplay() {

        if (timer !== null) {

            clearInterval(timer);

            timer = null;
        }
    }

    /* -----------------------------------------------------
       BOTÃO PRÓXIMO
       ----------------------------------------------------- */

    if (btnNext) {

        btnNext.addEventListener(
            "click",
            () => {

                proximoSlide();

                iniciarAutoplay();
            }
        );
    }

    /* -----------------------------------------------------
       BOTÃO ANTERIOR
       ----------------------------------------------------- */

    if (btnPrev) {

        btnPrev.addEventListener(
            "click",
            () => {

                slideAnterior();

                iniciarAutoplay();
            }
        );
    }

    /* -----------------------------------------------------
       PAUSA QUANDO O MOUSE ESTÁ SOBRE O BANNER
       ----------------------------------------------------- */

    containerSlides.addEventListener(
        "mouseenter",
        pararAutoplay
    );

    containerSlides.addEventListener(
        "mouseleave",
        iniciarAutoplay
    );

    /* -----------------------------------------------------
       TOUCH / CELULAR
       ----------------------------------------------------- */

    let touchStartX = 0;

    let touchEndX = 0;

    containerSlides.addEventListener(
        "touchstart",
        (event) => {

            touchStartX =
                event.changedTouches[0].screenX;

            pararAutoplay();
        },
        { passive: true }
    );

    containerSlides.addEventListener(
        "touchend",
        (event) => {

            touchEndX =
                event.changedTouches[0].screenX;

            const distancia =
                touchEndX - touchStartX;

            if (Math.abs(distancia) > 50) {

                if (distancia < 0) {

                    proximoSlide();

                } else {

                    slideAnterior();
                }
            }

            iniciarAutoplay();
        },
        { passive: true }
    );

    /* -----------------------------------------------------
       INICIALIZA
       ----------------------------------------------------- */

    mostrarSlide(0);

    iniciarAutoplay();

});