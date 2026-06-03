document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Header Scroll Effect
    // ==========================================
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    function updateActiveNavLink() {
        let currentSectionId = 'hero';
        const scrollPosition = window.scrollY + 100; // Offset for sticky nav

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================
    // 2. Interactive Mockup Device Switcher
    // ==========================================
    const mockupViewport = document.getElementById('mockup-viewport');
    const mockupScreen = document.getElementById('mockup-screen-content');
    const deviceButtons = document.querySelectorAll('.control-btn');
    
    // Project data mapping
    const projects = [
        {
            name: 'Moda E-Commerce',
            image: 'assets/mockup_ecommerce.png',
            url: 'https://synapseweb.studio/work/moda-fashion'
        },
        {
            name: 'Element Studio',
            image: 'assets/mockup_architecture.png',
            url: 'https://synapseweb.studio/work/element-architecture'
        },
        {
            name: 'Apex Dashboard',
            image: 'assets/mockup_dashboard.png',
            url: 'https://synapseweb.studio/work/apex-dashboard'
        }
    ];

    let currentProjectIndex = 0;

    // Load initial mockup image
    function renderMockupScreen() {
        const project = projects[currentProjectIndex];
        mockupScreen.innerHTML = `
            <div style="width: 100%; height: 100%; overflow-y: auto; scrollbar-width: thin;">
                <img src="${project.image}" alt="${project.name}" style="width: 100%; display: block; height: auto;">
            </div>
        `;
        const addressBar = document.querySelector('.mockup-address');
        if (addressBar) {
            addressBar.textContent = project.url;
        }
    }
    
    renderMockupScreen();

    // Toggle device frame sizes
    deviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            deviceButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const device = button.getAttribute('data-device');
            // Remove existing device classes
            mockupViewport.classList.remove('desktop', 'tablet', 'mobile');
            // Add selected device class
            mockupViewport.classList.add(device);
        });
    });

    // Wire portfolio items to trigger mockup screen updates
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectIdx = parseInt(item.getAttribute('data-project'));
            currentProjectIndex = projectIdx;
            renderMockupScreen();
            
            // Scroll smoothly up to the mockup view so the user sees the responsive preview update
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
        });
    });


    // ==========================================
    // 3. Dynamic Pricing Calculator
    // ==========================================
    const pagesSlider = document.getElementById('pages-slider');
    const pagesValue = document.getElementById('pages-value');
    const toggleUx = document.getElementById('toggle-ux');
    const toggleEcommerce = document.getElementById('toggle-ecommerce');
    const toggleSeo = document.getElementById('toggle-seo');
    const toggleCms = document.getElementById('toggle-cms');
    const priceAmountEl = document.getElementById('calc-price-amount');
    
    let currentPrice = 0;

    function calculatePrice() {
        const pages = parseInt(pagesSlider.value);
        pagesValue.textContent = `${pages} ${pages === 1 ? 'Page' : 'Pages'}`;
        
        let price = 500; // Base layout Setup Cost
        price += pages * 100; // $100 per page
        
        if (toggleUx.checked) price += 500;
        if (toggleEcommerce.checked) price += 800;
        if (toggleSeo.checked) price += 300;
        if (toggleCms.checked) price += 600;
        
        animatePriceCounter(price);
    }

    // Smooth counter animation for price update
    function animatePriceCounter(targetPrice) {
        if (currentPrice === targetPrice) return;
        
        const duration = 400; // ms
        const startTime = performance.now();
        const startPrice = currentPrice;

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                currentPrice = targetPrice;
                priceAmountEl.textContent = formatPrice(targetPrice);
            } else {
                const progress = elapsedTime / duration;
                // Ease out quad
                const easeProgress = progress * (2 - progress);
                const val = Math.round(startPrice + (targetPrice - startPrice) * easeProgress);
                priceAmountEl.textContent = formatPrice(val);
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    function formatPrice(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Attach listeners
    pagesSlider.addEventListener('input', calculatePrice);
    toggleUx.addEventListener('change', calculatePrice);
    toggleEcommerce.addEventListener('change', calculatePrice);
    toggleSeo.addEventListener('change', calculatePrice);
    toggleCms.addEventListener('change', calculatePrice);
    
    // Initial run
    calculatePrice();


    // ==========================================
    // 4. Testimonials Slider
    // ==========================================
    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.test-dot');
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;
    let autoScrollInterval;

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        goToSlide(next);
    }

    // Manual control via dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIdx = parseInt(dot.getAttribute('data-slide'));
            goToSlide(slideIdx);
            resetAutoScroll();
        });
    });

    // Auto-scroll logic
    function startAutoScroll() {
        autoScrollInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    function resetAutoScroll() {
        stopAutoScroll();
        startAutoScroll();
    }

    // Pause on hover
    const testimonialsSection = document.getElementById('testimonials');
    testimonialsSection.addEventListener('mouseenter', stopAutoScroll);
    testimonialsSection.addEventListener('mouseleave', startAutoScroll);

    startAutoScroll();


    // ==========================================
    // 5. Contact Form and Floating Labels
    // ==========================================
    const contactForm = document.getElementById('project-contact-form');
    const formGroups = document.querySelectorAll('.form-group');
    const successModal = document.getElementById('contact-success-modal');
    const closeSuccessBtn = document.getElementById('success-close-btn');

    // Float labels logic
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        
        // Initial check on load
        if (input.value.trim() !== '') {
            group.classList.add('filled');
        }

        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            group.classList.remove('focused');
            if (input.value.trim() !== '') {
                group.classList.add('filled');
            } else {
                group.classList.remove('filled');
            }
        });
    });

    // Form Submission Handling
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('form-submit-btn');
        const originalText = submitBtn.textContent;
        
        // Visual loading state
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Revert state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show Success Modal
            successModal.classList.add('show');
            
            // Reset Form and labels
            contactForm.reset();
            formGroups.forEach(group => group.classList.remove('filled', 'focused'));
        }, 1200);
    });

    // Close Modal Handler
    closeSuccessBtn.addEventListener('click', () => {
        successModal.classList.remove('show');
    });

    // Also close modal if clicking outside the content
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('show');
        }
    });

});
