/* ==========================================================================
   ALEX CARTER - PORTFOLIO INTERACTION SCRIPT
   - Scroll-Reveal Animations (Intersection Observer)
   - Mobile Navigation Menu Toggle
   - Accessible FAQ Accordion Enhancement
   - Form Validation & Feedback
   - Header Blur & Dynamic Active States
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.backgroundColor = 'rgba(10, 10, 11, 0.92)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.backgroundColor = 'rgba(10, 10, 11, 0.75)';
      header.style.boxShadow = 'none';
    }
  });

  // 4. Contact Form Validation & Async Feedback
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const projectType = document.getElementById('project-type').value;
      const budget = document.getElementById('budget').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !projectType || !budget || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please complete all required fields before submitting.';
        return;
      }

      // Simple Email Regex Validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please enter a valid email address.';
        return;
      }

      // Simulate Successful Async Submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      setTimeout(() => {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Thank you, ' + name + '! Your project brief has been received. Alex will respond within 24 hours.';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }, 1200);
    });
  }
});
