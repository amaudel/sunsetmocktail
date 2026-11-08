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
  updateDrink(drinkReady);
  drinkReady = true;
}

/* ---------- Bebida animada ---------- */
const NS = 'http://www.w3.org/2000/svg';
const drink = $('.drink');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const drinkColors = {
  base: { Maracuyá: '#f9a825', Mango: '#ff8f00', Piña: '#ffd740', Fresa: '#e8335a' },
  extra: { Coco: '#fff1d6', Jamaica: '#b0174f', Toronja: '#ff7d73', Limón: '#d4e88f' }
};
const LEVEL = { '10 oz': 108, '12 oz': 86 }; // altura de la superficie del líquido
let drinkReady = false;

/* Partes repetitivas del SVG: rayos del sol, olas y burbujas. */
(function buildDrink() {
  const cx = 120, cy = 128, R = 124, w = 0.07;
  const pt = a => `${(cx + R * Math.cos(a)).toFixed(1)} ${(cy + R * Math.sin(a)).toFixed(1)}`;
  let rays = '';
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; rays += `M${cx} ${cy} L${pt(a - w)} L${pt(a + w)} Z`; }
  drink.querySelector('.rays path').setAttribute('d', rays);

  const wave = (amp, period) => {
    let d = `M-120 0 q${period / 4} ${-amp} ${period / 2} 0`;
    for (let x = -120 + period / 2; x < 380; x += period / 2) d += ` t${period / 2} 0`;
    return d + ' L380 170 L-120 170 Z';
  };
  drink.querySelector('.wave-back').setAttribute('d', wave(4, 70));
  drink.querySelector('.wave-front').setAttribute('d', wave(5, 60));

  const bubbles = drink.querySelector('.bubbles');
  [[90, 2.2, 3.1, 0], [104, 1.6, 2.6, .8], [116, 2.8, 3.6, 1.7], [128, 1.8, 2.9, .4],
   [140, 2.4, 3.3, 2.2], [98, 1.4, 2.4, 1.3], [134, 1.5, 2.7, 2.8], [122, 2, 3.8, .2]].forEach(([x, r, dur, delay]) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', 232); c.setAttribute('r', r);
    c.style.animationDuration = dur + 's';
    c.style.animationDelay = -delay + 's';
    bubbles.append(c);
  });

  // Pausa las animaciones continuas cuando la bebida no está en pantalla.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => drink.classList.toggle('paused', !e.isIntersecting)).observe(drink);
  }
})();

function updateDrink(animateChange) {
  const base = drinkColors.base[state.base], extra = drinkColors.extra[state.extra];
  drink.querySelector('.liq-top').style.stopColor = extra;
  drink.querySelectorAll('.liq-base').forEach(s => { s.style.stopColor = base; });
  drink.querySelector('.sun-stop').style.stopColor = base;
  const level = LEVEL[state.size];
  drink.querySelector('.liquid').style.transform = `translate(0px, ${level}px)`;

  drink.querySelectorAll('[data-group]').forEach(el => {
    const on = state[el.dataset.group] === el.dataset.v;
    const wasOn = el.classList.contains('on');
    el.classList.toggle('on', on);
    if (on && !wasOn && animateChange) garnishIn(el);
  });

  if (animateChange && !reduceMotion.matches) {
    drink.querySelector('.drink-body').animate(
      [{ transform: 'scale(0.96)' }, { transform: 'scale(1)' }],
      { duration: 380, easing: EASE_OUT }
    );
    splash(level, [base, extra]);
  }
}

/* El ingrediente nuevo cae sobre el vaso; con movimiento reducido solo aparece. */
function garnishIn(el) {
  const frames = reduceMotion.matches
    ? [{ opacity: 0 }, { opacity: 1 }]
    : [{ opacity: 0, transform: 'translateY(-14px) rotate(-14deg) scale(0.9)' }, { opacity: 1, transform: 'none' }];
  el.animate(frames, { duration: 420, easing: EASE_OUT });
}

/* Gotas que saltan de la superficie del líquido. */
function splash(y, palette) {
  const g = drink.querySelector('.splash');
  for (let i = 0; i < 8; i++) {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', 96 + i * 7 + Math.random() * 4);
    c.setAttribute('cy', y + 2);
    c.setAttribute('r', 2 + Math.random() * 2.5);
    c.setAttribute('fill', palette[i % 2]);
    g.append(c);
    const dx = (Math.random() - 0.5) * 56, h = 22 + Math.random() * 32;
    c.animate([
      { transform: 'translate(0px, 0px) scale(0.4)', opacity: 0 },
      { transform: `translate(${dx * 0.6}px, ${-h}px) scale(1)`, opacity: 1, offset: 0.4 },
      { transform: `translate(${dx}px, ${-h * 0.2}px) scale(0.7)`, opacity: 0 }
    ], { duration: 650, easing: EASE_OUT }).onfinish = () => c.remove();
  }
}

render();

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
