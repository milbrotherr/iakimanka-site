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

// ── компактный каталог команд на телефоне ──
const teams = document.querySelector('.teams');
if (teams) {
  const grid = teams.querySelector('.teams__grid');
  const cards = [...grid.querySelectorAll('.team-card:not(.team-card--cta)')];
  const cta = grid.querySelector('.team-card--cta');
  const mobile = window.matchMedia('(max-width: 768px)');
  const panel = document.createElement('div');
  panel.id = 'team-description';
  panel.className = 'teams__description';
  panel.hidden = true;
  panel.setAttribute('role', 'region');
  let selected = null;
  let expanded = false;

  const closeDescription = () => {
    if (selected) selected.setAttribute('aria-expanded', 'false');
    selected = null;
    panel.hidden = true;
  };

  const buttons = cards.map((card, index) => {
    const heading = card.querySelector('h3');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'team-card__toggle';
    button.id = `team-toggle-${index + 1}`;
    button.setAttribute('aria-controls', panel.id);
    button.setAttribute('aria-expanded', 'false');
    const icon = document.createElement('span');
    icon.className = 'team-card__mobile-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = card.querySelector('.team-card__icon').textContent;
    const title = document.createElement('span');
    title.append(...heading.childNodes);
    button.append(icon, title);
    heading.append(button);
    button.addEventListener('click', () => {
      if (!mobile.matches) return;
      const wasSelected = selected === button;
      closeDescription();
      if (wasSelected) return;
      selected = button;
      button.setAttribute('aria-expanded', 'true');
      const name = document.createElement('h3');
      name.append(...[...title.childNodes].map(node => node.cloneNode(true)));
      panel.replaceChildren(name, card.querySelector('p').cloneNode(true));
      panel.setAttribute('aria-labelledby', button.id);
      const visibleCount = expanded ? cards.length : 6;
      const rowEnd = Math.min(index % 2 === 0 ? index + 1 : index, visibleCount - 1);
      cards[rowEnd].after(panel);
      panel.hidden = false;
    });
    return button;
  });

  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'teams__more btn';
  more.setAttribute('aria-controls', 'teams-grid');
  grid.id = 'teams-grid';
  grid.after(more);

  const updateCatalog = () => {
    closeDescription();
    cards.forEach((card, index) => {
      card.hidden = mobile.matches && !expanded && index >= 6;
      if (mobile.matches) card.classList.add('in');
      buttons[index].disabled = !mobile.matches;
    });
    cta.hidden = mobile.matches && !expanded;
    more.hidden = !mobile.matches;
    more.textContent = expanded ? 'Свернуть список' : `Все ${cards.length} команды`;
    more.setAttribute('aria-expanded', String(expanded));
  };
  more.addEventListener('click', () => {
    expanded = !expanded;
    updateCatalog();
    if (!expanded && grid.getBoundingClientRect().top < 0) {
      buttons[0].focus({ preventScroll: true });
      grid.scrollIntoView({ block: 'start' });
    }
  });
  grid.addEventListener('keydown', event => {
    if (event.key === 'Escape' && selected) {
      selected.focus();
      closeDescription();
    }
  });
  teams.classList.add('teams--compact');
  mobile.addEventListener('change', updateCatalog);
  updateCatalog();
}
