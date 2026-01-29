'use strict';

// ============================================================================
// NEURAL NETWORK CANVAS ANIMATION
// ============================================================================

class Particle {
  constructor(canvas, colors) {
    this.canvas = canvas;
    this.colors = colors;
    this.reset();
    this.pulseOffset = Math.random() * Math.PI * 2;
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = Math.random() * 2 + 1;

    // Weighted color selection (favor cyan)
    const rand = Math.random();
    if (rand < 0.4) {
      this.color = this.colors.cyan;
    } else if (rand < 0.65) {
      this.color = this.colors.emerald;
    } else if (rand < 0.85) {
      this.color = this.colors.violet;
    } else {
      this.color = this.colors.amber;
    }

    this.baseAlpha = Math.random() * 0.5 + 0.3;
  }

  update(mouse) {
    // Mouse repulsion
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force * 0.1;
        this.vy += Math.sin(angle) * force * 0.1;
      }
    }

    // Apply velocity with damping
    this.vx *= 0.99;
    this.vy *= 0.99;
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) {
      this.vx *= -1;
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
    }
    if (this.y < 0 || this.y > this.canvas.height) {
      this.vy *= -1;
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));
    }
  }

  draw(ctx, time) {
    const pulse = Math.sin(time * 0.002 + this.pulseOffset) * 0.2 + 0.8;
    const alpha = this.baseAlpha * pulse;

    // Glow
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}${(alpha * 0.1).toFixed(2)})`;
    ctx.fill();

    // Particle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}${alpha.toFixed(2)})`;
    ctx.fill();
  }
}

class NeuralNetwork {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.colors = {
      cyan: 'rgba(0, 229, 255,',
      emerald: 'rgba(0, 214, 143,',
      violet: 'rgba(167, 139, 250,',
      amber: 'rgba(255, 176, 32,'
    };
    this.connectionDistance = 150;
    this.animationId = null;
    this.lastResize = 0;
    this.isVisible = true;
    this.heroSection = document.getElementById('hero');

    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    this.resize();
    this.createParticles();
  }

  createParticles() {
    this.particles = [];
    const count = this.getParticleCount();
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.canvas, this.colors));
    }
  }

  getParticleCount() {
    const width = window.innerWidth;
    if (width < 480) return 25;
    if (width < 768) return 40;
    return 80;
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.ctx.scale(dpr, dpr);

    // Reposition particles if canvas size changed significantly
    const currentCount = this.getParticleCount();
    if (this.particles.length !== currentCount) {
      this.createParticles();
    }
  }

  setupEventListeners() {
    // Mouse tracking
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Touch support
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      this.mouse.x = touch.clientX - rect.left;
      this.mouse.y = touch.clientY - rect.top;
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Resize with debounce
    window.addEventListener('resize', () => {
      const now = Date.now();
      if (now - this.lastResize > 200) {
        this.lastResize = now;
        this.resize();
      }
    });

    // Visibility API
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = 1 - (distance / this.connectionDistance);
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 229, 255, ${(opacity * 0.3).toFixed(2)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  checkHeroInView() {
    if (!this.heroSection) return true;
    const rect = this.heroSection.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  animate(time = 0) {
    this.animationId = requestAnimationFrame((t) => this.animate(t));

    // Skip if not visible or scrolled past hero
    if (!this.isVisible || !this.checkHeroInView()) return;

    // Clear canvas
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    this.ctx.clearRect(0, 0, width, height);

    // Draw connections first (behind particles)
    this.drawConnections();

    // Update and draw particles
    this.particles.forEach(particle => {
      particle.update(this.mouse);
      particle.draw(this.ctx, time);
    });
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// ============================================================================
// THEME TOGGLE
// ============================================================================

class ThemeToggle {
  constructor() {
    this.toggle = document.querySelector('.theme-toggle');
    this.currentTheme = localStorage.getItem('vvr-theme') || 'dark';
    this.icons = {
      sun: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <line x1="10" y1="1" x2="10" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="10" y1="17" x2="10" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="1" y1="10" x2="3" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="17" y1="10" x2="19" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="3.5" y1="3.5" x2="5" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="15" y1="15" x2="16.5" y2="16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="3.5" y1="16.5" x2="5" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="15" y1="5" x2="16.5" y2="3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
      moon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 10.5C16.8 14.6 13.4 18 9.3 18C5.8 18 2.8 15.6 1.8 12.3C1.6 11.6 2.3 11 3 11.2C4.4 11.6 5.9 11.4 7.2 10.7C9.4 9.5 10.7 7.1 10.6 4.6C10.6 3.8 10.4 3 10.2 2.3C9.9 1.6 10.5 0.9 11.3 1.1C14.9 2.1 17.6 5.5 17 10.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>`
    };
    this.init();
  }

  init() {
    if (!this.toggle) return;

    // Apply saved theme
    if (this.currentTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    this.updateIcon();

    this.toggle.addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';

      if (this.currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }

      localStorage.setItem('vvr-theme', this.currentTheme);
      this.updateIcon();
    });
  }

  updateIcon() {
    if (!this.toggle) return;

    this.toggle.innerHTML = this.currentTheme === 'dark' ? this.icons.sun : this.icons.moon;
    this.toggle.setAttribute('aria-label',
      this.currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
}

// ============================================================================
// SCROLL REVEAL SYSTEM
// ============================================================================

function initRevealObserver() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

// ============================================================================
// SKILL BAR ANIMATION
// ============================================================================

function initSkillBars() {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          const percent = fill.dataset.percent || fill.style.getPropertyValue('--skill-width');
          if (percent) {
            fill.style.transform = `scaleX(${parseInt(percent) / 100})`;
          }
        }
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar').forEach(el => {
    skillObserver.observe(el);
  });
}

// ============================================================================
// EXPANDABLE SECTIONS
// ============================================================================

function initExpandables() {
  document.querySelectorAll('.expandable').forEach(card => {
    const toggle = card.querySelector('.expand-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');

      // Close other expanded cards in same section
      const parent = card.closest('.industry-grid, .axioms-grid');
      if (parent) {
        parent.querySelectorAll('.expanded').forEach(other => {
          if (other !== card) {
            other.classList.remove('expanded');
            const otherToggle = other.querySelector('.expand-toggle');
            if (otherToggle) {
              otherToggle.setAttribute('aria-expanded', 'false');
            }
          }
        });
      }

      card.classList.toggle('expanded');
      toggle.setAttribute('aria-expanded', !isExpanded);

      // Synaptic pulse effect on expand
      if (!isExpanded) {
        const originalBorder = card.style.borderColor;
        const originalShadow = card.style.boxShadow;

        card.style.borderColor = 'var(--cyan)';
        card.style.boxShadow = '0 0 30px var(--cyan-glow)';

        setTimeout(() => {
          card.style.borderColor = originalBorder;
          card.style.boxShadow = originalShadow;
        }, 600);
      }
    });
  });
}

// ============================================================================
// SMOOTH SCROLL NAVIGATION
// ============================================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      // Only intercept same-page anchor links
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Close mobile nav if open
      const navLinks = document.querySelector('.nav-links');
      const navToggle = document.querySelector('.nav-toggle');

      if (navLinks) navLinks.classList.remove('active');
      if (navToggle) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============================================================================
// SCROLL PROGRESS INDICATOR
// ============================================================================

function initScrollProgress() {
  const progressFill = document.querySelector('.scroll-progress-fill');
  if (!progressFill) return;

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.height = `${progress}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress(); // Initial call
}

// ============================================================================
// NAVIGATION BEHAVIOR
// ============================================================================

function initNavigation() {
  const nav = document.querySelector('.site-nav');
  const hero = document.getElementById('hero');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');
  const isHomePage = !!hero;

  // Scroll-based nav background
  if (nav && hero) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          nav.classList.add('nav-scrolled');
        } else {
          nav.classList.remove('nav-scrolled');
        }
      });
    }, { threshold: 0.1 });

    navObserver.observe(hero);
  } else if (nav) {
    // Sub-pages always show scrolled nav (no hero)
    nav.classList.add('nav-scrolled');
  }

  // Active section highlighting — only on home page
  if (isHomePage) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length > 0 && navLinks.length > 0) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              const isActive = link.getAttribute('href') === `#${id}`;
              link.classList.toggle('active', isActive);
            });
          }
        });
      }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
      });

      sections.forEach(section => sectionObserver.observe(section));
    }
  }

  // Mobile hamburger toggle
  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      const isActive = navToggle.classList.contains('active');

      navToggle.classList.toggle('active');
      navLinksEl.classList.toggle('active');

      navToggle.setAttribute('aria-expanded', !isActive);
    });
  }
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

function initAccessibility() {
  // Keyboard navigation for expandable sections
  document.querySelectorAll('.expand-toggle').forEach(toggle => {
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');

    if (!toggle.hasAttribute('aria-expanded')) {
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  });

  // Ensure nav toggle has proper ARIA
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.setAttribute('role', 'button');
    navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    if (!navToggle.hasAttribute('aria-expanded')) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }
}

// ============================================================================
// REDUCED MOTION CHECK
// ============================================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function handleReducedMotion() {
  if (prefersReducedMotion.matches) {
    // Make all reveals instant
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('revealed');
    });

    // Make skill bars instant
    document.querySelectorAll('.skill-bar .skill-fill').forEach(fill => {
      const percent = fill.dataset.percent || fill.style.getPropertyValue('--fill');
      if (percent) {
        fill.style.transform = `scaleX(${parseInt(percent) / 100})`;
        fill.style.transition = 'none';
      }
    });
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  handleReducedMotion();

  // Neural network canvas (skip if reduced motion)
  const canvas = document.getElementById('neural-canvas');
  if (canvas && !prefersReducedMotion.matches) {
    new NeuralNetwork(canvas);
  }

  // Theme toggle
  new ThemeToggle();

  // Scroll reveals
  initRevealObserver();

  // Skill bars
  initSkillBars();

  // Expandable sections
  initExpandables();

  // Smooth scroll
  initSmoothScroll();

  // Scroll progress
  initScrollProgress();

  // Navigation
  initNavigation();

  // Accessibility
  initAccessibility();
});

// Listen for reduced motion changes
prefersReducedMotion.addEventListener('change', handleReducedMotion);
