import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu-overlay a');

  const toggleMenu = () => {
    mobileMenuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
  });

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
  elementsToAnimate.forEach(el => {
    if (el.style.getPropertyValue('--delay')) {
      el.style.transitionDelay = el.style.getPropertyValue('--delay');
    }
    observer.observe(el);
  });

  // =====================
  // Animated Number Counter
  // =====================
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  const startCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        counter.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsBanner = document.getElementById('stats-banner');
  if (statsBanner) statsObserver.observe(statsBanner);

  // =====================
  // Alumni Carousel
  // =====================
  const track = document.querySelector('.alumni-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const cards = track.querySelectorAll('.alumni-slide');
    const isMobile = () => window.innerWidth <= 768;
    const cardsPerView = () => isMobile() ? 1 : 2;
    let currentIndex = 0;
    let autoSlideInterval;

    const totalSlides = () => Math.ceil(cards.length / cardsPerView());

    const buildDots = () => {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides(); i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    };

    const updateDots = () => {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    const goToSlide = (index) => {
      const maxIndex = totalSlides() - 1;
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      const slidePercent = 100 / cardsPerView(); // 50% on desktop, 100% on mobile
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    });

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        if (currentIndex >= totalSlides() - 1) {
          goToSlide(0);
        } else {
          goToSlide(currentIndex + 1);
        }
      }, 5000);
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    buildDots();
    startAutoSlide();

    window.addEventListener('resize', () => {
      buildDots();
      goToSlide(0);
    });
  }

  // =====================
  // Image Lightbox
  // =====================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // =====================
  // Scroll to Top Button
  // =====================
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =====================
  // Form Validation
  // =====================
  const form = document.getElementById('contact-form');

  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Please enter your full name';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    },
    email: (value) => {
      if (!value.trim()) return 'Please enter your email address';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
      return '';
    },
    phone: (value) => {
      if (value && !/^[0-9+\-()\s]{7,15}$/.test(value)) return 'Please enter a valid phone number';
      return '';
    },
    message: (value) => {
      if (!value.trim()) return 'Please enter your message';
      if (value.trim().length < 10) return 'Message must be at least 10 characters';
      return '';
    }
  };

  const validateField = (input) => {
    const group = input.closest('.form-group');
    const feedback = group.querySelector('.form-feedback');
    const validator = validators[input.id];

    if (!validator) return true;

    const error = validator(input.value);
    if (error) {
      group.classList.remove('valid');
      group.classList.add('invalid');
      feedback.textContent = error;
      return false;
    } else {
      group.classList.remove('invalid');
      group.classList.add('valid');
      feedback.textContent = input.id === 'phone' && !input.value ? '' : 'Looks good!';
      if (!input.value && input.id === 'phone') group.classList.remove('valid');
      return true;
    }
  };

  if (form) {
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group').classList.contains('invalid')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      let allValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) {
        e.preventDefault();
      }
    });
  }
});
