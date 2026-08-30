/**
 * Navigation Module
 * Handles: mobile menu toggle, scroll-based header, active nav highlighting,
 * smooth scroll, focus trap, keyboard interactions
 */
(function () {
  'use strict';

  const SELECTORS = {
    header: '.site-header',
    toggle: '.header__toggle',
    mobileNav: '.mobile-nav',
    overlay: '.mobile-nav__overlay',
    mobileLinks: '.mobile-nav__link',
    navLinks: '.nav__link',
    sections: 'section[id]',
  };

  const CLASSES = {
    scrolled: 'is-scrolled',
    open: 'is-open',
    visible: 'is-visible',
  };

  let header, toggle, mobileNav, overlay;
  let isMenuOpen = false;
  let focusableElements = [];
  let firstFocusable, lastFocusable;

  function init() {
    header = document.querySelector(SELECTORS.header);
    toggle = document.querySelector(SELECTORS.toggle);
    mobileNav = document.querySelector(SELECTORS.mobileNav);
    overlay = document.querySelector(SELECTORS.overlay);

    if (!header) return;

    setupScrollBehavior();
    setupMobileMenu();
    setupSmoothScroll();
    setupActiveNavHighlighting();
  }

  // --- Scroll-based header background ---
  function setupScrollBehavior() {
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            header.classList.add(CLASSES.scrolled);
          } else {
            header.classList.remove(CLASSES.scrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Check initial state
    onScroll();
  }

  // --- Mobile menu ---
  function setupMobileMenu() {
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', toggleMenu);

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Keyboard: Escape closes menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close menu on link click
    const mobileLinks = mobileNav.querySelectorAll(SELECTORS.mobileLinks);
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    isMenuOpen = true;
    toggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add(CLASSES.open);
    mobileNav.removeAttribute('inert');
    if (overlay) overlay.classList.add(CLASSES.visible);
    document.body.style.overflow = 'hidden';

    // Setup focus trap
    setupFocusTrap();

    // Focus first link
    const firstLink = mobileNav.querySelector(SELECTORS.mobileLinks);
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  function closeMenu() {
    isMenuOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove(CLASSES.open);
    mobileNav.setAttribute('inert', '');
    if (overlay) overlay.classList.remove(CLASSES.visible);
    document.body.style.overflow = '';
  }

  function setupFocusTrap() {
    focusableElements = mobileNav.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    firstFocusable = focusableElements[0];
    lastFocusable = focusableElements[focusableElements.length - 1];

    mobileNav.addEventListener('keydown', trapFocus);
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  // --- Smooth scroll for anchor links ---
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerOffset = header ? header.offsetHeight + 16 : 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });

        // Update URL without scrolling
        history.pushState(null, '', targetId);
      });
    });
  }

  // --- Active nav highlighting on scroll ---
  function setupActiveNavHighlighting() {
    const sections = document.querySelectorAll(SELECTORS.sections);
    const navLinks = document.querySelectorAll(SELECTORS.navLinks);
    const mobileLinks = document.querySelectorAll(`${SELECTORS.mobileNav} ${SELECTORS.mobileLinks}`);

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            setActiveLink(id, navLinks);
            setActiveLink(id, mobileLinks);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function setActiveLink(sectionId, links) {
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // --- Utility ---
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Export init
  window.NavModule = { init };
})();
