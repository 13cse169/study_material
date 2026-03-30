/* ============================================================
   LearnForge — script.js
   ============================================================ */

'use strict';

/* ─── THEME TOGGLE ───────────────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  html.dataset.theme = theme;
  localStorage.setItem('lf-theme', theme);
}

themeToggle.addEventListener('click', () => {
  applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
});

// persist across reloads
const saved = localStorage.getItem('lf-theme');
if (saved) applyTheme(saved);


/* ─── NAVBAR SCROLL ──────────────────────────────────────── */
const navbar  = document.getElementById('navbar');
let   lastY   = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  lastY = y;
}, { passive: true });


/* ─── ACTIVE NAV LINK (IntersectionObserver) ─────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link[data-section]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[data-section="${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));


/* ─── HAMBURGER MENU ─────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinksList.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// close on nav-link click
navLinksList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksList.classList.remove('open');
  });
});


/* ─── SMOOTH-SCROLL "Start Learning" ─────────────────────── */
document.getElementById('startBtn').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('topics').scrollIntoView({ behavior: 'smooth' });
});


/* ─── TYPING ANIMATION ───────────────────────────────────── */
const phrases = [
  'React', 'Node.js', 'Python', 'DSA', 'Machine Learning',
  'SQL', 'GitHub', 'AI & LLMs', 'TypeScript', 'Docker'
];
let pi = 0, ci = 0, deleting = false;
const typeEl = document.getElementById('typeTarget');

function type() {
  const phrase = phrases[pi];
  if (!deleting) {
    typeEl.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) {
      deleting = true;
      setTimeout(type, 1600);
      return;
    }
  } else {
    typeEl.textContent = phrase.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 110);
}
setTimeout(type, 800);


/* ─── SCROLL REVEAL ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


/* ─── ANIMATED PROGRESS BARS ─────────────────────────────── */
// Card progress bars
const cpbObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const fill  = e.target.querySelector('.cpb-fill');
    const label = e.target.querySelector('.cp-pct');
    if (!fill) return;
    const pct = parseInt(fill.dataset.fill, 10);
    // animate number
    animateNumber(label, 0, pct, 1200, v => v + '%');
    // animate bar
    requestAnimationFrame(() => { fill.style.width = pct + '%'; });
    cpbObserver.unobserve(e.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.card-progress-wrap').forEach(el => cpbObserver.observe(el));

// Track list bars
const tiObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.ti-fill').forEach(fill => {
      const pct = parseInt(fill.dataset.fill, 10);
      requestAnimationFrame(() => { fill.style.width = pct + '%'; });
    });
    tiObserver.unobserve(e.target);
  });
}, { threshold: 0.3 });

const trackList = document.querySelector('.track-list');
if (trackList) tiObserver.observe(trackList);


/* ─── OVERALL PROGRESS RING ──────────────────────────────── */
// inject SVG gradient
const svgNS = 'http://www.w3.org/2000/svg';

function injectRingGradient() {
  const svg  = document.querySelector('.ring-svg');
  if (!svg) return;
  const defs = document.createElementNS(svgNS, 'defs');
  const grad = document.createElementNS(svgNS, 'linearGradient');
  grad.setAttribute('id', 'ringGrad');
  grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '0%');

  const s1 = document.createElementNS(svgNS, 'stop');
  s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#61DAFB');
  const s2 = document.createElementNS(svgNS, 'stop');
  s2.setAttribute('offset', '50%'); s2.setAttribute('stop-color', '#A78BFA');
  const s3 = document.createElementNS(svgNS, 'stop');
  s3.setAttribute('offset', '100%'); s3.setAttribute('stop-color', '#F97316');

  grad.append(s1, s2, s3);
  defs.append(grad);
  svg.prepend(defs);
}
injectRingGradient();

const percents = [65, 40, 80, 30, 15, 50, 35, 20];
const overall  = Math.round(percents.reduce((a, b) => a + b, 0) / percents.length);

const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const ring    = document.getElementById('overallRing');
    const pctEl   = document.getElementById('overallPct');
    const circum  = 2 * Math.PI * 80; // r=80 → 502.65

    ring.style.strokeDashoffset = circum - (circum * overall / 100);
    animateNumber(pctEl, 0, overall, 1500, v => v + '%');
    ringObserver.unobserve(e.target);
  });
}, { threshold: 0.5 });

const progressOverview = document.querySelector('.progress-overview');
if (progressOverview) ringObserver.observe(progressOverview);


/* ─── UTILITY: animate number ────────────────────────────── */
function animateNumber(el, from, to, duration, fmt) {
  if (!el) return;
  const start = performance.now();
  function step(now) {
    const t   = Math.min((now - start) / duration, 1);
    const val = Math.round(from + (to - from) * easeOutExpo(t));
    el.textContent = fmt ? fmt(val) : val;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}


/* ─── SEARCH / FILTER ────────────────────────────────────── */
const searchInput  = document.getElementById('searchInput');
const cardsGrid    = document.getElementById('cardsGrid');
const noResults    = document.getElementById('noResults');
const noResultsQ   = document.getElementById('noResultsQuery');
const allCards     = [...cardsGrid.querySelectorAll('.card')];

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  let visible = 0;

  allCards.forEach(card => {
    const tags  = (card.dataset.tags || '').toLowerCase();
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const match = !q || tags.includes(q) || title.includes(q);

    card.style.display   = match ? '' : 'none';
    card.style.animation = match ? 'cardFadeIn .35s ease forwards' : '';
    if (match) visible++;
  });

  noResults.style.display = visible === 0 ? 'block' : 'none';
  noResultsQ.textContent  = q;
});

// inject keyframe for search reveal
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes cardFadeIn {
    from { opacity: 0; transform: translateY(12px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
document.head.append(styleEl);


/* ─── PARTICLE CANVAS ────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  const COUNT = 55;
  const COLORS = ['#61DAFB', '#A78BFA', '#F97316', '#68A063', '#FFD43B'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 2.2 + .6;
      this.vx = (Math.random() - .5) * .35;
      this.vy = -(Math.random() * .5 + .15);
      this.a  = Math.random() * .5 + .1;
      this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.a;
      ctx.fillStyle   = this.c;
      ctx.shadowColor = this.c;
      ctx.shadowBlur  = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  particles = Array.from({ length: COUNT }, () => new Particle());

  // connect near particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.strokeStyle = particles[i].c;
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.lineWidth   = .8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  let raf;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(loop);
  }

  // only run when hero is visible
  const heroObs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!raf) loop(); }
    else { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 });

  heroObs.observe(document.getElementById('home'));
})();


/* ─── CARD CLICK RIPPLE ──────────────────────────────────── */
document.querySelectorAll('.card-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const rip  = document.createElement('span');
    rip.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;
      width:4px;height:4px;border-radius:50%;
      background:rgba(255,255,255,.6);
      transform:translate(-50%,-50%) scale(0);
      animation:ripple .5s ease-out forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(rip);
    rip.addEventListener('animationend', () => rip.remove());
  });
});

// inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    to { transform: translate(-50%,-50%) scale(30); opacity: 0; }
  }
`;
document.head.append(rippleStyle);
