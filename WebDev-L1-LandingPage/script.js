        // Initialize all functionality when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            // ========================================
            // Navbar Scroll Effect
            // ========================================
            const navbar = document.getElementById('navbar');
            let lastScroll = 0;
            
            function handleScroll() {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                lastScroll = currentScroll;
            }
            
            window.addEventListener('scroll', handleScroll, { passive: true });
            
            // ========================================
            // Mobile Navigation Toggle
            // ========================================
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            
            navToggle.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = isExpanded ? '' : 'hidden';
            });
            
            // Close mobile menu when clicking a link
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
            
            // ========================================
            // Smooth Scroll for Anchor Links
            // ========================================
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        const navHeight = navbar.offsetHeight;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // ========================================
            // Active Nav Link on Scroll
            // ========================================
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            function updateActiveLink() {
                const scrollPos = window.pageYOffset + navbar.offsetHeight + 100;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                        navLinks.forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href') === '#' + sectionId);
                        });
                    }
                });
            }
            
            window.addEventListener('scroll', updateActiveLink, { passive: true });
            
            // ========================================
            // Counter Animation for Hero Stats
            // ========================================
            const statValues = document.querySelectorAll('.stat-value[data-count]');
            let countersAnimated = false;
            
            function animateCounters() {
                if (countersAnimated) return;
                
                const heroSection = document.getElementById('home');
                const heroRect = heroSection.getBoundingClientRect();
                
                if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
                    countersAnimated = true;
                    
                    statValues.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-count'));
                        const suffix = stat.textContent.includes('%') ? '%' : 
                                      stat.textContent.includes('+') ? '+' : '';
                        let current = 0;
                        const increment = target / 50;
                        const duration = 2000;
                        const stepTime = duration / 50;
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            stat.textContent = Math.floor(current) + suffix;
                        }, stepTime);
                    });
                }
            }
            
            window.addEventListener('scroll', animateCounters, { passive: true });
            // Check on load
            animateCounters();
            
            // ========================================
            // Intersection Observer for Animations
            // ========================================
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (!prefersReducedMotion) {
                const observerOptions = {
                    root: null,
                    rootMargin: '0px 0px -50px 0px',
                    threshold: 0.1
                };
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);
                
                // Observe feature cards
                document.querySelectorAll('.feature-card').forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
                    observer.observe(card);
                });
                
                // Observe testimonial cards
                document.querySelectorAll('.testimonial-card').forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
                    observer.observe(card);
                });
                
                // Observe about section
                const aboutVisual = document.querySelector('.about-visual');
                if (aboutVisual) {
                    aboutVisual.style.opacity = '0';
                    aboutVisual.style.transform = 'translateX(30px)';
                    aboutVisual.style.transition = 'all 0.8s ease';
                    observer.observe(aboutVisual);
                }
            }
            
            // ========================================
            // Keyboard Navigation Support
            // ========================================
            document.addEventListener('keydown', function(e) {
                // Close mobile menu on Escape
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                    navToggle.focus();
                }
            });
        });
