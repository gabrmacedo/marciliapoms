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

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".kennel-carousel").forEach(function (carousel) {

        const slides = carousel.querySelectorAll(".kennel-slide");

        if (slides.length <= 1) return;

        let current = 0;

        function showSlide(index) {

            slides[current].classList.remove("active");

            current = (index + slides.length) % slides.length;

            slides[current].classList.add("active");
        }

        // SETA ESQUERDA
        const prev = document.createElement("button");
        prev.className = "kennel-arrow kennel-arrow-prev";
        prev.type = "button";
        prev.innerHTML = "‹";
        prev.setAttribute("aria-label", "Foto anterior");

        // SETA DIREITA
        const next = document.createElement("button");
        next.className = "kennel-arrow kennel-arrow-next";
        next.type = "button";
        next.innerHTML = "›";
        next.setAttribute("aria-label", "Próxima foto");

        carousel.appendChild(prev);
        carousel.appendChild(next);

        prev.addEventListener("click", function () {
            showSlide(current - 1);
        });

        next.addEventListener("click", function () {
            showSlide(current + 1);
        });

    });

});
document.addEventListener("DOMContentLoaded", function () {

    const gallerySection = document.querySelector(".plantel-gallery-section");
    const moreButton = document.querySelector(".plantel-gallery-more");

    if (!gallerySection || !moreButton) {
        return;
    }

    const buttonText = moreButton.querySelector("span:first-child");
    const buttonIcon = moreButton.querySelector(".plantel-gallery-more-icon");

    moreButton.addEventListener("click", function () {

        const isOpen = gallerySection.classList.toggle("show-all");

        if (isOpen) {

            buttonText.textContent = "Mostrar menos";
            buttonIcon.textContent = "↑";

        } else {

            buttonText.textContent = "Ver todas as fotos";
            buttonIcon.textContent = "↓";

            gallerySection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});