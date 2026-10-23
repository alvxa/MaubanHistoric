(function() {
  'use strict';

  // ==========================================
  // 1. Mobile Navigation
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
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
  }

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
      // Only highlight if the href matches the current section id
      if (href === current) {
        link.classList.add('active');
      }
      if (current === 'about-page' && href === '#about') {
        link.classList.add('active');
      }
      if (current === 'about' && href === '#about') {
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

  if (backToTop) {
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
  }

  // ==========================================
  // 4. Lightbox for Heritage Cards
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const flashcardTrack = document.getElementById('flashcardTrack');

  if (flashcardTrack) {
    flashcardTrack.addEventListener('click', function(e) {
      const card = e.target.closest('.flashcard');
      if (card) {
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
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', function() {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }
  });

  // ==========================================
  // 5. Smooth scrolling for anchor links (within same page)
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

  // Handle smooth scroll when landing on page with a hash
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        setTimeout(() => {
          const offset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
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
  // 7. SEARCH FUNCTIONALITY (WITH HIGHLIGHTING & REDIRECT)
  // ==========================================
  const searchToggle = document.getElementById('searchToggle');
  const searchInput = document.getElementById('searchInput');
  
  if (searchToggle && searchInput) {
    const searchableSections = [
      { id: 'history', selector: '.page-section#history' },
      { id: 'natural', selector: '.page-section#natural' },
      { id: 'heritage', selector: '.page-section#heritage' },
      { id: 'landmarks', selector: '.page-section#landmarks' }
    ];

    const searchableElements = [];
    searchableSections.forEach(section => {
      const container = document.querySelector(section.selector);
      if (container) {
        container.querySelectorAll('h3, p').forEach(el => {
          if (!el.dataset.originalHtml) {
            el.dataset.originalHtml = el.innerHTML;
            searchableElements.push(el);
          }
        });
      }
    });

    function clearSearch() {
      searchableElements.forEach(el => {
        el.innerHTML = el.dataset.originalHtml;
      });
    }

    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      searchInput.classList.toggle('active');
      if (searchInput.classList.contains('active')) {
        searchInput.focus();
      } else {
        searchInput.value = '';
        clearSearch();
      }
    });

    function filterAttractions(query) {
      const q = query.toLowerCase().trim();
      clearSearch();

      if (q === '') return;

      let firstMatchSectionId = null;

      searchableElements.forEach(el => {
        const text = el.textContent.toLowerCase();
        
        if (text.includes(q)) {
          const regex = new RegExp(`(${q})`, 'gi');
          el.innerHTML = el.innerHTML.replace(regex, '<mark>$1</mark>');

          if (!firstMatchSectionId) {
            const parentSection = el.closest('section');
            if (parentSection) {
              firstMatchSectionId = parentSection.id;
            }
          }
        }
      });

      if (firstMatchSectionId) {
        const targetElement = document.getElementById(firstMatchSectionId);
        if (targetElement) {
          const offset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
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
        clearSearch();
      }
    });
  }

  // ==========================================
  // 8. AUTO-SWIPE FEATURED ATTRACTIONS
  // ==========================================
  const featuredScroll = document.getElementById('featuredScroll');
  const attractionCards = document.querySelectorAll('.attraction-card');
  
  if (featuredScroll) {
    let scrollSpeed = 1;
    let animationFrameId;

    function setupInfiniteScroll() {
      const cards = Array.from(attractionCards);
      cards.forEach(function(card) {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        featuredScroll.appendChild(clone);
      });
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
          if(card.style.display !== 'none') {
             firstSetWidth += card.offsetWidth + marginRight + marginLeft;
          }
        }
        
        if (scrollPos >= firstSetWidth && firstSetWidth > 0) {
          scrollPos -= firstSetWidth;
        }

        scrollWrapper.scrollLeft = scrollPos;
      }

      animationFrameId = requestAnimationFrame(autoSwipe);
    }

    if (scrollWrapper) {
      animationFrameId = requestAnimationFrame(autoSwipe);

      scrollWrapper.addEventListener('mouseenter', function() {
        paused = true;
      });
      scrollWrapper.addEventListener('mouseleave', function() {
        paused = false;
      });

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

    window.addEventListener('beforeunload', function() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });

    window.addEventListener('resize', function() {
      if (scrollWrapper) {
        scrollPos = scrollWrapper.scrollLeft;
      }
    });
  }

  // ==========================================
  // 9. FLASHCARD CAROUSEL LOGIC
  // ==========================================
  const flashcardCards = document.querySelectorAll('.flashcard');
  const prevBtn = document.getElementById('flashcardPrev');
  const nextBtn = document.getElementById('flashcardNext');
  
  if (flashcardTrack && prevBtn && nextBtn) {
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

    updateFlashcards();
  }

  // ==========================================
  // 10. HERO IMAGE SLIDER (AUTOMATIC)
  // ==========================================
  const heroImg = document.getElementById('heroSliderImg');
  
  if (heroImg) {
    const imageSources = heroImg.getAttribute('data-src').split(',');
    let currentImgIndex = 0;

    if (imageSources.length > 1) {
      setInterval(() => {
        heroImg.style.opacity = '0';

        setTimeout(() => {
          currentImgIndex = (currentImgIndex + 1) % imageSources.length;
          heroImg.src = imageSources[currentImgIndex];
          heroImg.style.opacity = '1';
        }, 800); 
      }, 5000); 
    }
  }

})();