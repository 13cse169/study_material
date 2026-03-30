/* ═══════════════════════════════════════════════════════
   GenAI Guide — script.js
═══════════════════════════════════════════════════════ */

// ── DOM REFS ─────────────────────────────────────────
const html         = document.documentElement;
const sidebar      = document.getElementById('sidebar');
const overlay      = document.getElementById('overlay');
const hamburger    = document.getElementById('hamburger');
const sidebarClose = document.getElementById('sidebarClose');
const progressBar  = document.getElementById('progressBar');
const progressPct  = document.getElementById('progressPct');
const themeCheck   = document.getElementById('themeCheck');
const themeCheckTop= document.getElementById('themeCheckTop');
const themeLabel   = document.getElementById('themeLabel');
const themeIconInner=document.getElementById('themeIconInner');
const themeIconTop = document.getElementById('themeIconTop');

// ── THEME ────────────────────────────────────────────
(function initTheme() {
  // Default: light
  const saved = localStorage.getItem('genai-theme') || 'light';
  applyTheme(saved);
})();

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('genai-theme', theme);

  const isDark = theme === 'dark';
  themeCheck.checked    = isDark;
  themeCheckTop.checked = isDark;
  themeLabel.textContent = isDark ? 'Dark Mode' : 'Light Mode';

  const iconClass = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  themeIconInner.className = iconClass;
  themeIconTop.className   = iconClass;
}

function toggleTheme() {
  const current = html.getAttribute('data-theme') || 'light';
  applyTheme(current === 'light' ? 'dark' : 'light');
}

themeCheck.addEventListener('change',    toggleTheme);
themeCheckTop.addEventListener('change', toggleTheme);

// ── SIDEBAR MOBILE ───────────────────────────────────
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click',    openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click',      closeSidebar);

// Close on nav click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 960) closeSidebar();
  });
});

// ── SMOOTH SCROLL ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = 64;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// ── PROGRESS BAR + ACTIVE NAV ────────────────────────
const sections  = document.querySelectorAll('.page-section');
const navLinks  = document.querySelectorAll('.nav-link[data-s]');

function onScroll() {
  // Progress
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  progressBar.style.width = pct + '%';
  progressPct.textContent = pct + '%';

  // Active section
  let activeId = null;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 100) activeId = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.s === activeId);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run on load

// ── ACCORDION (Interview Q&A) ────────────────────────
document.querySelectorAll('.qa-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains('open');

    // Close all in same group
    const group = btn.closest('.qa-group');
    group.querySelectorAll('.qa-q').forEach(b => b.classList.remove('open'));
    group.querySelectorAll('.qa-a').forEach(a => a.classList.remove('open'));

    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
      // Smooth scroll into view if needed
      setTimeout(() => {
        const rect = btn.getBoundingClientRect();
        if (rect.top < 80) {
          window.scrollBy({ top: rect.top - 80, behavior: 'smooth' });
        }
      }, 100);
    }
  });
});

// ── INTERVIEW TABS ───────────────────────────────────
const itabs     = document.querySelectorAll('.itab');
const qaGroups  = document.querySelectorAll('.qa-group');

itabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const level = tab.dataset.level;

    itabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    qaGroups.forEach(g => {
      g.classList.remove('active-group');
      g.style.display = 'none';
    });

    const target = document.getElementById('qa-' + level);
    if (target) {
      target.classList.add('active-group');
      target.style.display = 'flex';
    }
  });
});

// Ensure default group visible on load
document.getElementById('qa-beginner').style.display = 'flex';

// ── COPY BUTTONS ─────────────────────────────────────
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const pre = document.getElementById(targetId);
    if (!pre) return;

    const text = pre.innerText || pre.textContent;

    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('copied');
      }, 2200);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  });
});

// ── SCROLL REVEAL ────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.07) + 's';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

// Apply reveal class to animatable elements
const revealSelectors = [
  '.card', '.type-card', '.app-card', '.practice-item',
  '.rm-content', '.qa-item', '.limit-item', '.limit-card',
  '.code-block', '.highlight-card', '.diagram-box'
];

revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});

// ── MOUSE-MOVE GLOW ON CARDS ─────────────────────────
document.querySelectorAll('.card, .app-card, .type-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});
