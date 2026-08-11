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
    // Apply delay if specified in inline style
    if (el.style.getPropertyValue('--delay')) {
      el.style.transitionDelay = el.style.getPropertyValue('--delay');
    }
    observer.observe(el);
  });
});
