// Clients page functionality
(function() {
  'use strict';

  let testimonialsData = [];
  let currentSector = 'Technology';
  let currentTestimonialIndex = 0;
  let autoRotateInterval = null;

  /**
   * Load data from JSON files
   */
  async function loadData() {
    try {
      const testimonialsResponse = await fetch('assets/data/testimonials.json');
      testimonialsData = await testimonialsResponse.json();

      initPage();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  /**
   * Initialize the page
   */
  function initPage() {
    // Initialize tabs
    initTabs();

    // Initialize carousel
    initCarousel();

    // Load testimonials for initial sector
    updateTestimonialsForSector(currentSector);

    // Start auto-rotation
    startAutoRotate();
  }

  /**
   * Initialize tabs for switching sectors
   */
  function initTabs() {
    const tabButtons = document.querySelectorAll('.sector-tab');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const sector = button.dataset.sector;
        switchSector(sector);
      });
    });
  }

  /**
   * Switch to a different sector
   */
  function switchSector(sector) {
    currentSector = sector;
    currentTestimonialIndex = 0;

    // Update active tab
    document.querySelectorAll('.sector-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-sector="${sector}"]`).classList.add('active');

    // Update content
    updateTestimonialsForSector(sector);
    resetCarousel();
  }

  /**
   * Initialize carousel
   */
  function initCarousel() {
    const prevButton = document.getElementById('testimonial-prev');
    const nextButton = document.getElementById('testimonial-next');

    if (prevButton) {
      prevButton.addEventListener('click', () => showPreviousTestimonial());
    }
    if (nextButton) {
      nextButton.addEventListener('click', () => showNextTestimonial());
    }

    // Touch/swipe support for mobile
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
      let touchStartX = 0;
      let touchEndX = 0;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });

      function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
          showNextTestimonial();
        }
        if (touchEndX > touchStartX + 50) {
          showPreviousTestimonial();
        }
      }
    }
  }

  /**
   * Update testimonials for current sector
   */
  function updateTestimonialsForSector(sector) {
    const filteredTestimonials = testimonialsData.testimonials.filter(
      t => t.sector === sector
    );
    
    if (filteredTestimonials.length === 0) return;

    currentTestimonialIndex = 0;
    displayTestimonial(filteredTestimonials[0]);

    // Update carousel if needed
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel && filteredTestimonials.length > 1) {
      const indicators = carousel.querySelector('.carousel-indicators');
      if (indicators) {
        indicators.innerHTML = filteredTestimonials.map((_, index) =>
          `<button class="indicator ${index === 0 ? 'active' : ''}" 
                  aria-label="Go to testimonial ${index + 1}"
                  onclick="showTestimonialByIndex(${index})">
           </button>`
        ).join('');
      }
    }
  }

  /**
   * Display a specific testimonial
   */
  function displayTestimonial(testimonial) {
    const container = document.getElementById('testimonial-content');
    if (!container) return;

    container.innerHTML = `
      <blockquote class="testimonial-quote">"${testimonial.quote}"</blockquote>
      <div class="testimonial-author">
        <div class="author-info">
          <div class="author-name">${testimonial.name}</div>
          <div class="author-title">${testimonial.title}</div>
        </div>
        <div class="author-company">${testimonial.company}</div>
      </div>
    `;
  }

  /**
   * Get current sector testimonials
   */
  function getCurrentSectorTestimonials() {
    return testimonialsData.testimonials.filter(t => t.sector === currentSector);
  }

  /**
   * Show previous testimonial
   */
  function showPreviousTestimonial() {
    const testimonials = getCurrentSectorTestimonials();
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    displayTestimonial(testimonials[currentTestimonialIndex]);
    updateIndicators();
    restartAutoRotate();
  }

  /**
   * Show next testimonial
   */
  function showNextTestimonial() {
    const testimonials = getCurrentSectorTestimonials();
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    displayTestimonial(testimonials[currentTestimonialIndex]);
    updateIndicators();
    restartAutoRotate();
  }

  /**
   * Show testimonial by index (called by indicators)
   */
  window.showTestimonialByIndex = function(index) {
    const testimonials = getCurrentSectorTestimonials();
    if (index >= 0 && index < testimonials.length) {
      currentTestimonialIndex = index;
      displayTestimonial(testimonials[index]);
      updateIndicators();
      restartAutoRotate();
    }
  };

  /**
   * Update carousel indicators
   */
  function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      if (index === currentTestimonialIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  /**
   * Reset carousel to first testimonial
   */
  function resetCarousel() {
    currentTestimonialIndex = 0;
    const testimonials = getCurrentSectorTestimonials();
    if (testimonials.length > 0) {
      displayTestimonial(testimonials[0]);
    }
    restartAutoRotate();
  }

  /**
   * Start auto-rotation
   */
  function startAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
    }
    autoRotateInterval = setInterval(() => {
      showNextTestimonial();
    }, 6000); // 6 seconds
  }

  /**
   * Restart auto-rotation
   */
  function restartAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
    }
    startAutoRotate();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }
})();

