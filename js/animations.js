/**
 * Animations Module
 * Handles: Intersection Observer scroll-triggered reveals
 * Respects prefers-reduced-motion
 */
(function () {
  'use strict';

  const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  const VISIBLE_CLASS = 'is-visible';

  function init() {
    // If user prefers reduced motion, make everything visible immediately
    if (prefersReducedMotion()) {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        el.classList.add(VISIBLE_CLASS);
      });
      return;
    }

    const elements = document.querySelectorAll(SELECTOR);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(VISIBLE_CLASS);
            obs.unobserve(entry.target); // Only animate once
          }
        });
      },
      {
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  window.AnimationsModule = { init };
})();
