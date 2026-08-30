/**
 * Case Studies Module
 * Handles: expand/collapse case study details with proper ARIA and focus management
 */
(function () {
  'use strict';

  const SELECTOR = '.case-study';

  function init() {
    const studies = document.querySelectorAll(SELECTOR);
    studies.forEach(setupCaseStudy);
  }

  function setupCaseStudy(study) {
    const header = study.querySelector('.case-study__header');
    const body = study.querySelector('.case-study__body');
    const toggle = study.querySelector('.case-study__toggle');

    if (!header || !body) return;

    // Set initial state
    study.setAttribute('data-expanded', 'false');
    body.setAttribute('aria-hidden', 'true');
    body.style.maxHeight = '0';

    header.addEventListener('click', () => {
      toggleStudy(study, body);
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleStudy(study, body);
      }
    });
  }

  function toggleStudy(study, body) {
    const isExpanded = study.getAttribute('data-expanded') === 'true';

    if (isExpanded) {
      collapseStudy(study, body);
    } else {
      expandStudy(study, body);
    }
  }

  function expandStudy(study, body) {
    study.setAttribute('data-expanded', 'true');
    body.setAttribute('aria-hidden', 'false');

    // Animate max-height
    const contentHeight = body.scrollHeight;
    body.style.maxHeight = contentHeight + 'px';

    // Update header aria
    const header = study.querySelector('.case-study__header');
    if (header) header.setAttribute('aria-expanded', 'true');
  }

  function collapseStudy(study, body) {
    study.setAttribute('data-expanded', 'false');
    body.setAttribute('aria-hidden', 'true');
    body.style.maxHeight = '0';

    const header = study.querySelector('.case-study__header');
    if (header) header.setAttribute('aria-expanded', 'false');
  }

  window.CaseStudiesModule = { init };
})();
