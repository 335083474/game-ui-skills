const screens = JSON.parse(document.getElementById('screen-data').textContent);
const nav = [...document.querySelectorAll('[data-screen-id]')];
const choices = document.getElementById('choices');
const note = document.getElementById('selection-note');
let selected = 0;
function safe(value) { return String(value).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }
function draw(id) {
  const screen = screens.find(item => item.id === id) || screens[0];
  document.body.dataset.screen = screen.id;
  document.getElementById('screen-label').textContent = screen.label;
  document.getElementById('screen-metric').textContent = screen.metric;
  document.getElementById('screen-title').textContent = screen.headline;
  document.getElementById('screen-summary').textContent = screen.summary;
  document.getElementById('confirm').textContent = screen.action;
  nav.forEach(button => {
    const active = button.dataset.screenId === screen.id;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  selected = 0;
  choices.setAttribute('aria-labelledby', `tab-${screen.id}`);
  choices.innerHTML = screen.cards.map((card, index) => `<button class=\"choice-card\" type=\"button\" data-card=\"${index}\" aria-pressed=\"${index === 0}\"><span class=\"choice-glyph\" aria-hidden=\"true\"><svg viewBox=\"0 0 48 48\"><use href=\"../art/icons.svg#${safe(card.icon)}\"></use></svg></span><span class=\"choice-tag\">${safe(card.tag)}</span><span class=\"choice-title\">${safe(card.title)}</span><span class=\"choice-copy\">${safe(card.copy)}</span><span class=\"choice-value\">${safe(card.value)}</span></button>`).join('');
  note.textContent = `Preview selected: ${screen.cards[0].title}`;
}
nav.forEach((button, index) => {
  button.addEventListener('click', () => draw(button.dataset.screenId));
  button.addEventListener('keydown', event => {
    if (!['ArrowRight','ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowRight' ? 1 : nav.length - 1)) % nav.length;
    nav[next].focus(); nav[next].click();
  });
});
choices.addEventListener('click', event => {
  const button = event.target.closest('[data-card]');
  if (!button) return;
  selected = Number(button.dataset.card);
  choices.querySelectorAll('[data-card]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  note.textContent = `Preview selected: ${screens.find(item => item.id === document.body.dataset.screen).cards[selected].title}`;
});
document.getElementById('confirm').addEventListener('click', () => {
  const screen = screens.find(item => item.id === document.body.dataset.screen);
  const card = screen.cards[selected];
  note.textContent = `Sample state held: ${card.title}. No game data was changed.`;
});
draw(screens[0].id);
