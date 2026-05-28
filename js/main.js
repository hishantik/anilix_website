/**
 * Anilix Website - Main Entry Point
 */
import { initScene } from './three-scene.js';
import { initAnimations } from './animations.js';
import { initTerminal } from './terminal.js';

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initMobileNav();
  initCopyButtons();
  initBackToTop();

  const canvas = document.getElementById('three-canvas');
  initScene(canvas);
  initAnimations();
  initTerminal();
});

/* ── LOADING SCREEN ─────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const hide = () => {
    loader.classList.add('is-hidden');
    document.body.style.overflow = '';
  };

  // Hide after animation completes or after 2s max
  const barFill = loader.querySelector('.loader-bar-fill');
  if (barFill) {
    barFill.addEventListener('animationend', () => setTimeout(hide, 300));
  }
  setTimeout(hide, 2000);
}

/* ── MOBILE NAV ─────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!hamburger || !menu) return;

  function toggleMenu(forceOpen) {
    const isOpen = forceOpen ?? !menu.classList.contains('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
    menu.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });
}

/* ── COPY BUTTONS ───────────────────────────────── */
function initCopyButtons() {
  document.querySelectorAll('.install-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.cmd;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.setAttribute('aria-label', 'Copied!');
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.setAttribute('aria-label', 'Copy command');
        }, 2000);
      });
    });
  });
}

/* ── BACK TO TOP ────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('is-visible', window.scrollY > 600);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
