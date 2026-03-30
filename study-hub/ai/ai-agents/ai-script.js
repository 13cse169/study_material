/* ============================================================
   AI Agents Learning Guide — ai-script.js
   ============================================================ */

'use strict';

/* ─── THEME TOGGLE ───────────────────────────────────────── */
const html      = document.documentElement;
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(theme) {
  html.dataset.theme = theme;
  localStorage.setItem('ai-theme', theme);
  themeIcon.className = theme === 'dark'
    ? 'fa-solid fa-moon'
    : 'fa-solid fa-sun';
}

themeBtn.addEventListener('click', () => {
  applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
});

const savedTheme = localStorage.getItem('ai-theme');
if (savedTheme) applyTheme(savedTheme);


/* ─── SIDEBAR COLLAPSE ───────────────────────────────────── */
const sidebar       = document.getElementById('sidebar');
const mainContent   = document.getElementById('mainContent');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});


/* ─── MOBILE SIDEBAR ─────────────────────────────────────── */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

mobileMenuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('mobile-open');
});

// Close on nav link click (mobile)
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
  });
});


/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ─── ACTIVE NAV + PROGRESS TRACKER ─────────────────────── */
const sections   = document.querySelectorAll('.content-section[id]');
const navItems   = document.querySelectorAll('.nav-item[data-section]');
const progressFill = document.getElementById('progressFill');
const progressPct  = document.getElementById('progressPct');

// Track which sections have been visited
const visited = new Set();

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;

      // Update active nav
      navItems.forEach(l => l.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-item[data-section="${id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        // Scroll nav item into view within sidebar
        activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }

      // Track visited sections
      visited.add(id);
      const pct = Math.round((visited.size / sections.length) * 100);
      progressFill.style.width = pct + '%';
      progressPct.textContent  = pct + '%';
    }
  });
}, { threshold: 0.25 });

sections.forEach(s => sectionObserver.observe(s));


/* ─── SCROLL REVEAL ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));


/* ─── ACCORDION (Interview Q&A) ──────────────────────────── */
document.querySelectorAll('.acc-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item   = trigger.closest('.acc-item');
    const isOpen = item.classList.contains('open');

    // Close all in same accordion group
    const group = item.closest('.accordion');
    group.querySelectorAll('.acc-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });

    // Toggle clicked (open if it was closed)
    if (!isOpen) item.classList.add('open');
  });
});


/* ─── COPY BUTTONS ───────────────────────────────────────── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const codeEl   = document.getElementById(targetId);
    if (!codeEl) return;

    // Extract plain text (strip HTML tags from syntax highlighting)
    const text = codeEl.innerText || codeEl.textContent;

    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
});


/* ─── NEXT TOPIC BUTTONS ─────────────────────────────────── */
document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const target   = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ─── KEYBOARD NAVIGATION ────────────────────────────────── */
document.addEventListener('keydown', e => {
  const sectionList = [...sections];
  const current = document.querySelector('.nav-item.active');
  if (!current) return;

  const currentId  = current.dataset.section;
  const currentIdx = sectionList.findIndex(s => s.id === currentId);

  if (e.key === 'ArrowDown' && currentIdx < sectionList.length - 1) {
    sectionList[currentIdx + 1].scrollIntoView({ behavior: 'smooth' });
  }
  if (e.key === 'ArrowUp' && currentIdx > 0) {
    sectionList[currentIdx - 1].scrollIntoView({ behavior: 'smooth' });
  }
});


/* ─── HERO DIAGRAM ANIMATION ─────────────────────────────── */
// Stagger pulse the diagram nodes
const adNodes = document.querySelectorAll('.ad-node');
adNodes.forEach((node, i) => {
  node.style.animationDelay = `${i * 0.4}s`;
});


/* ─── TOOLTIP: keyboard shortcut hint ───────────────────────*/
// Show a brief toast message on first visit
if (!localStorage.getItem('ai-visited')) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #1A1916;
    color: #F0ECE3;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 12px;
    padding: .8rem 1.2rem;
    font-size: .8rem;
    font-family: 'IBM Plex Mono', monospace;
    z-index: 9999;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity .4s ease, transform .4s ease;
    max-width: 260px;
    line-height: 1.5;
  `;
  toast.innerHTML = `<i class="fa-solid fa-keyboard" style="color:#61DAFB;margin-right:.4rem;"></i>Tip: Use <strong>↑ ↓</strong> arrow keys to navigate sections`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);

  localStorage.setItem('ai-visited', '1');
}
