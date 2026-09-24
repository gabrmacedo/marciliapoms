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
    /* =========================================================
     RAÇAS — MICRO PARALLAX DOS CARDS
     ========================================================= */

  const breedGrid = document.querySelector('.breed-grid');
  const breedCards = document.querySelectorAll('.breed-card');

  if (breedGrid && breedCards.length && window.matchMedia('(pointer: fine)').matches) {

    breedGrid.addEventListener('pointermove', (event) => {

      const rect = breedGrid.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      breedCards.forEach((card, index) => {

        const direction = index === 0 ? 1 : -1;

        const rotateX = y * -3;
        const rotateY = x * 4 * direction;

        const moveX = x * 8 * direction;
        const moveY = y * 5;

        card.style.transform = `
          translate3d(${moveX}px, ${moveY}px, 0)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
    });


    breedGrid.addEventListener('pointerleave', () => {

      breedCards.forEach((card, index) => {

        card.style.transform =
          index === 0
            ? 'translate3d(8px, 0, 0)'
            : 'translate3d(-8px, 18px, 0)';
      });
    });
  }
})();
