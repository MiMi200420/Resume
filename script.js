document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Navigation Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from all buttons
            tabBtns.forEach(b => {
                b.classList.remove('border-neon-green', 'bg-neon-green/10', 'text-neon-green');
                b.classList.add('border-white/10', 'text-gray-400');
            });
            
            // Add active state to clicked button
            btn.classList.remove('border-white/10', 'text-gray-400');
            btn.classList.add('border-neon-green', 'bg-neon-green/10', 'text-neon-green');

            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('block');
            });

            // Show target tab content
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('block');
            }
        });
    });

    // Mini Carousels Logic (Crossfade Loop)
    const miniCarousels = document.querySelectorAll('.mini-carousel');
    miniCarousels.forEach(carousel => {
        const images = carousel.querySelectorAll('img');
        if(images.length <= 1) return;
        
        let currentIndex = 0;
        setInterval(() => {
            images[currentIndex].classList.remove('opacity-100');
            images[currentIndex].classList.add('opacity-0');
            
            currentIndex = (currentIndex + 1) % images.length;
            
            images[currentIndex].classList.remove('opacity-0');
            images[currentIndex].classList.add('opacity-100');
        }, 3000); // Change image every 3 seconds
    });

    // Starry Galaxy Background System
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let starsArray = [];
        const numberOfStars = window.innerWidth < 768 ? 100 : 250;
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * canvas.width;
                this.size = Math.random() * 1.5;
                this.color = Math.random() > 0.8 ? 'rgba(0, 255, 102, ' : (Math.random() > 0.5 ? 'rgba(155, 81, 224, ' : 'rgba(255, 255, 255, ');
                this.opacity = Math.random();
                this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            }
            update() {
                // Drift upwards slowly
                this.y -= (1 - this.z / canvas.width) * 0.5;
                if (this.y < 0) this.y = canvas.height;
                
                // Parallax shift based on mouse
                const dx = (mouseX - canvas.width / 2) * (1 - this.z / canvas.width) * 0.01;
                const dy = (mouseY - canvas.height / 2) * (1 - this.z / canvas.width) * 0.01;
                this.x += dx;
                
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;

                // Twinkle
                this.opacity += 0.01 * this.fadeDirection;
                if (this.opacity >= 1) this.fadeDirection = -1;
                if (this.opacity <= 0.1) this.fadeDirection = 1;
            }
            draw() {
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initStars() {
            starsArray = [];
            for (let i = 0; i < numberOfStars; i++) {
                starsArray.push(new Star());
            }
        }

        function animateStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < starsArray.length; i++) {
                starsArray[i].update();
                starsArray[i].draw();
            }
            requestAnimationFrame(animateStars);
        }

        initStars();
        animateStars();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        });
    }

    // Event Slider Logic
    window.setSlide = function(index) {
        const slides = document.querySelectorAll('.slider-img');
        const dots = document.querySelectorAll('.slider-dot');
        if (!slides.length) return;
        
        // Find current slide
        let currentSlide = 0;
        slides.forEach((slide, i) => {
            if (slide.classList.contains('opacity-100')) {
                currentSlide = i;
            }
        });

        if (currentSlide === index) return;

        slides[currentSlide].classList.replace('opacity-100', 'opacity-0');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.replace('bg-neon-green', 'bg-white/30');
            dots[currentSlide].classList.remove('shadow-[0_0_10px_rgba(0,255,102,0.8)]');
        }
        
        slides[index].classList.replace('opacity-0', 'opacity-100');
        if (dots[index]) {
            dots[index].classList.replace('bg-white/30', 'bg-neon-green');
            dots[index].classList.add('shadow-[0_0_10px_rgba(0,255,102,0.8)]');
        }
    };

    // Auto loop event slider
    setInterval(() => {
        const slides = document.querySelectorAll('.slider-img');
        if (slides.length > 0) {
            let currentSlide = 0;
            slides.forEach((slide, i) => {
                if (slide.classList.contains('opacity-100')) {
                    currentSlide = i;
                }
            });
            let next = (currentSlide + 1) % slides.length;
            window.setSlide(next);
        }
    }, 4000);
    // 3. Intersection Observers for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glitch-text, .glass-panel, .tab-content, .bg-panel-bg').forEach(el => {
        observer.observe(el);
    });

    // 4. Back to Top Button Logic
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.remove('translate-y-24', 'opacity-0');
                backToTopBtn.classList.add('translate-y-0', 'opacity-100');
            } else {
                backToTopBtn.classList.add('translate-y-24', 'opacity-0');
                backToTopBtn.classList.remove('translate-y-0', 'opacity-100');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    // Neon Scroll Progress Bar & Background Fade
    const scrollProgress = document.getElementById('scroll-progress');
    const particlesCanvas = document.getElementById('particlesCanvas');
    
    window.addEventListener('scroll', () => {
        const scrollPx = document.documentElement.scrollTop;
        
        // Progress Bar logic
        if (scrollProgress) {
            const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = `${scrollPx / winHeightPx * 100}%`;
            scrollProgress.style.width = scrolled;
        }

        // Fade out Starry Background on scroll to prevent visual fatigue
        if (particlesCanvas) {
            // Fade from 0.4 (top) to 0 as you scroll down 800px
            const maxScroll = 800;
            const currentOpacity = 0.4 * (1 - Math.min(scrollPx / maxScroll, 1));
            particlesCanvas.style.opacity = currentOpacity;
        }
    });

    // Spotlight Hover Effect
    const spotlightCards = document.querySelectorAll('.spotlight-target');
    spotlightCards.forEach(card => {
        card.classList.add('spotlight-card');
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Initialize VanillaTilt for 3D Cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".glass-panel, .mini-carousel"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });
    }

    // 5. Lightbox / Popup Gallery Logic
    window.captionImages = [
        'assets/Caption/S__24961030_0.jpg',
        'assets/Caption/S__24961031_0.jpg',
        'assets/Caption/S__24961032_0.jpg'
    ];
    window.currentLightboxIndex = 0;

    window.openLightbox = function() {
        const lightbox = document.getElementById('lightbox-modal');
        if(!lightbox) return;
        window.currentLightboxIndex = 0;
        document.getElementById('lightbox-img').src = window.captionImages[window.currentLightboxIndex];
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    window.closeLightbox = function() {
        const lightbox = document.getElementById('lightbox-modal');
        if(!lightbox) return;
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        document.body.style.overflow = '';
    };

    window.nextLightboxImg = function() {
        window.currentLightboxIndex = (window.currentLightboxIndex + 1) % window.captionImages.length;
        document.getElementById('lightbox-img').src = window.captionImages[window.currentLightboxIndex];
    };

    window.prevLightboxImg = function() {
        window.currentLightboxIndex = (window.currentLightboxIndex - 1 + window.captionImages.length) % window.captionImages.length;
        document.getElementById('lightbox-img').src = window.captionImages[window.currentLightboxIndex];
    };

});
