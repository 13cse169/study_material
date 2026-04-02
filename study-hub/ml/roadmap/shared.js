// ── THEME TOGGLE ──
const THEME_KEY = 'ml-roadmap-theme';
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(THEME_KEY, t);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = t === 'light' ? '🌙' : '☀️';
}
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ── PROGRESS BAR (scroll) ──
function initScrollProgress() {
  const fill = document.querySelector('.progress-fill');
  if (!fill) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    fill.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  });
}

// ── COLLAPSIBLE ──
function initCollapsibles() {
  document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
      const col = header.parentElement;
      col.classList.toggle('open');
    });
  });
}

// ── CHECKLIST (persist per page) ──
const PAGE_KEY = 'ml-' + location.pathname;
function initChecklist() {
  const items = document.querySelectorAll('.checklist li');
  const saved = JSON.parse(localStorage.getItem(PAGE_KEY) || '{}');
  items.forEach((li, i) => {
    if (saved[i]) li.classList.add('done');
    li.addEventListener('click', () => {
      li.classList.toggle('done');
      const state = {};
      document.querySelectorAll('.checklist li').forEach((el, j) => {
        state[j] = el.classList.contains('done');
      });
      localStorage.setItem(PAGE_KEY, JSON.stringify(state));
      updateOverallProgress();
    });
  });
}

// ── OVERALL PROGRESS (count done items across all pages) ──
const ALL_PAGES = ['prerequisites','programming','data','core-ml','evaluation','intermediate','advanced','projects','mlops'];
function updateOverallProgress() {
  let total = 0, done = 0;
  ALL_PAGES.forEach(p => {
    const key = '/ml-roadmap/' + p + '.html';
    const state = JSON.parse(localStorage.getItem('ml-' + key) || '{}');
    Object.keys(state).forEach(k => { total++; if (state[k]) done++; });
  });
  // Also count current page
  const cur = document.querySelectorAll('.checklist li');
  const curState = JSON.parse(localStorage.getItem(PAGE_KEY) || '{}');
  cur.forEach((_, i) => { if (!curState[i]) total++; });
  const pct = total > 0 ? Math.round(done / total * 100) : 0;
  const fill = document.querySelector('.progress-track-fill');
  const lbl = document.querySelector('.progress-pct');
  if (fill) fill.style.width = pct + '%';
  if (lbl) lbl.textContent = pct + '%';
}

// ── ACTIVE NAV LINK ──
function initActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.includes(path)) a.classList.add('active');
  });
}

// ── SEARCH ──
function initSearch() {
  const input = document.querySelector('.search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll('.topic-card, .collapsible').forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.opacity = !q || text.includes(q) ? '1' : '0.2';
    });
  });
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgress();
  initCollapsibles();
  initChecklist();
  initActiveNav();
  initSearch();
  updateOverallProgress();
});
