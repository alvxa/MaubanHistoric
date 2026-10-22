(function() {
  'use strict';

  // ==========================================
  // 1. Mobile Navigation
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', function() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ==========================================
  // 2. Active Navigation Highlighting
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function(section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(function(link) {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) {
        link.classList.add('active');
      }
      if (current === 'about-page' && link.getAttribute('href') === '#about') {
        link.classList.add('active');
      }
      if (current === 'about' && link.getAttribute('href') === '#about') {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ==========================================
  // 3. Back to Top
  // ==========================================
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // 4. Lightbox for Heritage Cards
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  // Use event delegation for dynamically updated flashcards
  document.getElementById('flashcardTrack').addEventListener('click', function(e) {
    const card = e.target.closest('.flashcard');
    if (card) {
      // Only open lightbox if the card is currently in the center (pos 0)
      if (card.getAttribute('data-pos') === '0') {
        const imgSrc = card.getAttribute('data-lightbox');
        if (imgSrc) {
          lightboxImg.src = imgSrc;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ==========================================
  // 5. Smooth scrolling for anchor links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 6. Image fallback
  // ==========================================
  document.querySelectorAll('img').forEach(function(img) {
    img.addEventListener('error', function() {
      this.style.background = 'var(--ivory)';
      this.style.border = '1px dashed var(--gold-dim)';
      this.style.minHeight = '120px';
      this.alt = this.alt || 'Image unavailable';
    });
  });

  // ==========================================
  // 7. SEARCH FUNCTIONALITY
  // ==========================================
  const searchToggle = document.getElementById('searchToggle');
  const searchInput = document.getElementById('searchInput');
  const featuredScroll = document.getElementById('featuredScroll');
  const attractionCards = document.querySelectorAll('.attraction-card');

  searchToggle.addEventListener('click', function(e) {
    e.preventDefault();
    searchInput.classList.toggle('active');
    if (searchInput.classList.contains('active')) {
      searchInput.focus();
    } else {
      searchInput.value = '';
      filterAttractions('');
    }
  });

  function filterAttractions(query) {
    const q = query.toLowerCase().trim();
    let visibleCount = 0;

    attractionCards.forEach(function(card) {
      const title = card.getAttribute('data-title').toLowerCase();
      const text = card.querySelector('p').textContent.toLowerCase();
      const match = title.includes(q) || text.includes(q);
      
      if (q === '' || match) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    let noResults = document.getElementById('noResultsMsg');
    if (visibleCount === 0 && q !== '') {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'noResultsMsg';
        noResults.className = 'no-results';
        noResults.textContent = 'No attractions found matching "' + query + '".';
        featuredScroll.appendChild(noResults);
      } else {
        noResults.textContent = 'No attractions found matching "' + query + '".';
      }
    } else {
      if (noResults) {
        noResults.remove();
      }
    }

    if (q !== '') {
      const featuredSection = document.getElementById('featured');
      if (featuredSection) {
        const offset = 80;
        const elementPosition = featuredSection.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    }
  }

  searchInput.addEventListener('input', function() {
    filterAttractions(this.value);
  });

  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.classList.remove('active');
      searchInput.value = '';
      filterAttractions('');
    }
  });

  // ==========================================
  // 8. AUTO-SWIPE FEATURED ATTRACTIONS
  // ==========================================
  let scrollSpeed = 1;
  let animationFrameId;

  function setupInfiniteScroll() {
    const cards = Array.from(attractionCards);
    cards.forEach(function(card) {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      featuredScroll.appendChild(clone);
    });
    updateCardList();
  }

  function updateCardList() {
    if (!featuredScroll.dataset.originalCount) {
      featuredScroll.dataset.originalCount = attractionCards.length;
    }
  }

  setupInfiniteScroll();

  const scrollWrapper = document.querySelector('.featured-scroll-wrapper');
  let lastTimestamp = 0;
  let scrollPos = 0;
  let paused = false;

  function autoSwipe(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!paused && scrollWrapper) {
      scrollPos += scrollSpeed * (delta / 16);
      
      const originalCount = parseInt(featuredScroll.dataset.originalCount) || attractionCards.length;
      const allCards = featuredScroll.querySelectorAll('.attraction-card');
      
      let firstSetWidth = 0;
      for (let i = 0; i < originalCount && i < allCards.length; i++) {
        const card = allCards[i];
        const style = window.getComputedStyle(card);
        const marginRight = parseFloat(style.marginRight) || 0;
        const marginLeft = parseFloat(style.marginLeft) || 0;
        firstSetWidth += card.offsetWidth + marginRight + marginLeft;
      }
      
      if (scrollPos >= firstSetWidth) {
        scrollPos -= firstSetWidth;
      }

      scrollWrapper.scrollLeft = scrollPos;
    }

    animationFrameId = requestAnimationFrame(autoSwipe);
  }

  if (scrollWrapper) {
    animationFrameId = requestAnimationFrame(autoSwipe);
  }

  if (scrollWrapper) {
    scrollWrapper.addEventListener('mouseenter', function() {
      paused = true;
    });
    scrollWrapper.addEventListener('mouseleave', function() {
      paused = false;
    });
  }

  window.addEventListener('beforeunload', function() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  if (scrollWrapper) {
    scrollWrapper.addEventListener('touchstart', function() {
      paused = true;
    }, { passive: true });

    scrollWrapper.addEventListener('touchend', function() {
      setTimeout(function() {
        paused = false;
        scrollPos = scrollWrapper.scrollLeft;
      }, 1000);
    }, { passive: true });
  }

  window.addEventListener('resize', function() {
    if (scrollWrapper) {
      scrollPos = scrollWrapper.scrollLeft;
    }
  });

  // ==========================================
  // 9. FLASHCARD CAROUSEL LOGIC
  // ==========================================
  const flashcardTrack = document.getElementById('flashcardTrack');
  const flashcardCards = document.querySelectorAll('.flashcard');
  const prevBtn = document.getElementById('flashcardPrev');
  const nextBtn = document.getElementById('flashcardNext');
  let currentIndex = 0;

  function updateFlashcards() {
    flashcardCards.forEach((card, index) => {
      let relativePos = index - currentIndex;
      let displayPos = relativePos;
      
      if (displayPos === 0) {
        card.setAttribute('data-pos', '0');
      } else if (displayPos === 1) {
        card.setAttribute('data-pos', '1');
      } else if (displayPos === 2) {
        card.setAttribute('data-pos', '2');
      } else if (displayPos === 3) {
        card.setAttribute('data-pos', '3');
      } else if (displayPos > 3) {
        card.setAttribute('data-pos', '4');
      } else if (displayPos === -1) {
        card.setAttribute('data-pos', '-1');
      } else if (displayPos === -2) {
        card.setAttribute('data-pos', '-2');
      } else if (displayPos === -3) {
        card.setAttribute('data-pos', '-3');
      } else if (displayPos < -3) {
        card.setAttribute('data-pos', '-4');
      }
      
      if (Math.abs(displayPos) > 3) {
        card.style.pointerEvents = 'none';
      } else {
        card.style.pointerEvents = 'auto';
      }
    });
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % flashcardCards.length;
    updateFlashcards();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + flashcardCards.length) % flashcardCards.length;
    updateFlashcards();
  });

  // Initialize
  updateFlashcards();

})();