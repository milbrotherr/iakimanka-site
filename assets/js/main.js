// ── шапка при скролле ──
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── мобильное меню ──
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  nav.classList.toggle('open');
  document.body.classList.toggle('menu-open');
});
nav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  })
);

// ── появление блоков ──
const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => {
  // блоки выше текущего экрана (например, после перезагрузки посреди страницы) показываем сразу
  if (el.getBoundingClientRect().bottom < 0) el.classList.add('in');
  else io.observe(el);
});
