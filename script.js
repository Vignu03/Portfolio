/* ========================================
   Portfolio — Scripts & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Typing Animation ───
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        const phrases = [
            'Unity Game Developer',
            'VR Enthusiast',
            'Full Stack Developer'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 400;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // ─── Navbar Scroll Effect ───
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ─── Mobile Menu Toggle ───
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ─── Scroll Reveal ───
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── Counter Animation ───
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                let count = 0;
                const duration = 1500;
                const stepTime = duration / countTo;

                const timer = setInterval(() => {
                    count++;
                    target.textContent = count;
                    if (count >= countTo) {
                        clearInterval(timer);
                        target.textContent = countTo + '+';
                    }
                }, stepTime);

                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ─── Smooth scroll for anchor links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── Active nav link highlight ───
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--accent)';
            }
        });
    });
    // ─── This Is Blast — interactive banner grid ───
    (function initBlastBanner() {
        const card = document.getElementById('blastCard');
        const grid = document.getElementById('blastGrid');
        if (!card || !grid) return;

        const COLS = 10, ROWS = 3;
        const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f97316']; // red blue green orange

        // cols[c] = array of colors, index 0 = bottom, top = last index
        let cols = [];
        let cellEls = [];
        let simInterval = null;
        let busy = false;

        // Build fixed DOM of 30 cells (row-major: row0=top)
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const div = document.createElement('div');
                div.className = 'blast-cell';
                grid.appendChild(div);
                cellEls.push(div);
            }
        }

        function rndColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }

        function fillCols() {
            cols = Array.from({ length: COLS }, () =>
                Array.from({ length: ROWS }, rndColor)
            );
        }

        // Sync data → DOM (no transition override — CSS handles it)
        function syncUI() {
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const el = cellEls[r * COLS + c];
                    // visual top row r=0 → data index ROWS-1 (top of column)
                    const di = ROWS - 1 - r;
                    const color = di < cols[c].length ? cols[c][di] : null;
                    el.style.background = color || 'transparent';
                    el.style.opacity   = color ? '1' : '0';
                    el.style.transform = color ? 'scale(1)' : 'scale(0)';
                }
            }
        }

        function popRandom() {
            if (busy) return;
            // Collect all non-empty positions
            const avail = [];
            for (let c = 0; c < COLS; c++)
                for (let i = 0; i < cols[c].length; i++)
                    avail.push({ c, i });

            if (avail.length === 0) { fillCols(); syncUI(); return; }

            const { c, i } = avail[Math.floor(Math.random() * avail.length)];
            // Visual row of data-index i: bottom-aligned
            const vr = ROWS - 1 - i + (ROWS - cols[c].length);
            // clamp to valid row
            const visualRow = Math.max(0, Math.min(ROWS - 1, vr));
            const el = cellEls[visualRow * COLS + c];

            busy = true;
            // 1. Pop animation on the chosen cell
            el.style.transition = 'transform 0.14s ease, opacity 0.14s ease';
            el.style.transform = 'scale(0)';
            el.style.opacity = '0';

            setTimeout(() => {
                // 2. Remove from data (gravity auto-applies via bottom-alignment)
                cols[c].splice(i, 1);
                // 3. Re-sync with smooth fall
                cellEls.forEach(e => {
                    e.style.transition = 'background 0.12s ease, opacity 0.15s ease, transform 0.15s ease';
                });
                syncUI();
                busy = false;
            }, 150);
        }

        card.addEventListener('mouseenter', () => {
            fillCols();
            syncUI();
            simInterval = setInterval(popRandom, 280);
        });

        card.addEventListener('mouseleave', () => {
            clearInterval(simInterval);
            simInterval = null;
            busy = false;
            cellEls.forEach(el => {
                el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
                el.style.opacity = '0';
                el.style.transform = 'scale(0)';
            });
            setTimeout(() => { cols = []; }, 220);
        });
    })();

});
