/**
 * GSAP Scroll Animations
 * Reveal elements, parallax, section transitions, stat counters
 */
export function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // ── REVEAL ON SCROLL ────────────────────────────
  const revealEls = gsap.utils.toArray('.reveal');
  revealEls.forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
        delay: (i % 4) * 0.08,
      }
    );
  });

  // ── HERO PARALLAX ───────────────────────────────
  const heroLogo = document.querySelector('.hero-logo');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroTitle = document.querySelector('.hero-title');

  if (heroLogo) {
    gsap.to(heroLogo, {
      y: -60,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  }

  if (heroTitle) {
    gsap.to(heroTitle, {
      y: -30,
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: '40% top',
        end: '90% top',
        scrub: 1,
      }
    });
  }

  if (heroSubtitle) {
    gsap.to(heroSubtitle, {
      y: -20,
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: '30% top',
        end: '80% top',
        scrub: 1,
      }
    });
  }

  // ── STAT COUNTER ANIMATION ──────────────────────
  document.querySelectorAll('.hero-stat-value[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val);
      }
    });
  });

  // ── SMOOTH SECTION NAVIGATION ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = document.querySelector('.site-nav')?.offsetHeight || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── ACTIVE NAV STATE ON SCROLL ──────────────────
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(section => observer.observe(section));
  }

  // ── NAV BACKGROUND ON SCROLL ────────────────────
  const nav = document.querySelector('.site-nav');
  if (nav) {
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        nav.style.borderBottomColor = self.progress > 0
          ? 'rgba(0, 255, 245, 0.08)'
          : 'rgba(100, 100, 180, 0.1)';
      }
    });
  }
}
