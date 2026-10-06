(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-nav');

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navigation.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));

  document.querySelectorAll('.image-frame img, .gallery-item img').forEach((image) => {
    const placeholder = image.closest('.image-frame')?.querySelector('.image-placeholder');
    const markLoaded = () => {
      if (image.naturalWidth > 0) {
        image.classList.add('is-loaded');
        placeholder?.classList.add('is-hidden');
      }
    };
    const markMissing = () => {
      image.removeAttribute('src');
      image.setAttribute('aria-hidden', 'true');
    };
    image.addEventListener('load', markLoaded);
    image.addEventListener('error', markMissing);
    if (image.complete) markLoaded();
  });

  const filterButtons = document.querySelectorAll('.filter-button');
  const kennelCards = document.querySelectorAll('.kennel-card');
  const kennelEmpty = document.querySelector('.kennel-empty');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
      kennelCards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'todos' && card.dataset.breed !== filter));
      if (kennelEmpty) kennelEmpty.hidden = filter !== 'todos';
    });
  });

  const slides = [...document.querySelectorAll('.testimonial-slide')];
  const dotsContainer = document.querySelector('.slider-dots');
  let activeSlide = 0;
  const renderSlide = (index) => {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeSlide));
    dotsContainer?.querySelectorAll('.slider-dot').forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === activeSlide));
  };
  if (dotsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ver depoimento ${index + 1}`);
      dot.addEventListener('click', () => renderSlide(index));
      dotsContainer.append(dot);
    });
    renderSlide(0);
  }
  document.querySelector('.slider-prev')?.addEventListener('click', () => renderSlide(activeSlide - 1));
  document.querySelector('.slider-next')?.addEventListener('click', () => renderSlide(activeSlide + 1));

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const closeLightbox = () => {
    lightbox?.classList.remove('is-open');
    lightbox?.setAttribute('aria-hidden', 'true');
    if (lightboxImage) lightboxImage.removeAttribute('src');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const source = item.querySelector('img');
      if (!source?.classList.contains('is-loaded') || !lightbox || !lightboxImage) return;
      lightboxImage.src = item.dataset.image;
      lightboxImage.alt = item.dataset.alt || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
  
})();

document.addEventListener("DOMContentLoaded", function () {

  const cards = document.querySelectorAll(".mp-avaliacao-card");

  const lightbox = document.getElementById(
    "mpAvaliacaoLightbox"
  );

  const lightboxImage = document.getElementById(
    "mpAvaliacaoImagem"
  );

  const closeButton = document.getElementById(
    "mpAvaliacaoFechar"
  );


  /* ==========================================
     ABRIR PRINT
  ========================================== */

  cards.forEach(function (card) {

    card.addEventListener("click", function () {

      const image = card.getAttribute("data-print");

      if (!image) return;

      lightboxImage.src = image;

      lightbox.classList.add("active");

      lightbox.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";

    });

  });


  /* ==========================================
     FECHAR
  ========================================== */

  function fecharAvaliacao() {

    lightbox.classList.remove("active");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    setTimeout(function () {

      lightboxImage.src = "";

    }, 350);

  }


  closeButton.addEventListener(
    "click",
    fecharAvaliacao
  );


  /* ==========================================
     CLICAR FORA DO PRINT
  ========================================== */

  lightbox.addEventListener("click", function (event) {

    if (event.target === lightbox) {

      fecharAvaliacao();

    }

  });


  /* ==========================================
     ESC
  ========================================== */

  document.addEventListener("keydown", function (event) {

    if (
      event.key === "Escape" &&
      lightbox.classList.contains("active")
    ) {

      fecharAvaliacao();

    }

  });

});
/* =========================================
   CARROSSEL MARCÍLIA POMS
   EFEITO — FOTO VINDO DE TRÁS
========================================= */

document.querySelectorAll(".breed-carousel").forEach((carousel) => {

    const slides = Array.from(
        carousel.querySelectorAll(".breed-slide")
    );

    if (slides.length <= 1) return;


    let current = 0;

    let isAnimating = false;


    /* =========================================
       ESTADO INICIAL
    ========================================= */

    slides.forEach((slide, index) => {

        slide.classList.remove("active", "leaving");

        if (index === 0) {
            slide.classList.add("active");
        }

    });


    /* =========================================
       FUNÇÃO DE TROCA
    ========================================= */

    function changeSlide() {

        if (isAnimating) return;

        isAnimating = true;


        const currentSlide = slides[current];

        const next = (current + 1) % slides.length;

        const nextSlide = slides[next];


        /* -----------------------------------------
           A FOTO ATUAL COMEÇA A SAIR
        ----------------------------------------- */

        currentSlide.classList.add("leaving");


        /* -----------------------------------------
           A PRÓXIMA FOTO VEM DE TRÁS
        ----------------------------------------- */

        nextSlide.classList.add("active");


        /*
         * Atualiza o índice
         */
        current = next;


        /*
         * Depois que a animação termina,
         * limpamos a classe da foto anterior.
         */

        setTimeout(() => {

            currentSlide.classList.remove("active", "leaving");

            isAnimating = false;

        }, 1900);

    }


    /* =========================================
       TROCA AUTOMÁTICA
       
       5,5 segundos vendo a foto
       + aproximadamente 1,9s de animação
    ========================================= */

    setInterval(() => {

        changeSlide();

    }, 4000);

});
document.querySelectorAll('.kennel-carousel').forEach(carousel => {

    const slides = carousel.querySelectorAll('.kennel-slide');

    if (slides.length <= 1) return;

    let current = 0;

    setInterval(() => {

        slides[current].classList.remove('active');

        current = (current + 1) % slides.length;

        slides[current].classList.add('active');

    }, 4000);

});

document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".plantel-gallery-section");
    const items = document.querySelectorAll(".plantel-gallery-item");

    const modal = document.getElementById("plantelGalleryModal");
    const modalImage = document.getElementById("plantelGalleryModalImage");
    const counter = document.getElementById("plantelGalleryCounter");

    const closeButton = document.querySelector(".plantel-gallery-close");
    const prevButton = document.querySelector(".plantel-gallery-prev");
    const nextButton = document.querySelector(".plantel-gallery-next");
    const moreButton = document.querySelector(".plantel-gallery-more");

    if (!section || !items.length || !modal) {
        return;
    }

    let currentIndex = 0;


    /* ==========================================
       VER TODAS AS FOTOS
       ========================================== */

    moreButton.addEventListener("click", function () {

        section.classList.toggle("show-all");

        if (section.classList.contains("show-all")) {

            moreButton.querySelector("span:first-child").textContent =
                "Mostrar menos";

            moreButton.querySelector(".plantel-gallery-more-icon").textContent =
                "↑";

        } else {

            moreButton.querySelector("span:first-child").textContent =
                "Ver todas as fotos";

            moreButton.querySelector(".plantel-gallery-more-icon").textContent =
                "↓";

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });


    /* ==========================================
       ABRIR MODAL
       ========================================== */

    function openGallery(index) {

        currentIndex = index;

        updateModal();

        modal.classList.add("active");

        document.body.style.overflow = "hidden";
    }


    /* ==========================================
       ATUALIZAR FOTO
       ========================================== */

    function updateModal() {

        const item = items[currentIndex];

        if (!item) return;

        const image = item.querySelector("img");

        if (!image) return;

        modalImage.style.opacity = "0";

        setTimeout(function () {

            modalImage.src = image.src;
            modalImage.alt = image.alt;

            counter.textContent =
                (currentIndex + 1) + " / " + items.length;

            modalImage.onload = function () {
                modalImage.style.opacity = "1";
            };

        }, 120);
    }


    /* ==========================================
       CLICAR NAS FOTOS
       ========================================== */

    items.forEach(function (item, index) {

        item.addEventListener("click", function () {

            openGallery(index);

        });

    });


    /* ==========================================
       PRÓXIMA FOTO
       ========================================== */

    function nextImage() {

        currentIndex++;

        if (currentIndex >= items.length) {
            currentIndex = 0;
        }

        updateModal();
    }


    /* ==========================================
       FOTO ANTERIOR
       ========================================== */

    function previousImage() {

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = items.length - 1;
        }

        updateModal();
    }


    nextButton.addEventListener("click", nextImage);

    prevButton.addEventListener("click", previousImage);


    /* ==========================================
       FECHAR
       ========================================== */

    function closeGallery() {

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }

    closeButton.addEventListener("click", closeGallery);


    /* ==========================================
       CLICAR FORA DA IMAGEM
       ========================================== */

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            closeGallery();
        }

    });


    /* ==========================================
       TECLADO
       ========================================== */

    document.addEventListener("keydown", function (event) {

        if (!modal.classList.contains("active")) {
            return;
        }

        if (event.key === "Escape") {
            closeGallery();
        }

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

    });


    /* ==========================================
       SWIPE NO CELULAR
       ========================================== */

    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener("touchstart", function (event) {

        touchStartX = event.changedTouches[0].screenX;

    }, { passive: true });


    modal.addEventListener("touchend", function (event) {

        touchEndX = event.changedTouches[0].screenX;

        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) < 50) {
            return;
        }

        if (difference > 0) {
            nextImage();
        } else {
            previousImage();
        }

    }, { passive: true });

});
