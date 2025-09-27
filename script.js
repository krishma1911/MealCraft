document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  const headerAvatar = document.getElementById("headerAvatar");
  if (!headerAvatar) return; // Prevent error if element not found

  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  console.log("User Profile:", userProfile);
  const avatar = userProfile.avatar;

  if (avatar) {
    console.log("Setting avatar:", avatar);
    headerAvatar.style.backgroundImage = `url("assets/avatar/${avatar}")`;
    console.log("Background image set to:", headerAvatar.style.backgroundImage);    
    headerAvatar.style.backgroundSize = "cover";
    headerAvatar.style.backgroundPosition = "center";
  }
  else{
     headerAvatar.style.backgroundImage = url("assets/avatar/7.jpg");
  }
  // Toggle menu on hamburger click
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
});

// Close mobile menu when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });


// Carousel Functionality
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.track = document.querySelector('.carousel-track');
        this.carousel = document.querySelector('.carousel-container');
        
        this.init();
    }
    
    init() {
        if (!this.slides.length) return; // safety

        // Show the first slide
        this.updateCarousel();

        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play
        this.startAutoPlay();
        
        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    updateCarousel() {
        this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});


// FAQ Functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Form submission
document.querySelector('.cta-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('.email-input').value;
    
    if (email) {
        // Simulate form submission
        alert('Thank you for signing up! We\'ll be in touch soon.');
        document.querySelector('.email-input').value = '';
    }
});

// Hero search functionality
document.querySelector('.search-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const ingredients = document.querySelector('.search-input').value;
    
    if (ingredients) {
        // Simulate search
        alert(`Searching for recipes with: ${ingredients}`);
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.usp-card, .testimonial-card, .feature-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    const carousel = document.querySelector('.carousel-container');
    if (carousel && document.activeElement.closest('.carousel-container')) {
        if (e.key === 'ArrowLeft') {
            document.querySelector('.prev-btn').click();
        } else if (e.key === 'ArrowRight') {
            document.querySelector('.next-btn').click();
        }
    }
});

// Touch/swipe support for mobile carousel
let startX = 0;
let endX = 0;

document.querySelector('.carousel').addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

document.querySelector('.carousel').addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const threshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swipe left - next slide
            document.querySelector('.next-btn').click();
        } else {
            // Swipe right - previous slide
            document.querySelector('.prev-btn').click();
        }
    }
}

// Performance optimization - lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}