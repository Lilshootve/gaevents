// Clients page functionality
(function() {
  'use strict';

  let testimonialsData = [];
  let caseStudiesData = [];
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

      const caseStudiesResponse = await fetch('assets/data/case_studies.json');
      caseStudiesData = await caseStudiesResponse.json();

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

    // Initialize case studies
    renderCaseStudies();

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
    renderCaseStudies();
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

  /**
   * Render case studies
   */
  function renderCaseStudies() {
    const container = document.getElementById('case-studies-grid');
    if (!container) return;

    const sectorCaseStudies = caseStudiesData.caseStudies.filter(
      cs => cs.sector === currentSector
    );

    if (sectorCaseStudies.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-400">No case studies available for this sector.</p>';
      return;
    }

    container.innerHTML = sectorCaseStudies.map(cs => `
      <div class="case-study-card">
        <div class="case-study-header">
          <h3 class="case-study-title">${cs.title}</h3>
          <div class="case-study-meta">
            <span class="case-study-event">${cs.event}</span>
            <span class="case-study-location">${cs.location}</span>
          </div>
        </div>
        <div class="case-study-content">
          <div class="case-study-details">
            <div class="detail-item">
              <strong>Client:</strong> ${cs.client}
            </div>
            <div class="detail-item">
              <strong>Attendees:</strong> ${cs.attendees}
            </div>
            <div class="detail-item">
              <strong>Duration:</strong> ${cs.duration}
            </div>
          </div>
          <div class="case-study-section">
            <h4 class="section-title">Challenge</h4>
            <p>${cs.challenge}</p>
          </div>
          <div class="case-study-section">
            <h4 class="section-title">Solution</h4>
            <p>${cs.solution}</p>
          </div>
          <div class="case-study-section">
            <h4 class="section-title">Results</h4>
            <ul class="results-list">
              ${cs.results.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
          <div class="case-study-services">
            <h4 class="section-title">Services Provided</h4>
            <div class="services-tags">
              ${cs.services.map(s => `<span class="service-tag">${s}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }
})();

