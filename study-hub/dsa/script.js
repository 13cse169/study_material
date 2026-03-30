/* ═══════════════════════════════════════════════
   DSA Mastery Platform — script.js
   Features: Theme toggle, Tab switching, Copy code,
             Active nav highlight, Progress tracking,
             Hint toggles, Mobile sidebar, Q&A collapse
═══════════════════════════════════════════════ */

'use strict';

/* ── DOM References ── */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const hamburger   = document.getElementById('hamburger');
const sidebar     = document.getElementById('sidebar');
const overlay     = document.getElementById('overlay');
const navLinks    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('.topic-section[id]');
const progressFill  = document.getElementById('progressFill');
const progressCount = document.getElementById('progressCount');

const TOTAL_TOPICS = 13; // excludes practice
let completedTopics = new Set();

/* ═══════════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════════ */
const savedTheme = localStorage.getItem('dsa-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('dsa-theme', next);
});

/* ═══════════════════════════════════════════════
   MOBILE SIDEBAR
═══════════════════════════════════════════════ */
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
overlay.addEventListener('click', closeSidebar);

// Close sidebar when a nav link is clicked on mobile
sidebar.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeSidebar();
  });
});

/* ═══════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════ */
document.querySelectorAll('.tabs-container').forEach(container => {
  const buttons  = container.querySelectorAll('.tab-btn');
  const contents = container.querySelectorAll('.tab-content');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      buttons.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = container.querySelector(`[data-content="${target}"]`);
      if (targetContent) targetContent.classList.add('active');
    });
  });
});

/* ═══════════════════════════════════════════════
   COPY CODE BUTTON
═══════════════════════════════════════════════ */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const targetId = btn.getAttribute('data-copy');
    const codeEl   = document.getElementById(targetId);
    if (!codeEl) return;

    const rawText = codeEl.innerText || codeEl.textContent;

    try {
      await navigator.clipboard.writeText(rawText);
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1800);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = rawText;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1800);
    }
  });
});

/* ═══════════════════════════════════════════════
   PROGRESS TRACKING
═══════════════════════════════════════════════ */
function updateProgressUI() {
  const count   = completedTopics.size;
  const percent = (count / TOTAL_TOPICS) * 100;
  progressFill.style.width = `${Math.min(percent, 100)}%`;
  progressCount.textContent = `${count}/${TOTAL_TOPICS}`;

  // Celebratory pulse if all complete
  if (count >= TOTAL_TOPICS) {
    progressFill.style.background = 'linear-gradient(90deg, #22c55e, #34d399)';
  } else {
    progressFill.style.background = '';
  }
}

function loadProgress() {
  const stored = localStorage.getItem('dsa-progress');
  if (stored) {
    const arr = JSON.parse(stored);
    arr.forEach(topic => {
      completedTopics.add(topic);
      markTopicComplete(topic, false); // apply UI without saving again
    });
    updateProgressUI();
  }
}

function saveProgress() {
  localStorage.setItem('dsa-progress', JSON.stringify([...completedTopics]));
}

function markTopicComplete(topic, save = true) {
  completedTopics.add(topic);

  // Update nav check
  const checkEl = document.querySelector(`[data-check="${topic}"]`);
  if (checkEl) {
    checkEl.textContent = '✓';
    checkEl.classList.add('checked');
  }

  // Update button
  const btn = document.querySelector(`.mark-complete-btn[data-topic="${topic}"]`);
  if (btn) {
    btn.classList.add('completed');
    btn.textContent = 'Completed ✓';
  }

  // Update nav link
  const navLink = document.querySelector(`.nav-link[href="#${topic}"]`);
  if (navLink) navLink.style.opacity = '';

  if (save) {
    saveProgress();
    updateProgressUI();
  }
}

function unmarkTopicComplete(topic) {
  completedTopics.delete(topic);

  const checkEl = document.querySelector(`[data-check="${topic}"]`);
  if (checkEl) {
    checkEl.textContent = '☐';
    checkEl.classList.remove('checked');
  }

  const btn = document.querySelector(`.mark-complete-btn[data-topic="${topic}"]`);
  if (btn) {
    btn.classList.remove('completed');
    btn.textContent = 'Mark as Complete';
  }

  saveProgress();
  updateProgressUI();
}

// Toggle complete on button click
document.querySelectorAll('.mark-complete-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const topic = btn.getAttribute('data-topic');
    if (completedTopics.has(topic)) {
      unmarkTopicComplete(topic);
    } else {
      markTopicComplete(topic);
      // Subtle flash animation
      btn.style.transform = 'scale(1.05)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    }
  });
});

// Load saved progress on start
loadProgress();

/* ═══════════════════════════════════════════════
   ACTIVE NAVIGATION HIGHLIGHT (Intersection Observer)
═══════════════════════════════════════════════ */
let activeSection = null;

const observerOptions = {
  rootMargin: `-${document.querySelector('.topbar').offsetHeight + 20}px 0px -60% 0px`,
  threshold: 0
};

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      setActiveNav(id);
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

function setActiveNav(id) {
  if (activeSection === id) return;
  activeSection = id;

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${id}`) {
      link.classList.add('active');
      // Scroll nav item into view (for long nav lists)
      link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}

/* ═══════════════════════════════════════════════
   Q&A COLLAPSE / EXPAND (click to toggle)
═══════════════════════════════════════════════ */
document.querySelectorAll('.qa-question').forEach(question => {
  // Answers start visible — let users collapse them
  const answer = question.nextElementSibling;
  if (!answer) return;

  // Store original display
  question.style.cursor = 'pointer';
  question.setAttribute('title', 'Click to toggle answer');

  question.addEventListener('click', () => {
    const isOpen = answer.style.display !== 'none';
    answer.style.display = isOpen ? 'none' : 'block';
    question.style.opacity = isOpen ? '0.7' : '1';
  });
});

/* ═══════════════════════════════════════════════
   HINT TOGGLES (Practice Section)
═══════════════════════════════════════════════ */
document.querySelectorAll('.hint-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const toggle  = btn.closest('.hint-toggle');
    const hintId  = toggle.getAttribute('data-hint');
    const content = document.getElementById(hintId);
    if (!content) return;

    const isVisible = content.classList.contains('visible');
    content.classList.toggle('visible', !isVisible);
    btn.textContent = isVisible ? 'Hint' : 'Hide Hint';
  });
});

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL — account for fixed topbar
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId  = anchor.getAttribute('href').slice(1);
    const targetEl  = document.getElementById(targetId);
    if (!targetEl) return;
    e.preventDefault();

    const topbarH = document.querySelector('.topbar').offsetHeight;
    const top     = targetEl.getBoundingClientRect().top + window.scrollY - topbarH - 12;

    window.scrollTo({ top, behavior: 'smooth' });
    if (window.innerWidth <= 768) closeSidebar();
  });
});

/* ═══════════════════════════════════════════════
   KEYBOARD ACCESSIBILITY
═══════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && sidebar.classList.contains('open')) {
    closeSidebar();
  }
});

/* ═══════════════════════════════════════════════
   INIT COMPLETE
═══════════════════════════════════════════════ */
console.log(
  '%cDSA Mastery Platform Loaded ✓',
  'color: #7c9dff; font-family: monospace; font-size: 14px; font-weight: bold;'
);
