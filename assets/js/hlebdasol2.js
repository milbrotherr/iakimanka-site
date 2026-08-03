(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('.reveal')];

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    revealItems.forEach((item) => item.classList.add('reveal-pending'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.96) {
        item.classList.add('is-visible');
        return;
      }
      observer.observe(item);
    });
  }

  const progress = document.querySelector('.progress span');
  const updateProgress = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const value = distance > 0 ? Math.min(1, window.scrollY / distance) : 0;
    progress.style.width = `${value * 100}%`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const items = [...document.querySelectorAll('.flickr-item')];
  const dialog = document.querySelector('.lightbox');
  const dialogImage = dialog?.querySelector('img');
  const dialogLink = dialog?.querySelector('.lightbox__flickr');
  const closeButton = dialog?.querySelector('.lightbox__close');
  const prevButton = dialog?.querySelector('.lightbox__prev');
  const nextButton = dialog?.querySelector('.lightbox__next');
  let currentIndex = 0;
  const emptyPixel = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

  const showPhoto = (index) => {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const image = item.querySelector('img');
    dialogImage.src = item.dataset.full || image.src;
    dialogImage.alt = image.alt;
    dialogLink.href = item.href;
  };

  if (dialog && typeof dialog.showModal === 'function') {
    items.forEach((item, index) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        showPhoto(index);
        dialog.showModal();
        document.body.classList.add('lightbox-open');
      });
    });

    const closeDialog = () => {
      dialog.close();
      document.body.classList.remove('lightbox-open');
      dialogImage.src = emptyPixel;
    };

    closeButton.addEventListener('click', closeDialog);
    prevButton.addEventListener('click', () => showPhoto(currentIndex - 1));
    nextButton.addEventListener('click', () => showPhoto(currentIndex + 1));

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });

    dialog.addEventListener('cancel', () => {
      document.body.classList.remove('lightbox-open');
      dialogImage.src = emptyPixel;
    });

    window.addEventListener('keydown', (event) => {
      if (!dialog.open) return;
      if (event.key === 'ArrowLeft') showPhoto(currentIndex - 1);
      if (event.key === 'ArrowRight') showPhoto(currentIndex + 1);
    });
  }
})();
