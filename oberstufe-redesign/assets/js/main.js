/* =========================================================
   oberstufe.site – Gemeinsame JS-Utilities v3.0
   ========================================================= */

// ── Theme ──────────────────────────────────────────────────
(function () {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {

  // Theme Toggle
  const themeBtn = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    if (mobileThemeToggle) mobileThemeToggle.checked = t === 'dark';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
  if (mobileThemeToggle) {
    // Sync initial state
    mobileThemeToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
    mobileThemeToggle.addEventListener('change', () => {
      setTheme(mobileThemeToggle.checked ? 'dark' : 'light');
    });
  }

  // ── Mobile Nav ──────────────────────────────────────────
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavClose = document.getElementById('mobileNavClose');

  function openMobileNav() {
    mobileNav && mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    mobileNav && mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  burgerBtn && burgerBtn.addEventListener('click', openMobileNav);
  mobileNavOverlay && mobileNavOverlay.addEventListener('click', closeMobileNav);
  mobileNavClose && mobileNavClose.addEventListener('click', closeMobileNav);

  // Escape key closes nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // ── Back to Top ─────────────────────────────────────────
  const toTopBtn = document.getElementById('toTop');
  if (toTopBtn) {
    window.addEventListener('scroll', () => {
      toTopBtn.classList.toggle('show', window.scrollY > 400);
    });
    toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Keyboard Shortcut Ctrl/Cmd+K → Fokus Search ─────────
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.focus();
    }
    // "/" öffnet Suche (falls nicht in einem Input)
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.focus();
    }
  });

  // ── FAQ Accordion ────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (q) {
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ── Card IntersectionObserver (fade-in) ──────────────────
  window.attachCardObserver = function () {
    const cards = document.querySelectorAll('.card:not(.visible)');
    if (!cards.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    cards.forEach(c => io.observe(c));
  };

});

// ── Toast Utility (global) ──────────────────────────────────
window.showToast = function (msg, type = 'default', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = {
    default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`,
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
  };
  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'success') toast.style.background = 'var(--green)';
  if (type === 'error') toast.style.background = 'var(--red)';
  toast.innerHTML = `${icons[type] || icons.default}<span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
};
