document.addEventListener('DOMContentLoaded', () => {

    function triggerHeroReveal() {
        const reveals = document.querySelectorAll('.reveal-wrap');
        reveals.forEach((wrap, i) => {
            setTimeout(() => {
                wrap.classList.add('revealed');
            }, i * 200);
        });
    }

    triggerHeroReveal();

    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    const progressBar = document.getElementById('heroProgress');
    let currentSlide = 0;
    const SLIDE_DURATION = 5000; // 5 seconds per slide
    let slideTimer;
    let progressStart;
    let progressRAF;

    function goToSlide(index) {
        heroSlides.forEach(s => s.classList.remove('active'));
        heroDots.forEach(d => d.classList.remove('active'));
        heroSlides[index].classList.add('active');
        heroDots[index].classList.add('active');
        currentSlide = index;

        startProgress();
    }

    function nextSlide() {
        const next = (currentSlide + 1) % heroSlides.length;
        goToSlide(next);
    }

    function startProgress() {
        if (progressRAF) cancelAnimationFrame(progressRAF);
        if (slideTimer) clearTimeout(slideTimer);
        progressStart = performance.now();

        function updateProgress(now) {
            const elapsed = now - progressStart;
            const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
            if (progressBar) progressBar.style.width = pct + '%';
            if (pct < 100) {
                progressRAF = requestAnimationFrame(updateProgress);
            }
        }

        progressRAF = requestAnimationFrame(updateProgress);
        slideTimer = setTimeout(nextSlide, SLIDE_DURATION);
    }

    if (heroSlides.length > 0) {
        startProgress();

        heroDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.getAttribute('data-slide'));
                goToSlide(idx);
            });
        });
    }

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMenu() {
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));

    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    const animatedEls = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in, .clip-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.05 });

    animatedEls.forEach(el => observer.observe(el));

    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2500;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(easeOutExpo(progress) * target);
            el.textContent = current.toLocaleString() + '+';

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString() + '+';
            }
        }

        requestAnimationFrame(update);
    }

    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    if (window.matchMedia('(min-width: 769px) and (hover: hover)').matches) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                const rotX = ((y - r.height / 2) / r.height) * -6;
                const rotY = ((x - r.width / 2) / r.width) * 6;
                card.style.transform = `translateY(-10px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    const hero = document.querySelector('.hero');
    if (hero && window.matchMedia('(min-width: 769px)').matches) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    if (scrolled < window.innerHeight) {
                        hero.style.setProperty('--parallax-y', scrolled * 0.3 + 'px');
                        const heroContent = document.querySelector('.hero-content');
                        if (heroContent) {
                            heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
                            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.6;
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

});
