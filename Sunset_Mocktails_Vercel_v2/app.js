const money = n => '$' + n.toFixed(2).replace('.', ',');
const $ = s => document.querySelector(s);

/* ---------- Catálogo ---------- */
const catalog = $('#catalog');
catalog.innerHTML = products.map((p, i) => `
  <article class="product">
    <div class="product-img">
      <img src="assets/producto-${i + 1}.webp" alt="Representación ilustrativa de ${p.name}" width="512" height="512" loading="lazy">
      ${p.star ? '<span class="star">✳ PRODUCTO ESTRELLA</span>' : ''}
      <span class="round-arrow" aria-hidden="true">↗</span>
    </div>
    <div class="product-info">
      <span class="number">0${i + 1} / SIN ALCOHOL</span>
      <h3><button class="product-open" type="button" data-index="${i}" aria-haspopup="dialog">${p.name}</button></h3>
      <p>${p.description}</p>
      <p><strong>Ingredientes:</strong> ${p.ingredients}.</p>
      <div class="product-bottom"><span>${p.size}</span><strong>${money(p.price)}</strong></div>
    </div>
  </article>`).join('');

/* ---------- Detalle del producto ---------- */
const dialog = $('#product-dialog'), content = $('#dialog-content');
let lastFocus, returningToCatalog = true;

catalog.addEventListener('click', e => {
  const button = e.target.closest('.product-open');
  if (!button) return;
  lastFocus = button;
  const i = Number(button.dataset.index), p = products[i];
  content.innerHTML = `<div class="dialog-grid"><img src="assets/producto-${i + 1}.webp" alt="Representación ilustrativa de ${p.name}" width="512" height="512"><div><p class="eyebrow">${p.star ? '✳ PRODUCTO ESTRELLA' : 'SUNSET MOCKTAILS'}</p><h2 id="dialog-title">${p.name}</h2><p>${p.description}</p><p><strong>Ingredientes:</strong> ${p.ingredients}.</p><p><strong>Tamaño:</strong> ${p.size}</p><p><strong>Precio:</strong> ${money(p.price)}</p><a href="#crea" class="btn create-version" data-index="${i}">Crear mi versión <span>↗</span></a></div></div>`;
  dialog.showModal();
});

dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => {
  if (e.target === dialog) dialog.close();
  const create = e.target.closest('.create-version');
  if (create) {
    startFromProduct(products[Number(create.dataset.index)]);
    returningToCatalog = false;
    dialog.close();
  }
});
dialog.addEventListener('close', () => {
  if (returningToCatalog) lastFocus?.focus({ preventScroll: true });
  returningToCatalog = true;
});

/* ---------- Crea tu Sunset ---------- */
const options = {
  base: ['Maracuyá', 'Mango', 'Piña', 'Fresa'],
  extra: ['Coco', 'Jamaica', 'Toronja', 'Limón'],
  toque: ['Menta', 'Hierbabuena', 'Jengibre'],
  size: ['10 oz', '12 oz']
};
const initial = { base: 'Maracuyá', extra: 'Jamaica', toque: 'Menta', size: '10 oz' };
let state = { ...initial }, inspiredBy = null;

function price() {
  return (300 + (state.extra === 'Coco' ? 20 : 0) + (state.toque === 'Jengibre' ? 10 : 0) + (state.size === '12 oz' ? 40 : 0)) / 100;
}

function render() {
  for (const key in options) {
    $('#' + key).innerHTML = options[key].map(v =>
      `<button type="button" class="chip ${state[key] === v ? 'selected' : ''}" data-key="${key}" data-value="${v}" aria-pressed="${state[key] === v}">${v}</button>`
    ).join('');
  }
  const name = 'Sunset de ' + state.base.toLowerCase();
  const total = money(price());
  $('#mix-name').textContent = name;
  $('#mix-desc').textContent = `${state.base} + ${state.extra.toLowerCase()} + ${state.toque.toLowerCase()} · ${state.size}`;
  $('#mix-price').textContent = total;
  $('#mini-name').textContent = `${name} · ${state.size}`;
  $('#mini-price').textContent = total;
  $('#mix-status').textContent = `${name}, ${state.extra.toLowerCase()}, ${state.toque.toLowerCase()}, ${state.size}: ${total}`;
  const from = $('#mix-from');
  from.hidden = !inspiredBy;
  if (inspiredBy) from.textContent = inspiredBy;
  $('.liquid').style.background = { Maracuyá: '#f7a943', Mango: '#f59d34', Piña: '#f4d467', Fresa: '#ed7d89' }[state.base];
}

/* Busca, en el texto de ingredientes, la primera opción de cada grupo que aparezca. */
function firstMatch(list, text) {
  const t = text.toLowerCase();
  let best = null, at = Infinity;
  for (const v of list) {
    const i = t.indexOf(v.toLowerCase());
    if (i > -1 && i < at) { at = i; best = v; }
  }
  return best;
}

const listEs = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1] : a[0];

/* Parte de la receta de una bebida del catálogo: toma los ingredientes que
   existen en el creador y deja los valores iniciales para el resto. */
function startFromProduct(p) {
  const taken = [];
  for (const key of ['base', 'extra', 'toque']) {
    const match = firstMatch(options[key], p.ingredients);
    state[key] = match || initial[key];
    if (match) taken.push(match.toLowerCase());
  }
  state.size = p.size;
  inspiredBy = `Inspirado en «${p.name}»: tomamos ${listEs(taken)} de su receta. Ajusta lo demás a tu gusto.`;
  render();
}

$('.choices').addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  state[b.dataset.key] = b.dataset.value;
  render();
  $(`[data-key="${b.dataset.key}"][data-value="${b.dataset.value}"]`).focus();
});
$('#reset').addEventListener('click', () => {
  state = { ...initial };
  inspiredBy = null;
  render();
});
render();

/* ---------- Menú móvil ---------- */
const hamburger = $('.hamb'), menu = $('#menu');
function setMenu(open) {
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menu.classList.toggle('open', open);
}
hamburger.addEventListener('click', () => setMenu(hamburger.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); hamburger.focus(); }
});

/* ---------- Formulario (sin servicio conectado) ---------- */
$('#contact-form').addEventListener('submit', e => {
  e.preventDefault();
  $('#form-status').textContent = 'El servicio de mensajes aún no está disponible. Tu mensaje no se ha enviado.';
});
