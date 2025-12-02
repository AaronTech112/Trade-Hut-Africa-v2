// Modern TradeHut Africa JavaScript

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        disable: 'mobile'
    });
    
    // Initialize all functionality
    applyNavbarOffset();
    applyTickerOffset();
    initializeNavigation();
    initializeScrollEffects();
    initializeFormHandling();
    initializeAnimations();
    initializeCounters();
    initializeLazyLoading();
    setTimeout(applyTickerOffset, 1200);
    setTimeout(applyTickerOffset, 3000);
});

// Helpers for fixed navbar offset
function getNavbarHeight() {
    const navbar = document.querySelector('.navbar');
    return navbar ? navbar.offsetHeight : 0;
}

function applyNavbarOffset() {
    const height = getNavbarHeight();
    if (height) {
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
    }
}

function applyTickerOffset() {
    const ticker = document.querySelector('.ticker-tape');
    const height = ticker ? ticker.offsetHeight : 0;
    document.documentElement.style.setProperty('--ticker-height', `${height}px`);
}

// Navigation Functions
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.fa-bars');
    const menuClose = document.querySelector('.fa-times');
    const bsCollapse = document.getElementById('navbarNav');
    
    // Mobile menu toggle
    window.showMenu = function() {
        if (navLinks) {
            navLinks.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    window.hideMenu = function() {
        if (navLinks) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offset = getNavbarHeight();
                    const y = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    hideMenu();
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks && menuToggle) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                hideMenu();
            }
        }
    });

    // Update navbar offset when Bootstrap collapse toggles
    if (bsCollapse) {
        bsCollapse.addEventListener('shown.bs.collapse', applyNavbarOffset);
        bsCollapse.addEventListener('hidden.bs.collapse', applyNavbarOffset);
        bsCollapse.addEventListener('shown.bs.collapse', applyTickerOffset);
        bsCollapse.addEventListener('hidden.bs.collapse', applyTickerOffset);
    }

    // Recalculate on window resize
    window.addEventListener('resize', function() {
        applyNavbarOffset();
        applyTickerOffset();
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active section highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Form Handling
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            // Validate form
            if (!name || !email || !service || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Send to WhatsApp
            sendToWhatsApp(e);
        });
    }
}

// WhatsApp Integration
function sendToWhatsApp(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;
    
    // Format the message
    const formattedMessage = 
        `*New Contact Form Submission*\n\n` +
        `*Name:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*Service:* ${service}\n` +
        `*Message:* ${message}`;
    
    // WhatsApp number
    const phoneNumber = "2349038671092";
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(formattedMessage)}`;
    
    // Redirect to WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Show success message
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Add parallax effect to hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroPattern = document.querySelector('.hero-bg-pattern');
        if (heroPattern) {
            heroPattern.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number, .impact-stat .number, .counter');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                let target = 0;
                let suffix = '';
                
                if (counter.classList.contains('counter') && counter.dataset && counter.dataset.target) {
                    target = parseInt(counter.dataset.target, 10);
                } else {
                    target = parseInt(counter.textContent.replace(/\D/g, ''));
                    suffix = counter.textContent.replace(/\d/g, '');
                }
                
                animateCounter(counter, 0, target, suffix, 2000);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, start, end, suffix, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization for scroll events
const optimizedScrollHandler = throttle(function() {
    // Scroll-based animations
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Add scroll-based effects here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInLeft {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideInRight 0.3s ease;
    }
    
    .nav-link.active {
        color: var(--secondary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .btn:disabled::before {
        display: none;
    }
    
    .loading {
        position: relative;
        overflow: hidden;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% { left: -100%; }
        100% { left: 100%; }
    }
`;

document.head.appendChild(style);

// Add current year to footer
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Add loading states for buttons
document.querySelectorAll('.btn, .submit-btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.type === 'submit') return;
        
        const originalText = this.innerHTML;
        this.classList.add('loading');
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        setTimeout(() => {
            this.classList.remove('loading');
            this.innerHTML = originalText;
        }, 2000);
    });
});

// Add click effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);
