/* PACELINE - interactivity. Each feature is guarded so one script serves both pages. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const searchBtn = $('.search-btn');
const searchOverlay = $('.search-overlay');
const closeSearch = $('.close-search');

searchBtn?.addEventListener('click', () => {
  searchOverlay?.classList.add('open');
  searchOverlay?.setAttribute('aria-hidden', 'false');
  $('.search-box input')?.focus();
});

closeSearch?.addEventListener('click', () => {
  searchOverlay?.classList.remove('open');
  searchOverlay?.setAttribute('aria-hidden', 'true');
});

const searchInput = $('.search-box input');

searchInput?.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();

  $$('.prod').forEach(product => {
    const text = product.textContent.toLowerCase();
    const matches = text.includes(query);

    product.style.display = matches ? '' : 'none';
  });
});
// Hide images whose file is missing (alt text stays available to screen readers)
$$('img').forEach(i => i.addEventListener('error', () => (i.style.visibility = 'hidden')));

// Mobile navigation toggle
const nav = $('nav'), burger = $('.burger');
burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav?.classList.contains('open')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); burger.focus(); }
});

// Hero slider: rotates headline copy, pauses on hover/focus, respects reduced motion
const hero = $('.hero');
if (hero) {
  const slides = [
    ['Autumn / Winter \'26 Collection', 'Chase<br>Every Second.', 'Race-day gear, trail-tested essentials, and everyday kit — curated by runners, worn on every terrain.'],
    ['Trail season is here', 'Find Your<br>Own Pace.', 'Grip, protection and cushioning for muddy Scottish miles and everything beyond.'],
    ['Free gait analysis', 'Run Better.<br>Run Longer.', 'Book a Saturday clinic with Jamie and get matched to the right shoe first time.']
  ];
  const box = $('.slide-fade', hero), dots = $$('.dots button', hero);
  let i = 0, timer, paused = false;
  const show = n => {
    i = (n + slides.length) % slides.length;
    box.classList.add('out');
    setTimeout(() => {
      $('.eyebrow', box).textContent = slides[i][0];
      $('h1', box).innerHTML = slides[i][1];
      $('p', box).textContent = slides[i][2];
      box.classList.remove('out');
    }, 300);
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i));
  };
  dots.forEach((d, k) => d.addEventListener('click', () => show(k)));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) timer = setInterval(() => !paused && show(i + 1), 6000);
  ['mouseenter', 'focusin'].forEach(ev => hero.addEventListener(ev, () => (paused = true)));
  ['mouseleave', 'focusout'].forEach(ev => hero.addEventListener(ev, () => (paused = false)));
}

// New-arrivals filter pills
$$('.pills button').forEach(b => b.addEventListener('click', () => {
  $$('.pills button').forEach(x => x.setAttribute('aria-pressed', x === b));
  const f = b.dataset.f;
  $$('.prod').forEach(p => (p.hidden = !(f === 'all' || p.dataset.tags.includes(f))));
}));

// Wishlist hearts + cart badge count
$$('.heart').forEach(h => h.addEventListener('click', () => {
  const on = h.getAttribute('aria-pressed') !== 'true';
  h.setAttribute('aria-pressed', on);
}));

// Newsletter validation
$$('form.nl').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  const em = $('input', f), msg = $('.msg', f.parentElement);
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value);
  msg.textContent = ok ? 'Thanks — welcome to the club! Check your inbox for 10% off.' : 'Please enter a valid email address.';
  if (ok) f.reset();
}));

// Count-up stats + scroll reveal (IntersectionObserver)
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add('in');
  if (en.target.dataset.n) {
    const n = +en.target.dataset.n; let c = 0;
    const t = setInterval(() => { c = Math.min(n, c + Math.ceil(n / 30)); en.target.textContent = c + (en.target.dataset.s || ''); if (c >= n) clearInterval(t); }, 40);
  }
  io.unobserve(en.target);
}), { threshold: .3 });
$$('.reveal,[data-n]').forEach(el => io.observe(el));
// Scroll progress bar + back-to-top button
const bar = $('.progress'), toTop = $('.totop');
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight)})`;
  toTop.hidden = h.scrollTop < 600;
}, { passive: true });
toTop.addEventListener('click', () => scrollTo({ top: 0 }));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && searchOverlay?.classList.contains('open')) {
    searchOverlay.classList.remove('open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    searchBtn?.focus();
  }
});
searchOverlay?.addEventListener('click', e => {
  if (e.target === searchOverlay) {
    searchOverlay.classList.remove('open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    searchBtn?.focus();
  }
});
