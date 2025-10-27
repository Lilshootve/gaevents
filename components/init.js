// Component initialization and utilities
(function() {
  'use strict';

  /**
   * Initialize header component with active state
   */
  function initHeader() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a[href]');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('text-[var(--color-gold)]', 'font-semibold');
      } else {
        link.setAttribute('aria-current', 'false');
      }
    });
  }

  /**
   * Initialize skip link
   */
  function initSkipLink() {
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  /**
   * Handle form validation
   */
  function initForms() {
    const forms = document.querySelectorAll('form[method="post"]');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        const honeypot = form.querySelector('[name="website"]');
        if (honeypot && honeypot.value) {
          e.preventDefault();
          return false;
        }
      });
    });
  }

  /**
   * Add animation observers for AOS (Animate On Scroll)
   */
  function initAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && typeof AOS !== 'undefined') {
      AOS.init({
        duration: 400,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
      });
    }
  }

  /**
   * Lazy load images
   */
  function initLazyImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * Add smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  /**
   * Initialize all components
   */
  function init() {
    initHeader();
    initSkipLink();
    initForms();
    initAnimations();
    initLazyImages();
    initSmoothScroll();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

