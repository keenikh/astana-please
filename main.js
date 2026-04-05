document.addEventListener('DOMContentLoaded', () => {

    /* --- Header Scroll Effect --- */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- Hero Branch Animation --- */
    const branch = document.getElementById('hero-branch');
    
    // Animate branch on load after a slight delay
    setTimeout(() => {
        if (branch) {
            branch.classList.add('visible');
        }
    }, 300);

    /* --- Initialize Swiper for Labs --- */
    const swiper = new Swiper('.labs-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            // when window width is >= 768px
            768: {
                slidesPerView: 2,
            },
            // when window width is >= 1024px
            1024: {
                slidesPerView: 3,
            }
        },
    });

    /* --- Statistics Counters Animation --- */
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const targetText = counter.getAttribute('data-target');
            const isFloat = targetText.includes('.');
            const target = parseFloat(targetText.replace(',', '.'));
            
            let current = 0;
            const duration = 2000; // 2 seconds for animation
            const frameDuration = 1000 / 60; // 60 fps
            const totalFrames = Math.round(duration / frameDuration);
            const increment = target / totalFrames;
            
            let frame = 0;
            
            const updateCounter = () => {
                frame++;
                current += increment;
                
                if (frame < totalFrames) {
                    if (isFloat) {
                        counter.innerText = current.toFixed(1).replace('.', ',');
                    } else {
                        counter.innerText = Math.floor(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = targetText.replace('.', ',');
                }
            };
            
            updateCounter();
        });
    }

    // Intersection Observer to trigger counting when stats section is visible
    const statsSection = document.getElementById('statistics');
    if (statsSection) {
        // Reduced threshold to 0.05 for better mobile reliability
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
                observer.unobserve(statsSection);
            }
        }, { 
            threshold: 0.05,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before it hits the viewport
        });
        
        observer.observe(statsSection);
    }

    /* --- Mobile Menu --- */
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('nav-list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navList.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }
});
