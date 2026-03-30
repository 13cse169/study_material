/**
 * ReactPath — Master React JS Study Guide
 * script.js
 * ───────────────────────────────────────────
 * Features:
 *  • Dark / Light mode toggle (synced sidebar + topbar)
 *  • Active section highlighting in sidebar (IntersectionObserver)
 *  • Reading progress bar
 *  • Fade-in animations on scroll
 *  • Topic completion tracking (localStorage)
 *  • Overall progress meter
 *  • Sidebar mobile menu open/close
 *  • Accordion Q&A (expand / collapse)
 *  • Code copy buttons
 *  • Interactive counter demo
 *  • Search / filter nav links
 *  • "Next Topic" button logic
 */

'use strict';

/* ═══════════════════════════════════════════
   CONSTANTS & STATE
   ═══════════════════════════════════════════ */
const COMPLETED_KEY = 'reactpath_completed';
const THEME_KEY     = 'reactpath_theme';

// All topic IDs in order (for "Next Topic" feature)
const TOPIC_ORDER = [
  'html-css','js-essentials','es6','async',
  'what-is-react','virtual-dom','jsx','components','props','state','events',
  'useeffect','conditional','lists','forms','lifting',
  'router','context','redux','performance','custom-hooks',
  'api-integration','auth','structure','ui-libs',
  'nextjs','typescript','patterns'
];

/* ═══════════════════════════════════════════
   DOM REFERENCES
   ═══════════════════════════════════════════ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const progressBar    = $('#progress-bar');
const themeCb        = $('#theme-toggle-cb');
const themeMini      = $('#theme-toggle-mini');
const sidebar        = $('#sidebar');
const sidebarOverlay = $('#sidebar-overlay');
const menuToggle     = $('#menu-toggle');
const searchInput    = $('#search-input');
const overallFill    = $('#overall-fill');
const overallPct     = $('#overall-pct');
const demoCountEl    = $('#demo-count');

/* ═══════════════════════════════════════════
   PROGRESS BAR (scroll position)
   ═══════════════════════════════════════════ */
function updateProgressBar() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}

/* ═══════════════════════════════════════════
   DARK / LIGHT MODE
   ═══════════════════════════════════════════ */
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  // Sync both toggles
  if (themeCb)   themeCb.checked   = dark;
  if (themeMini) themeMini.checked = dark;
  // Update mini icon
  if (themeMini) {
    themeMini.nextElementSibling && (themeMini.nextElementSibling.className = dark ? 'fa fa-sun' : 'fa fa-moon');
    // Find the <i> after the input
    const icon = themeMini.parentElement.querySelector('i');
    if (icon) icon.className = dark ? 'fa fa-sun' : 'fa fa-moon';
  }
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);
}

if (themeCb) {
  themeCb.addEventListener('change', () => applyTheme(themeCb.checked));
}
if (themeMini) {
  themeMini.addEventListener('change', () => applyTheme(themeMini.checked));
}

/* ═══════════════════════════════════════════
   MOBILE SIDEBAR
   ═══════════════════════════════════════════ */
function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (menuToggle)     menuToggle.addEventListener('click', openSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

// Close sidebar when a nav link is clicked (mobile)
$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 900) closeSidebar();
  });
});

/* ═══════════════════════════════════════════
   ACTIVE SECTION (IntersectionObserver)
   ═══════════════════════════════════════════ */
const sections = $$('section[id], div[id="roadmap"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        // Remove active from all
        $$('.nav-link').forEach(l => l.classList.remove('active'));
        // Add active to matching link
        const active = $(`.nav-link[data-section="${id}"]`);
        if (active) {
          active.classList.add('active');
          // Scroll link into view in sidebar (if it's off-screen)
          active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    });
  },
  {
    rootMargin: '-20% 0px -75% 0px', // trigger when section is 20% from top
    threshold: 0,
  }
);

sections.forEach(sec => sectionObserver.observe(sec));

/* ═══════════════════════════════════════════
   FADE-IN ON SCROLL (IntersectionObserver)
   ═══════════════════════════════════════════ */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger by index in the batch
        const delay = (i * 60) + 'ms';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

$$('.fade-in-section').forEach(el => fadeObserver.observe(el));

/* ═══════════════════════════════════════════
   TOPIC COMPLETION
   ═══════════════════════════════════════════ */
function getCompleted() {
  try { return JSON.parse(localStorage.getItem(COMPLETED_KEY)) || {}; }
  catch { return {}; }
}

function saveCompleted(data) {
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(data));
}

function markComplete(topicId) {
  const data    = getCompleted();
  data[topicId] = true;
  saveCompleted(data);
  updateCompletionUI();
  // Visual feedback on button
  const btn = $(`[data-topic-id="${topicId}"] .btn-complete`);
  if (btn) {
    btn.classList.add('done');
    btn.innerHTML = '<i class="fa fa-check-circle"></i> Completed!';
    btn.disabled = true;
  }
}

function updateCompletionUI() {
  const data      = getCompleted();
  const total     = TOPIC_ORDER.length;
  const completed = Object.keys(data).filter(k => data[k]).length;
  const pct       = Math.round((completed / total) * 100);

  if (overallFill) overallFill.style.width = pct + '%';
  if (overallPct)  overallPct.textContent  = pct + '%';

  // Update sidebar checkmarks
  TOPIC_ORDER.forEach(id => {
    const link = $(`.nav-link[data-section="${id}"]`);
    if (link) {
      if (data[id]) link.classList.add('completed');
      else          link.classList.remove('completed');
    }
  });

  // Update complete buttons
  TOPIC_ORDER.forEach(id => {
    if (data[id]) {
      const btn = $(`[data-topic-id="${id}"] .btn-complete`);
      if (btn) {
        btn.classList.add('done');
        btn.innerHTML = '<i class="fa fa-check-circle"></i> Completed!';
        btn.disabled = true;
      }
    }
  });
}

// Expose globally (used by HTML onclick attributes)
window.markComplete = markComplete;

/* ═══════════════════════════════════════════
   NEXT TOPIC BUTTON
   ═══════════════════════════════════════════ */
function scrollToNext(currentId) {
  const idx = TOPIC_ORDER.indexOf(currentId);
  if (idx === -1 || idx >= TOPIC_ORDER.length - 1) {
    // Last topic → scroll to projects
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const nextId = TOPIC_ORDER[idx + 1];
  document.querySelector(`#${nextId}`)?.scrollIntoView({ behavior: 'smooth' });
}
window.scrollToNext = scrollToNext;

/* ═══════════════════════════════════════════
   ACCORDION Q&A
   ═══════════════════════════════════════════ */
$$('.accordion-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');

    // Close all open accordions
    $$('.accordion-item.open').forEach(el => el.classList.remove('open'));

    // Toggle clicked one
    if (!isOpen) item.classList.add('open');
  });
});

/* ═══════════════════════════════════════════
   COPY CODE BUTTONS
   ═══════════════════════════════════════════ */
function copyCode(btn) {
  const wrap = btn.closest('.code-block-wrap');
  if (!wrap) return;
  const pre  = wrap.querySelector('pre');
  if (!pre)  return;
  const text = pre.innerText || pre.textContent;

  navigator.clipboard.writeText(text)
    .then(() => {
      btn.classList.add('copied');
      btn.innerHTML = '<i class="fa fa-check"></i> Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<i class="fa fa-copy"></i> Copy';
      }, 2000);
    })
    .catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.innerHTML = '<i class="fa fa-check"></i> Copied!';
      setTimeout(() => { btn.innerHTML = '<i class="fa fa-copy"></i> Copy'; }, 2000);
    });
}
window.copyCode = copyCode;

/* ═══════════════════════════════════════════
   INTERACTIVE COUNTER DEMO
   ═══════════════════════════════════════════ */
let demoCount = 0;

function demoCounter(delta, reset = false) {
  if (reset) demoCount = 0;
  else       demoCount += delta;

  if (demoCountEl) {
    demoCountEl.textContent = demoCount;
    // Bump animation
    demoCountEl.classList.remove('bump');
    void demoCountEl.offsetWidth; // reflow to restart animation
    demoCountEl.classList.add('bump');
    setTimeout(() => demoCountEl.classList.remove('bump'), 200);
    // Color feedback
    if (demoCount > 0)      demoCountEl.style.color = 'var(--green)';
    else if (demoCount < 0) demoCountEl.style.color = 'var(--red)';
    else                    demoCountEl.style.color = 'var(--accent)';
  }
}
window.demoCounter = demoCounter;

/* ═══════════════════════════════════════════
   SEARCH / FILTER NAV LINKS
   ═══════════════════════════════════════════ */
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();

    $$('#sidebar-nav li').forEach(li => {
      // Always show group labels and nav links
      const link = li.querySelector('.nav-link');
      if (!link) { // group label
        li.classList.remove('search-hidden');
        return;
      }
      const text = link.textContent.toLowerCase();
      if (q === '' || text.includes(q)) {
        li.classList.remove('search-hidden');
      } else {
        li.classList.add('search-hidden');
      }
    });

    // Hide group labels if all their children are hidden
    let current = null;
    $$('#sidebar-nav li').forEach(li => {
      if (li.classList.contains('nav-group-label')) {
        current = li;
        return;
      }
      if (current) {
        // Check if there's any visible link after this label
        const visibleSiblings = [];
        let sib = current.nextElementSibling;
        while (sib && !sib.classList.contains('nav-group-label')) {
          if (!sib.classList.contains('search-hidden')) visibleSiblings.push(sib);
          sib = sib.nextElementSibling;
        }
        current.classList.toggle('search-hidden', visibleSiblings.length === 0);
      }
    });
  });
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL for internal anchors
   ═══════════════════════════════════════════ */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const topbarHeight = window.innerWidth < 900 ? 60 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - topbarHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════
   ROADMAP ITEM STAGGER ANIMATION
   ═══════════════════════════════════════════ */
$$('.roadmap-item').forEach((item, i) => {
  item.style.animationDelay = (i * 80) + 'ms';
});

/* ═══════════════════════════════════════════
   SCROLL EVENT
   ═══════════════════════════════════════════ */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgressBar();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
function init() {
  initTheme();
  updateProgressBar();
  updateCompletionUI();

  // Open first accordion item as a hint
  const firstAccordion = $('.accordion-item');
  if (firstAccordion) firstAccordion.classList.add('open');
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
