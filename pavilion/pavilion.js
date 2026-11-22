const picker = document.querySelector('.plan-picker');
const options = [...picker.querySelectorAll('button')];
function showPlan(selected) {
  for (const option of options) {
    const active = option === selected;
    option.setAttribute('aria-pressed', String(active));
    document.getElementById(option.getAttribute('aria-controls')).hidden = !active;
  }
}
for (const option of options) {
  option.addEventListener('click', () => showPlan(option));
}
showPlan(options[0]);
picker.hidden = false;

const dialog = document.querySelector('dialog');
const viewer = dialog.querySelector('.viewer');
const preview = viewer.querySelector('img');
const zoom = document.getElementById('zoom');
function setZoom(active) {
  viewer.classList.toggle('zoomed', active);
  zoom.textContent = active ? 'По размеру окна' : 'Увеличить';
  zoom.setAttribute('aria-pressed', String(active));
}
document.addEventListener('click', event => {
  const link = event.target.closest('a.expand');
  if (!link || !dialog.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  preview.src = link.href;
  preview.alt = link.querySelector('img')?.alt || link.closest('article')?.querySelector('h3')?.textContent || '';
  setZoom(false);
  dialog.showModal();
  viewer.scrollTo(0, 0);
});
zoom.addEventListener('click', () => setZoom(!viewer.classList.contains('zoomed')));
document.getElementById('close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
