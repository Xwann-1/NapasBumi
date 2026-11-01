/**
 * NapasBumi — Core Application Module
 * Handles: navigation, localStorage, user profile, toast notifications, utilities
 */

'use strict';

// ── Constants ──────────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  USER:          'napas_user',
  CARBON_HISTORY:'napas_carbon_history',
  ECO_ACTIONS:   'napas_eco_actions',
  REPORTS:       'napas_reports',
  POINTS:        'napas_points',
  ACHIEVEMENTS:  'napas_achievements',
};

const DEFAULT_USER = {
  name: 'Pengguna NapasBumi',
  email: 'user@napasbumi.id',
  location: 'Jakarta, DKI Jakarta',
  joinDate: new Date().toISOString(),
  avatar: null,
};

// ── Storage Helpers ────────────────────────────────────────────────────────────
const Storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  update(key, updater, fallback = {}) {
    const current = this.get(key, fallback);
    this.set(key, updater(current));
  },
};

// ── User ──────────────────────────────────────────────────────────────────────
const User = {
  get() {
    return Storage.get(STORAGE_KEYS.USER, DEFAULT_USER);
  },
  save(data) {
    Storage.set(STORAGE_KEYS.USER, { ...this.get(), ...data });
  },
  getPoints() {
    return Storage.get(STORAGE_KEYS.POINTS, 0);
  },
  addPoints(pts) {
    const cur = this.getPoints();
    Storage.set(STORAGE_KEYS.POINTS, cur + pts);
    return cur + pts;
  },
};

// ── Toast Notification ────────────────────────────────────────────────────────
let _toastTimer = null;
function showToast(message, type = 'success', duration = 3500) {
  let toast = document.getElementById('toast-global');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-global';
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);
  }

  const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="font-size:1.25rem">${icons[type] || icons.info}</span>
    <div>
      <p style="margin:0;font-weight:600;font-size:0.9rem;color:#1f2328">${escapeHtml(message)}</p>
    </div>
    <button onclick="this.parentElement.classList.remove('show')" 
            style="margin-left:auto;border:none;background:none;cursor:pointer;color:#9ca3af;font-size:1rem">✕</button>
  `;

  clearTimeout(_toastTimer);
  toast.classList.add('show');
  _toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── XSS Prevention ────────────────────────────────────────────────────────────
function escapeHtml(str) {
  const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

function sanitizeText(str) {
  return String(str).replace(/<[^>]*>/g, '').trim();
}

// ── Navbar Active State ───────────────────────────────────────────────────────
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();
    link.classList.toggle('active', linkPage === path);
  });
}

// ── Mobile Menu ───────────────────────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ── Navbar scroll shadow ──────────────────────────────────────────────────────
function initNavbarScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const handler = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', handler, { passive: true });
}

// ── Tab System ────────────────────────────────────────────────────────────────
function initTabs(containerSelector) {
  const containers = document.querySelectorAll(containerSelector || '[data-tabs]');
  containers.forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels  = container.querySelectorAll('.tab-panel');

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });

    // Activate first by default
    if (buttons[0]) buttons[0].classList.add('active');
    if (panels[0])  panels[0].classList.add('active');
  });
}

// ── Number Animation ──────────────────────────────────────────────────────────
function animateCounter(el, target, duration = 1500, prefix = '', suffix = '') {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (target - start) * ease);
    el.textContent = prefix + value.toLocaleString('id-ID') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Intersection Observer for animations ──────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// ── Format date ───────────────────────────────────────────────────────────────
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ── Form Validation Helpers ───────────────────────────────────────────────────
function validateRequired(input) {
  const val = input.value.trim();
  const err = input.parentElement.querySelector('.form-error-msg');
  if (!val) {
    input.classList.add('error');
    if (err) err.classList.add('show');
    return false;
  }
  input.classList.remove('error');
  if (err) err.classList.remove('show');
  return true;
}

function validateEmail(input) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const err = input.parentElement.querySelector('.form-error-msg');
  if (!re.test(input.value.trim())) {
    input.classList.add('error');
    if (err) err.classList.add('show');
    return false;
  }
  input.classList.remove('error');
  if (err) err.classList.remove('show');
  return true;
}

// ── Points & Level ────────────────────────────────────────────────────────────
function getLevel(points) {
  if (points < 50)   return { level: 1, name: 'Penjaga Bumi Pemula', next: 50 };
  if (points < 150)  return { level: 2, name: 'Penghijauan Aktif',   next: 150 };
  if (points < 300)  return { level: 3, name: 'Pahlawan Lingkungan', next: 300 };
  if (points < 500)  return { level: 4, name: 'Pelindung Hutan',     next: 500 };
  return               { level: 5, name: 'Duta Bumi',               next: 500 };
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  initMobileMenu();
  initNavbarScroll();
  initTabs();
  initScrollAnimations();

  // Expose globals for other modules
  window.NapasBumi = {
    Storage, User, STORAGE_KEYS,
    showToast, escapeHtml, sanitizeText,
    formatDate, formatDateTime,
    animateCounter, getLevel,
    validateRequired, validateEmail,
  };
});
