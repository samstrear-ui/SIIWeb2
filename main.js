/* ===================================
   SII - MAIN JAVASCRIPT
   =================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // MOBILE NAVIGATION TOGGLE
  // ===================================
  
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      
      // Update aria-expanded for accessibility
      const isOpen = navLinks.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    
    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('nav')) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  // ===================================
  // ACCORDION FUNCTIONALITY
  // ===================================
  
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(accordion => {
    const header = accordion.querySelector('.accordion-header');
    
    if (header) {
      header.addEventListener('click', function() {
        // Toggle current accordion
        accordion.classList.toggle('active');
      });
    }
  });
  
  // Check if there's a hash in the URL and open the corresponding accordion
  if (window.location.hash) {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    const targetAccordion = document.getElementById(hash);
    
    if (targetAccordion && targetAccordion.classList.contains('accordion')) {
      // Open the accordion
      targetAccordion.classList.add('active');
      
      // Scroll to the accordion with offset for header
      setTimeout(() => {
        const headerOffset = 80;
        const elementPosition = targetAccordion.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  }
  
  // ===================================
  // PROJECT SLIDER FUNCTIONALITY
  // ===================================
  
  const projectSliders = document.querySelectorAll('.project-slider');
  
  projectSliders.forEach(slider => {
    const container = slider.querySelector('.project-slider-container');
    const slides = slider.querySelectorAll('.project-slide');
    const prevBtn = slider.querySelector('.project-slider-btn.prev');
    const nextBtn = slider.querySelector('.project-slider-btn.next');
    
    // Only initialize if there are multiple slides
    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }
    
    let currentIndex = 0;
    const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(container).gap);
    
    // Update slider position
    function updateSlider() {
      container.scrollTo({
        left: currentIndex * slideWidth,
        behavior: 'smooth'
      });
      
      // Update button states
      if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
      }
      if (nextBtn) {
        nextBtn.disabled = currentIndex >= slides.length - 1;
      }
    }
    
    // Previous button
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      });
    }
    
    // Next button
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        if (currentIndex < slides.length - 1) {
          currentIndex++;
          updateSlider();
        }
      });
    }
    
    // Touch/swipe support
    let startX = 0;
    let scrollLeft = 0;
    
    container.addEventListener('touchstart', function(e) {
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    
    container.addEventListener('touchmove', function(e) {
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
    
    // Update on scroll (for manual scrolling)
    container.addEventListener('scroll', function() {
      const newIndex = Math.round(container.scrollLeft / slideWidth);
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= slides.length - 1;
      }
    });
    
    // Initialize button states
    updateSlider();
    
    // Handle window resize
    window.addEventListener('resize', function() {
      const newSlideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(container).gap);
      if (newSlideWidth !== slideWidth) {
        updateSlider();
      }
    });
  });
  
  // ===================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ===================================
  
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ===================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ===================================
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.nav-links a');
  
  navLinksAll.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === '/' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // ===================================
  // FORM VALIDATION (for contact page)
  // ===================================
  
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Honeypot validation (spam protection)
      const honeypot = document.getElementById('website');
      if (honeypot && honeypot.value.trim() !== '') {
        // Bot detected - silently fail
        console.log('Spam detected');
        return;
      }
      
      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Basic validation
      if (!name || !email || !message) {
        alert('Please fill in all required fields (Name, Email, and Message).');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // If validation passes
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
      
      // In a real application, you would send the form data to a server here
      // Example:
      // fetch('/api/contact', {
      //   method: 'POST',
      //   body: JSON.stringify({ name, email, phone, message }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
    });
  }
  
  // ===================================
  // FADE-IN ANIMATION ON SCROLL
  // ===================================
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Apply fade-in to cards
  const cards = document.querySelectorAll('.card, .team-member, .project-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
  
});
