/* ALL IN — main.js */

/* ── HEADER: transparent to solid on scroll ── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE NAV TOGGLE ── */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    nav.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
})();

/* ── SCROLL REVEAL (IntersectionObserver) ── */
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.04, rootMargin: '0px' }
  );
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });
})();

/* ── ACTIVE NAV LINK ── */
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.site-nav a, .mobile-nav a').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* ── READING PROGRESS BAR ── */
(function () {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  const update = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = Math.min(pct, 100) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── STAT COUNTERS ── */
(function () {
  const stats = document.querySelectorAll('.stat-number[data-count]');
  if (!stats.length || !('IntersectionObserver' in window)) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCount(el) {
    const raw      = el.dataset.count;       // e.g. "150" or "52" or "1"
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const target   = parseFloat(raw);
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
    let start = null;

    const step = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const val = easeOut(progress) * target;
      el.textContent = prefix + val.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();

/* ── PRESS TICKER: touch pause ── */
(function () {
  const track = document.querySelector('.press-ticker-track');
  if (!track) return;
  track.addEventListener('touchstart', () => { track.style.animationPlayState = 'paused'; }, { passive: true });
  track.addEventListener('touchend',   () => { track.style.animationPlayState = 'running'; }, { passive: true });
})();

/* ── FLOATING CTA ── */
(function () {
  const cta = document.getElementById('float-cta');
  if (!cta) return;
  const trigger = 400;
  const onScroll = () => cta.classList.toggle('visible', window.scrollY > trigger);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
