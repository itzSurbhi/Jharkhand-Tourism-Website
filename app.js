// Animation and Parallax Controller for Jharkhand Tourism Website
class JharkhandTourismApp {
    constructor() {
        this.animationSettings = {
            defaultDuration: 600,
            fastDuration: 300,
            slowDuration: 800,
            staggerDelay: 100,
            observerThreshold: 0.1
        };
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        // Check for reduced motion preference
        this.respectsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Initialize all components
        this.setupParallaxBackgrounds();
        this.setupIntersectionObserver();
        this.setupTypewriterEffect();
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupHoverEffects();
        
        console.log('Jharkhand Tourism Website Initialized with Animations');
    }

    // Parallax Background Setup
    setupParallaxBackgrounds() {
        const parallaxSections = document.querySelectorAll('.parallax-section');
        
        // Throttled scroll handler for parallax effect
        let ticking = false;
        const handleParallaxScroll = () => {
            if (!ticking && !this.respectsReducedMotion) {
                requestAnimationFrame(() => {
                    this.updateParallaxPositions();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleParallaxScroll, { passive: true });
    }

    updateParallaxPositions() {
        const scrollTop = window.pageYOffset;
        const parallaxSections = document.querySelectorAll('.parallax-section');

        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const speed = 0.5; // Parallax speed factor
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const yPos = -(scrollTop - section.offsetTop) * speed;
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    }

    // Intersection Observer for Animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: this.animationSettings.observerThreshold,
            rootMargin: '50px 0px -50px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll([
            '.animate-fade-in',
            '.animate-slide-up',
            '.animate-fade-in-left',
            '.animate-fade-in-right',
            '.animate-rotate-in',
            '.animate-bounce-in',
            '.animate-float-in',
            '.animate-card-flip',
            '.animate-zoom-in'
        ].join(', '));

        animatableElements.forEach(el => {
            this.intersectionObserver.observe(el);
        });
    }

    animateElement(element) {
        if (this.respectsReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        const delay = parseFloat(element.getAttribute('data-delay')) || 0;
        
        setTimeout(() => {
            element.classList.add('animate-triggered');
            element.style.animationPlayState = 'running';
        }, delay * 1000);

        // Unobserve after animation
        this.intersectionObserver.unobserve(element);
    }

    // Typewriter Effect for Hero Title
    setupTypewriterEffect() {
        const heroTitle = document.getElementById('hero-title');
        if (!heroTitle || this.respectsReducedMotion) {
            if (heroTitle) {
                heroTitle.style.width = 'auto';
                heroTitle.style.borderRight = 'none';
                heroTitle.style.whiteSpace = 'normal';
                heroTitle.style.animation = 'none';
            }
            return;
        }

        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.width = '0';
        
        let i = 0;
        const typeSpeed = 50;
        
        setTimeout(() => {
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, typeSpeed);
                } else {
                    // Start subtitle and CTA animations
                    this.animateHeroContent();
                }
            };
            
            // Start typing effect
            heroTitle.style.width = '100%';
            typeWriter();
        }, 500);
    }

    animateHeroContent() {
        const subtitle = document.querySelector('.hero-subtitle');
        const cta = document.querySelector('.hero-cta');

        if (subtitle) {
            setTimeout(() => {
                subtitle.style.opacity = '1';
                subtitle.style.animation = 'fadeIn 0.6s ease-out forwards';
            }, 500);
        }

        if (cta) {
            setTimeout(() => {
                cta.style.opacity = '1';
                cta.style.animation = 'fadeIn 0.6s ease-out forwards';
            }, 800);
        }
    }

    // Mobile Menu Setup
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navList = document.querySelector('.nav-list');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!mobileMenuBtn || !navList) return;

        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && !e.target.closest('.mobile-menu-btn')) {
                if (navList.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            }
        });
    }

    toggleMobileMenu() {
        const navList = document.querySelector('.nav-list');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const icon = mobileMenuBtn?.querySelector('i');
        
        if (!navList || !icon) return;

        navList.classList.toggle('active');
        
        if (navList.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            // Animate menu items in
            this.animateMenuItems();
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    animateMenuItems() {
        if (this.respectsReducedMotion) return;
        
        const menuItems = document.querySelectorAll('.nav-list.active .nav-link');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    // Navigation and Smooth Scrolling
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const heroCtaBtn = document.querySelector('.hero-cta');

        // Setup navigation link listeners
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = link.getAttribute('href');
                console.log('Navigation clicked:', targetId); // Debug log
                
                if (targetId && targetId.startsWith('#')) {
                    this.smoothScrollToSection(targetId);
                    this.updateActiveNavLink(targetId);
                }
            });
        });

        // Setup hero CTA button
        if (heroCtaBtn) {
            heroCtaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Hero CTA clicked'); // Debug log
                this.smoothScrollToSection('#places');
                this.updateActiveNavLink('#places');
            });
        }

        // Update active nav on scroll
        const throttledScrollHandler = this.throttle(() => {
            this.updateActiveNavOnScroll();
            this.updateHeaderBackground();
        }, 100);

        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    }

    smoothScrollToSection(targetId) {
        console.log('Smooth scrolling to:', targetId); // Debug log
        
        const targetSection = document.querySelector(targetId);
        if (!targetSection) {
            console.warn('Target section not found:', targetId);
            return;
        }

        const headerHeight = 80;
        const elementPosition = targetSection.offsetTop;
        const offsetPosition = elementPosition - headerHeight;

        console.log('Scrolling to position:', offsetPosition); // Debug log

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    updateActiveNavLink(activeId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('.section[id], #home');
        const scrollPos = window.scrollY + 150; // Increased offset for better detection

        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        if (currentSection) {
            this.updateActiveNavLink(currentSection);
        }
    }

    updateHeaderBackground() {
        const header = document.querySelector('.header');
        if (!header) return;

        const scrollY = window.scrollY;
        const opacity = scrollY > 100 ? 0.98 : 0.95;
        
        header.style.background = `rgba(19, 52, 59, ${opacity})`;
    }

    // Scroll Effects and Stagger Animations
    setupScrollEffects() {
        // Stagger animations for card grids
        this.setupStaggerAnimations('.places-grid .place-card', 100);
        this.setupStaggerAnimations('.traditions-grid .tradition-item', 150);
        this.setupStaggerAnimations('.handicrafts-grid .handicraft-card', 100);
        this.setupStaggerAnimations('.festivals-grid .festival-card', 200);
        this.setupStaggerAnimations('.music-grid .music-item', 100);
        this.setupStaggerAnimations('.visit-grid .visit-card', 100);

        // Enhanced card interactions
        this.setupCardInteractions();
        
        // Political map interactions
        this.setupPoliticalMapInteractions();
    }

    setupStaggerAnimations(selector, delay) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            const currentDelay = parseFloat(element.getAttribute('data-delay')) || 0;
            const staggerDelay = currentDelay + (index * delay / 1000);
            element.setAttribute('data-delay', staggerDelay.toString());
        });
    }

    setupCardInteractions() {
        // Place card click animations
        const placeCards = document.querySelectorAll('.place-card');
        placeCards.forEach(card => {
            card.addEventListener('click', () => {
                if (!this.respectsReducedMotion) {
                    card.style.transform = 'translateY(-12px) scale(1.02)';
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 200);
                }
            });
        });

        // Festival card interactions
        const festivalCards = document.querySelectorAll('.festival-card');
        festivalCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.respectsReducedMotion) {
                    const image = card.querySelector('.festival-image img, .festival-image .placeholder-image');
                    if (image) {
                        image.style.transform = 'scale(1.1)';
                    }
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!this.respectsReducedMotion) {
                    const image = card.querySelector('.festival-image img, .festival-image .placeholder-image');
                    if (image) {
                        image.style.transform = 'scale(1)';
                    }
                }
            });
        });

        // Visit card interactions
        const visitCards = document.querySelectorAll('.visit-card');
        visitCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.respectsReducedMotion) {
                    const tips = card.querySelectorAll('.tip-item, .travel-option, .accommodation-type');
                    tips.forEach((tip, index) => {
                        setTimeout(() => {
                            tip.style.transform = 'translateX(4px)';
                        }, index * 50);
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!this.respectsReducedMotion) {
                    const tips = card.querySelectorAll('.tip-item, .travel-option, .accommodation-type');
                    tips.forEach(tip => {
                        tip.style.transform = 'translateX(0)';
                    });
                }
            });
        });
    }

    setupPoliticalMapInteractions() {
        const mapSvg = document.querySelector('.jharkhand-political-map');
        const mapCircles = document.querySelectorAll('.jharkhand-political-map circle');
        
        if (!mapSvg) return;

        // Add hover effects to city markers
        mapCircles.forEach(circle => {
            circle.addEventListener('mouseenter', () => {
                if (!this.respectsReducedMotion) {
                    circle.style.transform = 'scale(1.2)';
                    circle.style.transformOrigin = 'center';
                    circle.style.transition = 'transform 0.2s ease-out';
                    
                    // Add glow effect
                    circle.style.filter = 'drop-shadow(0 0 8px currentColor)';
                }
            });

            circle.addEventListener('mouseleave', () => {
                if (!this.respectsReducedMotion) {
                    circle.style.transform = 'scale(1)';
                    circle.style.filter = 'none';
                }
            });

            // Add click animation
            circle.addEventListener('click', () => {
                if (!this.respectsReducedMotion) {
                    circle.style.animation = 'pulse 0.6s ease-in-out';
                    setTimeout(() => {
                        circle.style.animation = '';
                    }, 600);
                }
            });
        });

        // Map zoom interaction
        mapSvg.addEventListener('mouseenter', () => {
            if (!this.respectsReducedMotion) {
                mapSvg.style.transform = 'scale(1.02)';
                mapSvg.style.transition = 'transform 0.3s ease-out';
            }
        });

        mapSvg.addEventListener('mouseleave', () => {
            if (!this.respectsReducedMotion) {
                mapSvg.style.transform = 'scale(1)';
            }
        });
    }

    // Enhanced Hover Effects
    setupHoverEffects() {
        if (this.respectsReducedMotion) return;

        // Icon rotation effects
        const rotatingIcons = document.querySelectorAll('.handicraft-icon, .visit-icon');
        rotatingIcons.forEach(icon => {
            const parent = icon.closest('.handicraft-card, .visit-card');
            if (parent) {
                parent.addEventListener('mouseenter', () => {
                    icon.style.transition = 'transform 0.6s ease-out';
                    icon.style.transform = 'rotate(360deg)';
                });

                parent.addEventListener('mouseleave', () => {
                    setTimeout(() => {
                        icon.style.transform = 'rotate(0deg)';
                    }, 100);
                });
            }
        });

        // Pulse effects for tradition and music icons
        const pulseIcons = document.querySelectorAll('.tradition-icon, .music-icon');
        pulseIcons.forEach(icon => {
            const parent = icon.closest('.tradition-item, .music-item');
            if (parent) {
                parent.addEventListener('mouseenter', () => {
                    icon.style.animation = 'pulse 0.6s ease-in-out infinite';
                });

                parent.addEventListener('mouseleave', () => {
                    icon.style.animation = '';
                });
            }
        });

        // Enhanced button effects
        const buttons = document.querySelectorAll('.btn, .nav-link');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (button.classList.contains('nav-link')) {
                    button.style.transform = 'translateY(-2px)';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (button.classList.contains('nav-link')) {
                    button.style.transform = '';
                }
            });

            button.addEventListener('mousedown', () => {
                if (button.classList.contains('btn')) {
                    button.style.transform = 'translateY(0px) scale(0.98)';
                }
            });

            button.addEventListener('mouseup', () => {
                if (button.classList.contains('btn')) {
                    button.style.transform = 'translateY(-2px)';
                }
            });
        });

        // Tag hover effects
        const tags = document.querySelectorAll('.highlight-tag, .material-tag, .lang-tag');
        tags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-2px) scale(1.05)';
                tag.style.transition = 'all 0.2s ease-out';
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
            });
        });

        // Fact item hover effects
        const factItems = document.querySelectorAll('.fact-item, .contact-item, .emergency-item');
        factItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(4px)';
                item.style.transition = 'all 0.2s ease-out';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
            });
        });

        // Image hover effects
        const images = document.querySelectorAll('.place-image img, .culture-image img, .festival-image img');
        images.forEach(img => {
            const container = img.closest('.place-card, .culture-image, .festival-card');
            if (container) {
                container.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.1)';
                    img.style.transition = 'transform 0.4s ease-out';
                });

                container.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                });
            }
        });
    }

    // Utility Methods
    debounce(func, wait) {
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

    throttle(func, limit) {
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

    // Enhanced scroll performance
    setupPerformanceOptimizations() {
        // Intersection observer for images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        // Observe lazy-loaded images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Optimize parallax for performance
        const parallaxElements = document.querySelectorAll('.parallax-section');
        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('parallax-active');
                } else {
                    entry.target.classList.remove('parallax-active');
                }
            });
        }, { threshold: 0.1 });

        parallaxElements.forEach(el => {
            parallaxObserver.observe(el);
        });
    }
}

// Initialize the application
const jharkhandApp = new JharkhandTourismApp();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JharkhandTourismApp;
}

// Performance monitoring and initialization
window.addEventListener('load', () => {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Jharkhand Tourism Website loaded in ${loadTime}ms`);
    }
    
    // Initialize any remaining animations after full page load
    setTimeout(() => {
        const remainingElements = document.querySelectorAll('[class*="animate-"]:not(.animate-triggered)');
        remainingElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                jharkhandApp.animateElement(el);
            }
        });
    }, 100);

    // Setup performance optimizations
    jharkhandApp.setupPerformanceOptimizations();
    
    // Add scroll-to-top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top hidden';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-primary);
        color: white;
        border: none;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-md);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.remove('hidden');
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(10px)';
            setTimeout(() => scrollToTopBtn.classList.add('hidden'), 300);
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    console.log('Jharkhand Tourism Website fully loaded and optimized');
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navList = document.querySelector('.nav-list');
        if (navList && navList.classList.contains('active')) {
            jharkhandApp.toggleMobileMenu();
        }
    }
    
    // Arrow keys for section navigation
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        const sections = document.querySelectorAll('.section[id]');
        const currentSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });
        
        if (currentSection) {
            const currentIndex = Array.from(sections).indexOf(currentSection);
            const nextSection = sections[currentIndex + 1];
            if (nextSection) {
                jharkhandApp.smoothScrollToSection('#' + nextSection.id);
            }
        }
    }
    
    if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        const sections = document.querySelectorAll('.section[id]');
        const currentSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });
        
        if (currentSection) {
            const currentIndex = Array.from(sections).indexOf(currentSection);
            const prevSection = sections[currentIndex - 1];
            if (prevSection) {
                jharkhandApp.smoothScrollToSection('#' + prevSection.id);
            } else {
                jharkhandApp.smoothScrollToSection('#home');
            }
        }
    }
});