const photos = [
  {file:"green forest.avif", title:"Green forest",   cat:"Nature"},
  {file:"grassy meadow.avif", title:"Grassy meadow",   cat:"Nature"},
  {file:"spring and cherry blossom.avif", title:"Spring and cherry blossom",   cat:"Nature"},
  {file:"deer.avif", title:"Deer", cat:"Animal"},
  {file:"green turtle.avif", title:"Green turtle",  cat:"Animal"},
  {file:"fox.avif", title:"Fox",  cat:"Animal"},
  {file:"desk accessories.jpg", title:"Desk accessories",  cat:"Work"},
  {file:"desk setup.jpg", title:"Desk setup",   cat:"Work"},
  {file:"laptop workspace.jpg", title:"Laptop workspace",   cat:"Work"}
].map(p => ({...p,
  thumb:`images/${p.file}`,
  full:`images/${p.file}`}));

const gallery = document.getElementById('gallery');
const filters = document.getElementById('filters');
const lb = document.getElementById('lb');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');
let visible = [], current = 0, lastFocus = null;

// Build gallery
photos.forEach((p, i) => {
  const b = document.createElement('button');
  b.className = 'item';
  b.dataset.title = p.title;
  b.dataset.cat = p.cat;
  b.setAttribute('aria-label', 'Open ' + p.title);
  b.innerHTML = `<img src="${p.thumb}" alt="${p.title}" loading="lazy">`;
  b.addEventListener('click', () => open(b));
  gallery.appendChild(b);
});
const items = [...gallery.children];

// Build filters
['All', ...new Set(photos.map(p => p.cat))].forEach((c, i) => {
  const b = document.createElement('button');
  b.textContent = c;
  if (i === 0) b.classList.add('active');
  b.addEventListener('click', () => {
    filters.querySelectorAll('button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    items.forEach(it => it.classList.toggle('hide', c !== 'All' && it.dataset.cat !== c));
  });
  filters.appendChild(b);
});

function show(idx, animate) {
  current = (idx + visible.length) % visible.length;
  const it = visible[current], p = photos[items.indexOf(it)];
  const apply = () => {
    lbImg.src = p.full; lbImg.alt = p.title;
    lbCap.innerHTML = `${p.title}<small>${p.cat} &middot; ${current + 1} of ${visible.length}</small>`;
    lbImg.classList.remove('fade');
  };
  if (animate) { lbImg.classList.add('fade'); setTimeout(apply, 200); } else apply();
}
function open(el) {
  visible = items.filter(i => !i.classList.contains('hide'));
  lastFocus = document.activeElement;
  show(visible.indexOf(el), false);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('close').focus();
}
function close() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

document.getElementById('next').onclick = () => show(current + 1, true);
document.getElementById('prev').onclick = () => show(current - 1, true);
document.getElementById('close').onclick = close;
lb.addEventListener('click', e => { if (e.target === lb) close(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowRight') show(current + 1, true);
  if (e.key === 'ArrowLeft') show(current - 1, true);
});

// Touch swipe
let sx = 0;
lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1), true);
});