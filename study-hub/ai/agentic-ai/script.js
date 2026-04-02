/**
 * AGENTIC AI LEARNING PLATFORM — script.js
 * Handles: theme toggle, sidebar nav, progress tracking,
 *          scroll spy, tabs, accordion, copy buttons, next-btn
 */

/* ── 1. DOM REFERENCES ─────────────────────────────── */
const html          = document.documentElement;
const themeToggle   = document.getElementById('themeToggle');
const themeIcon     = document.getElementById('themeIcon');
const sidebar       = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent   = document.getElementById('mainContent');
const progressFill  = document.getElementById('progressFill');
const progressPct   = document.getElementById('progressPct');
const navLinks      = document.querySelectorAll('.nav-link');
const sections      = document.querySelectorAll('.content-section');

/* ── 2. THEME TOGGLE ────────────────────────────────── */
// Read saved preference or default to light
const savedTheme = localStorage.getItem('agenticTheme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'light' ? 'dark' : 'light');
});

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('agenticTheme', theme);
  themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* ── 3. MOBILE SIDEBAR TOGGLE ───────────────────────── */
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 900
    && sidebar.classList.contains('open')
    && !sidebar.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

/* ── 4. SMOOTH SCROLL (sidebar nav links) ───────────── */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const target   = document.getElementById(targetId);
    if (target) {
      const offset = 24;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    // Close mobile sidebar after navigation
    if (window.innerWidth <= 900) sidebar.classList.remove('open');
  });
});

/* ── 5. SCROLL SPY + PROGRESS TRACKER ──────────────── */
const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      setActiveNav(id);
    }
  });
}, observerOptions);

sections.forEach(sec => sectionObserver.observe(sec));

function setActiveNav(id) {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === id);
  });
  updateProgress();
}

// Progress: percentage of sections scrolled past
function updateProgress() {
  const totalSections   = sections.length;
  const activeLink      = document.querySelector('.nav-link.active');
  if (!activeLink) return;

  const activeSection   = activeLink.getAttribute('data-section');
  const sectionIds      = Array.from(sections).map(s => s.id);
  const currentIndex    = sectionIds.indexOf(activeSection);
  const pct             = Math.round(((currentIndex + 1) / totalSections) * 100);

  progressFill.style.width = pct + '%';
  progressPct.textContent  = pct + '%';
}

/* ── 6. TYPE TABS ────────────────────────────────────── */
const typeTabs   = document.querySelectorAll('.type-tab');
const typePanels = document.querySelectorAll('.type-panel');

typeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');

    // Toggle active on tabs
    typeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Toggle active on panels
    typePanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${target}`);
    });
  });
});

/* ── 7. ACCORDION ────────────────────────────────────── */
const accordionTriggers = document.querySelectorAll('.accordion-trigger');

accordionTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const isOpen = item.classList.contains('open');

    // Optionally close others in same group
    const siblings = trigger.closest('.accordion')
      ?.querySelectorAll('.accordion-item');
    if (siblings) {
      siblings.forEach(s => {
        if (s !== item) s.classList.remove('open');
      });
    }

    item.classList.toggle('open', !isOpen);
  });
});

/* ── 8. COPY CODE BUTTONS ───────────────────────────── */
const copyBtns = document.querySelectorAll('.copy-btn');

copyBtns.forEach(btn => {
  btn.addEventListener('click', async () => {
    const codeId  = btn.getAttribute('data-code');
    const codeEl  = document.getElementById(codeId);
    if (!codeEl) return;

    // Extract plain text (strip HTML tags)
    const text = codeEl.innerText || codeEl.textContent;

    try {
      await navigator.clipboard.writeText(text);
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      btn.classList.add('copied');

      setTimeout(() => {
        btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        btn.classList.remove('copied');
      }, 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        btn.classList.remove('copied');
      }, 2000);
    }
  });
});

/* ── 9. NEXT TOPIC BUTTONS ──────────────────────────── */
const nextBtns = document.querySelectorAll('.next-btn');

nextBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const nextId = btn.getAttribute('data-next');
    const target = document.getElementById(nextId);
    if (target) {
      const offset = 24;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── 10. ENTRANCE ANIMATIONS ────────────────────────── */
// Staggered card reveal on scroll
const animatables = document.querySelectorAll(
  '.card, .trait-card, .component-card, .app-card, .challenge-card, .framework-card, .flow-step, .pillar, .roadmap-phase'
);

const entranceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Small stagger delay based on position within parent
      const siblings = Array.from(entry.target.parentElement.children);
      const idx      = siblings.indexOf(entry.target);
      const delay    = Math.min(idx * 60, 300);

      setTimeout(() => {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);

      entranceObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Set initial state for animation
animatables.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  entranceObserver.observe(el);
});

/* ── 11. HIGHLIGHT CODE ON HOVER ────────────────────── */
document.querySelectorAll('.code-block').forEach(block => {
  block.addEventListener('mouseenter', () => {
    block.style.boxShadow = '0 0 0 2px rgba(217, 119, 6, 0.3)';
  });
  block.addEventListener('mouseleave', () => {
    block.style.boxShadow = 'none';
  });
});

/* ── 12. KEYBOARD NAVIGATION ────────────────────────── */
document.addEventListener('keydown', (e) => {
  // Press 'T' to toggle theme
  if (e.key === 't' && !e.ctrlKey && !e.metaKey && !isTyping(e)) {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
  }
  // Escape to close sidebar on mobile
  if (e.key === 'Escape') {
    sidebar.classList.remove('open');
  }
});

function isTyping(e) {
  const tag = document.activeElement.tagName.toLowerCase();
  return ['input', 'textarea', 'select'].includes(tag);
}

/* ── 13. ACTIVE SECTION ON LOAD ─────────────────────── */
// Set first section active on initial load
window.addEventListener('load', () => {
  if (sections.length > 0) {
    setActiveNav(sections[0].id);
  }
});

/* ── 14. SCROLL PROGRESS (Window) ───────────────────── */
window.addEventListener('scroll', () => {
  const scrollTop     = window.scrollY;
  const docHeight     = document.documentElement.scrollHeight - window.innerHeight;
  const scrolledPct   = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

  // Only update progress if no section is being tracked
  // (section observer handles fine-grained; this is a fallback)
  if (scrolledPct === 100) {
    progressFill.style.width = '100%';
    progressPct.textContent  = '100%';
  }
});

console.log(
  '%c AgenticAI Learning Platform ',
  'background: #d97706; color: white; font-size: 14px; padding: 6px 12px; border-radius: 6px; font-weight: bold;',
  '\n\nPress "T" to toggle theme. Happy learning! 🤖'
);
