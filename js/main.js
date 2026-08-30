/**
 * Main Entry Point
 * Initializes all modules after DOM is ready
 */
(function () {
  'use strict';

  function init() {
    // Initialize modules if they exist (graceful degradation)
    if (window.NavModule) window.NavModule.init();
    if (window.AnimationsModule) window.AnimationsModule.init();
    if (window.CaseStudiesModule) window.CaseStudiesModule.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
