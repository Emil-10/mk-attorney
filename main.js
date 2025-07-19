// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeWebsite();
});

function initializeWebsite() {
  setupSmoothScrolling();
  setupSectionReveal();
  setupLanguageToggle();
  setupMobileMenu();
  setupNavbarScroll();
  setupContactForm();
  setupFloatingAnimations();
}

// Smooth scroll for nav links
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });
}

// Section reveal on scroll with enhanced animation
function setupSectionReveal() {
  const sections = document.querySelectorAll('[data-section]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach(section => {
    observer.observe(section);
  });
}

// Enhanced language toggle
function setupLanguageToggle() {
  const langToggle = document.getElementById('lang-toggle');
  const flagDe = document.getElementById('flag-de');
  const flagEn = document.getElementById('flag-en');

  function setLanguage(lang) {
    // Update content visibility
    document.querySelectorAll('.lang-de').forEach(el => {
      el.classList.toggle('hidden', lang !== 'de');
    });
    document.querySelectorAll('.lang-en').forEach(el => {
      el.classList.toggle('hidden', lang !== 'en');
    });
    
    // Update flags
    if (flagDe && flagEn) {
      flagDe.classList.toggle('hidden', lang !== 'de');
      flagEn.classList.toggle('hidden', lang !== 'en');
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Save preference
    localStorage.setItem('lang', lang);
    
    // Update page title
    const title = lang === 'de' 
      ? 'Christian Mkhitaryan - Fachanwalt für Migrationsrecht | Aschaffenburg'
      : 'Christian Mkhitaryan - Specialist Lawyer for Migration Law | Aschaffenburg';
    document.title = title;
  }

  if (langToggle) {
    // Initialize language
    const savedLang = localStorage.getItem('lang') || 'de';
    setLanguage(savedLang);
    
    // Add click handler
    langToggle.addEventListener('click', () => {
      const currentLang = document.documentElement.lang || 'de';
      const newLang = currentLang === 'de' ? 'en' : 'de';
      setLanguage(newLang);
    });
  }
}

// Mobile menu functionality
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      
      // Update button icon
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  }
}

// Navbar scroll effect
function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  
  if (navbar) {
    // Set initial state
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    }
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      } else {
        navbar.classList.remove('navbar-scrolled');
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
      }
    });
  }
}

// Enhanced contact form
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      const lang = document.documentElement.lang || 'de';
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin mr-2"></i>
        ${lang === 'de' ? 'Wird gesendet...' : 'Sending...'}
      `;
      
      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          // Show success message
          const successEl = lang === 'de' 
            ? document.getElementById('form-success')
            : document.getElementById('form-success-en');
          
          if (successEl) {
            successEl.classList.remove('hidden');
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
              successEl.classList.add('hidden');
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }, 5000);
          }
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error:', error);
        alert(lang === 'de' 
          ? 'Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.' 
          : 'Error sending message. Please try again later.');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
    
    // Form validation feedback
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearValidation);
    });
  }
}

// Field validation
function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  
  // Remove existing validation classes
  field.classList.remove('border-red-500', 'border-green-500');
  
  if (field.hasAttribute('required') && !value) {
    field.classList.add('border-red-500');
  } else if (field.type === 'email' && value && !isValidEmail(value)) {
    field.classList.add('border-red-500');
  } else if (value) {
    field.classList.add('border-green-500');
  }
}

function clearValidation(e) {
  const field = e.target;
  field.classList.remove('border-red-500', 'border-green-500');
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Floating animations
function setupFloatingAnimations() {
  const floatingElements = document.querySelectorAll('.absolute');
  
  floatingElements.forEach((element, index) => {
    if (element.classList.contains('w-20') || element.classList.contains('w-16')) {
      element.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
      element.style.animationDelay = `${index * 0.2}s`;
    }
  });
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance optimization
const debouncedScroll = debounce(() => {
  setupNavbarScroll();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Accessibility improvements
document.addEventListener('keydown', function(e) {
  // ESC key closes mobile menu
  if (e.key === 'Escape') {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  }
});

// Preload critical resources
function preloadResources() {
  const criticalImages = [
    'assets/khachik-mkhitaryan.png'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Initialize preloading
preloadResources(); 