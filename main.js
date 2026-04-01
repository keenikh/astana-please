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
            counter.innerText = '0';
            const updateCounter = () => {
                const targetText = counter.getAttribute('data-target');
                // Check if the target is a float instead of integer (e.g., 10.2)
                const isFloat = targetText.includes('.');
                const target = parseFloat(targetText.replace(',', '.'));
                
                // Get current value
                const current = parseFloat(counter.innerText.replace(',', '.'));
                
                // Determine increment step
                const increment = target / 50; 
                
                if (current < target) {
                    let next = current + increment;
                    if (isFloat) {
                        counter.innerText = next.toFixed(1).replace('.', ',');
                    } else {
                        counter.innerText = Math.ceil(next);
                    }
                    setTimeout(updateCounter, 30);
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
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
});
