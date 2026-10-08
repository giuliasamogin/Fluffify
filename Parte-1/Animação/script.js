/* =========================================================
   FLUFFIFY — ANIMAÇÃO DA INTRO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const intro = document.getElementById("fluffify-intro");

    const cat = document.getElementById("cat");
    const head = document.getElementById("head");

    const leftEye = document.getElementById("eye-left");
    const rightEye = document.getElementById("eye-right");

    const raisedPaw = document.getElementById("raised-paw");
    const tongue = document.getElementById("tongue");

    const tail = document.querySelector(".tail");
    const shadow = document.querySelector(".cat-shadow");

    const welcome = document.getElementById("welcome-message");

    const lickEffect = document.getElementById("lick-effect");
    const lickShine = document.querySelector(".lick-shine");

    const flash = document.getElementById("white-flash");

    const cloud1 = document.querySelector(".cloud-1");
    const cloud2 = document.querySelector(".cloud-2");

    const sparkles = document.querySelectorAll(".sparkle");


    /* =====================================================
       CONFIGURAÇÃO
       ===================================================== */

    const tl = gsap.timeline();


    /* =====================================================
       ESTADO INICIAL
       ===================================================== */

    gsap.set(cat, {
        x: -260,
        y: 0,
        scale: 1,
        opacity: 1
    });

    gsap.set(head, {
        rotation: 0
    });

    gsap.set(raisedPaw, {
        opacity: 0,
        rotation: -25
    });

    gsap.set(tongue, {
        scaleY: 0
    });

    gsap.set(welcome, {
        opacity: 0,
        y: 20
    });

    gsap.set(lickEffect, {
        opacity: 0
    });

    gsap.set(flash, {
        opacity: 0
    });


    /* =====================================================
       FUNÇÃO — PISCAR
       ===================================================== */

    function blink() {

        const blinkTimeline = gsap.timeline();

        blinkTimeline
            .to([leftEye, rightEye], {
                scaleY: 0.08,
                duration: 0.09,
                ease: "power2.in"
            })
            .to([leftEye, rightEye], {
                scaleY: 1,
                duration: 0.12,
                ease: "power2.out"
            });

        return blinkTimeline;
    }


    /* =====================================================
       FUNÇÃO — RESPIRAÇÃO
       ===================================================== */

    function breathing() {

        return gsap.to(cat, {
            scaleY: 1.018,
            scaleX: 0.992,

            duration: 1.7,

            repeat: -1,
            yoyo: true,

            ease: "sine.inOut"
        });

    }


    /* =====================================================
       NUVENS
       ===================================================== */

    gsap.to(cloud1, {
        x: window.innerWidth + 500,

        duration: 28,

        repeat: -1,

        ease: "none"
    });

    gsap.to(cloud2, {
        x: -(window.innerWidth + 500),

        duration: 36,

        repeat: -1,

        ease: "none"
    });


    /* =====================================================
       ESTRELAS
       ===================================================== */

    sparkles.forEach((sparkle, index) => {

        gsap.to(sparkle, {
            opacity: 0.15,

            scale: 0.7,

            duration: 1.5 + index * 0.3,

            repeat: -1,

            yoyo: true,

            ease: "sine.inOut",

            delay: index * 0.4
        });

    });


    /* =====================================================
       COMEÇO DA ANIMAÇÃO
       ===================================================== */

    // Pequena pausa para o cenário aparecer.

    tl.to({}, {
        duration: 0.8
    });


    /* =====================================================
       GATO ENTRA
       ===================================================== */

    tl.to(cat, {

        x: window.innerWidth / 2 - 110,

        duration: 3.4,

        ease: "power2.out"

    });


    /* =====================================================
       PASSINHOS DURANTE A CAMINHADA
       ===================================================== */

    const walking = gsap.timeline();

    walking
        .to(cat, {
            y: -7,
            duration: .18,
            ease: "power1.out"
        })
        .to(cat, {
            y: 0,
            duration: .18,
            ease: "power1.in"
        })
        .to(cat, {
            y: -6,
            duration: .18,
            ease: "power1.out"
        })
        .to(cat, {
            y: 0,
            duration: .18,
            ease: "power1.in"
        })
        .to(cat, {
            y: -5,
            duration: .18,
            ease: "power1.out"
        })
        .to(cat, {
            y: 0,
            duration: .18,
            ease: "power1.in"
        })
        .to(cat, {
            y: -4,
            duration: .18,
            ease: "power1.out"
        })
        .to(cat, {
            y: 0,
            duration: .18,
            ease: "power1.in"
        });

    tl.add(walking, "-=3.1");


    /* =====================================================
       PARADA SUAVE
       ===================================================== */

    tl.to(cat, {

        x: window.innerWidth / 2 - 110,

        duration: .7,

        ease: "back.out(1.5)"

    });


    /* =====================================================
       PEQUENA OLHADA
       ===================================================== */

    tl.to(head, {

        rotation: -5,

        duration: .4,

        ease: "power2.out"

    });

    tl.to(head, {

        rotation: 5,

        duration: .7,

        ease: "sine.inOut"

    });

    tl.to(head, {

        rotation: 0,

        duration: .35,

        ease: "power2.out"

    });


    /* =====================================================
       SENTA
       ===================================================== */

    tl.to(cat, {

        scaleY: .88,
        scaleX: 1.06,

        y: 13,

        duration: .55,

        ease: "back.out(1.4)"

    });

    tl.to(shadow, {

        scaleX: 1.15,

        opacity: .7,

        duration: .45

    }, "<");


    /* =====================================================
       VOLTA UM POUCO
       ===================================================== */

    tl.to(cat, {

        scaleY: .93,
        scaleX: 1.03,

        duration: .25,

        ease: "power2.out"

    });


    /* =====================================================
       TEXTO APARECE
       ===================================================== */

    tl.to(welcome, {

        opacity: 1,

        y: 0,

        duration: .8,

        ease: "power3.out"

    }, "-=.1");


    /* =====================================================
       PISCADA
       ===================================================== */

    tl.add(blink());

    tl.to({}, {
        duration: .5
    });


    /* =====================================================
       PATA LEVANTA
       ===================================================== */

    tl.to(raisedPaw, {

        opacity: 1,

        duration: .25

    });

    tl.to(raisedPaw, {

        rotation: -8,

        y: -22,

        x: -8,

        duration: .6,

        ease: "back.out(1.7)"

    });


    /* =====================================================
       GATO OLHA PARA A PATINHA
       ===================================================== */

    tl.to(head, {

        rotation: -12,

        x: -5,

        duration: .45,

        ease: "power2.out"

    });


    /* =====================================================
       LÍNGUA SAI
       ===================================================== */

    tl.to(tongue, {

        scaleY: 1,

        duration: .28,

        ease: "back.out(1.8)"

    });


    /* =====================================================
       LAMBIDA DA PATINHA
       ===================================================== */

    tl.to(tongue, {

        x: -10,

        rotation: -15,

        duration: .25,

        ease: "power2.inOut"

    });

    tl.to(tongue, {

        x: 0,

        rotation: 0,

        duration: .25,

        ease: "power2.inOut"

    });


    /* =====================================================
       SEGUNDA LAMBIDA
       ===================================================== */

    tl.to(tongue, {

        x: -8,

        rotation: -12,

        duration: .22,

        ease: "power2.inOut"

    });

    tl.to(tongue, {

        x: 0,

        rotation: 0,

        duration: .22,

        ease: "power2.inOut"

    });


    /* =====================================================
       LÍNGUA SOME
       ===================================================== */

    tl.to(tongue, {

        scaleY: 0,

        duration: .2,

        ease: "power2.in"

    });


    /* =====================================================
       PATA DESCE
       ===================================================== */

    tl.to(raisedPaw, {

        rotation: -25,

        y: 0,

        x: 0,

        duration: .5,

        ease: "back.out(1.5)"

    });

    tl.to(raisedPaw, {

        opacity: 0,

        duration: .2

    });


    /* =====================================================
       VOLTA A OLHAR PARA A CÂMERA
       ===================================================== */

    tl.to(head, {

        rotation: 0,
        x: 0,

        duration: .5,

        ease: "power2.out"

    });


    /* =====================================================
       PAUSA
       ===================================================== */

    tl.add(blink());

    tl.to({}, {
        duration: .7
    });


    /* =====================================================
       GATO PERCEBE A CÂMERA
       ===================================================== */

    tl.to(head, {

        rotation: -5,

        duration: .25,

        ease: "power2.out"

    });

    tl.to(head, {

        rotation: 5,

        duration: .35,

        ease: "sine.inOut"

    });

    tl.to(head, {

        rotation: 0,

        duration: .25,

        ease: "power2.out"

    });


    /* =====================================================
       APROXIMAÇÃO
       ===================================================== */

    tl.to(welcome, {

        opacity: 0,

        y: -20,

        duration: .5,

        ease: "power2.in"

    });


    /*
       O gato começa a se aproximar.
       O scale dá a impressão de que ele está
       andando em direção à câmera.
    */

    tl.to(cat, {

        scale: 1.8,

        y: 25,

        duration: 1.2,

        ease: "power2.in"

    });


    tl.to(cat, {

        scale: 3.4,

        y: 45,

        duration: 1.15,

        ease: "power2.in"

    });


    /* =====================================================
       ROSTO CHEGA NA "CÂMERA"
       ===================================================== */

    tl.to(cat, {

        scale: 6.5,

        y: 100,

        duration: .9,

        ease: "power3.in"

    });


    /* =====================================================
       LÍNGUA APARECE NOVAMENTE
       ===================================================== */

    tl.to(tongue, {

        scaleY: 1.4,

        duration: .35,

        ease: "back.out(1.7)"

    });


    /* =====================================================
       LAMBIDA NA TELA
       ===================================================== */

    tl.to(tongue, {

        scaleY: 2.8,

        y: 50,

        duration: .3,

        ease: "power2.in"

    });


    /* =====================================================
       TELA MOLHADA
       ===================================================== */

    tl.to(lickEffect, {

        opacity: 1,

        duration: .15

    });


    tl.to(lickEffect, {

        backdropFilter: "blur(13px)",

        webkitBackdropFilter: "blur(13px)",

        duration: .75,

        ease: "power2.out"

    });


    /* =====================================================
       GOTAS APARECEM
       ===================================================== */

    tl.to(".drop-1", {
        opacity: .65,
        scale: 1.3,
        duration: .3,
        ease: "back.out(2)"
    }, "<");

    tl.to(".drop-2", {
        opacity: .55,
        scale: 1.2,
        duration: .35,
        ease: "back.out(2)"
    }, "<.08");

    tl.to(".drop-3", {
        opacity: .6,
        scale: 1.25,
        duration: .35,
        ease: "back.out(2)"
    }, "<.12");

    tl.to(".drop-4", {
        opacity: .55,
        scale: 1.2,
        duration: .35,
        ease: "back.out(2)"
    }, "<.15");


    /* =====================================================
       BRILHO DA LAMBIDA
       ===================================================== */

    tl.to(lickShine, {

        scale: 12,

        opacity: .4,

        duration: 1,

        ease: "power2.out"

    }, "-=.5");


    /* =====================================================
       PEQUENA PAUSA
       ===================================================== */

    tl.to({}, {
        duration: .6
    });


    /* =====================================================
       TRANSIÇÃO PARA O SITE
       ===================================================== */

    tl.to(flash, {

        opacity: 1,

        duration: .65,

        ease: "power2.inOut"

    });


    /* =====================================================
       REMOVE A INTRO
       ===================================================== */

    tl.call(() => {

        intro.style.pointerEvents = "none";

        /*
         * Aqui a animação terminou.
         *
         * Seu site está atrás da intro.
         * O flash cobre a transição.
         */

    });


    /* =====================================================
       REVELA O SITE
       ===================================================== */

    tl.to(intro, {

        opacity: 0,

        duration: .8,

        ease: "power2.inOut"

    });


    /* =====================================================
       LIMPEZA
       ===================================================== */

    tl.call(() => {

        /*
         * Remove a intro depois da animação.
         * Isso libera completamente os cliques
         * do seu site.
         */

        intro.remove();

    });


    /* =====================================================
       RESPIRAÇÃO DO GATO
       ===================================================== */

    // Começa depois de alguns segundos para não
    // interferir nos movimentos principais.

    setTimeout(() => {

        if (document.body.contains(cat)) {

            gsap.to(cat, {

                scaleY: 1.015,
                scaleX: .995,

                duration: 1.6,

                repeat: -1,

                yoyo: true,

                ease: "sine.inOut"

            });

        }

    }, 3500);

});
