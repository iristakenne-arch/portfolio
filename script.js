/* ═══════════════════════════════════════════════════════════════
   IRISTA KENNE — PORTFOLIO  |  script.js
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. INITIALISATION ICÔNES LUCIDE ─────────────────────── */
  if (window.lucide) lucide.createIcons();

  /* ── 2. LOADER ───────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        // Lancer les animations hero après chargement
        document.querySelectorAll('.hero-text, .hero-photo-wrap').forEach(el => {
          el.classList.add('visible');
        });
      }, 1800);
    });
  }

  /* ── 3. MODE SOMBRE ──────────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Lire la préférence stockée
  const savedTheme = localStorage.getItem('ik-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', savedTheme);

  themeToggle && themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ik-theme', next);
    // Recréer les icônes après basculement (les SVG sont dynamiques)
    if (window.lucide) lucide.createIcons();
  });

  /* ── 4. NAVIGATION ───────────────────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');

  // Scroll → navbar scrolled
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Hamburger
  menuToggle && menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Fermer le menu mobile au clic sur un lien
  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Lien actif selon la section visible
  const sectionIds = ['hero','about','skills','projects','gallery','contact'];
  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    let current = 'hero';
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── 5. BOUTON RETOUR EN HAUT ────────────────────────────── */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop && backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 6. SCROLL REVEAL ────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 7. BARRES DE COMPÉTENCES ────────────────────────────── */
  const skillItems = document.querySelectorAll('.skill-item');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item   = entry.target;
      const pct    = Number(item.dataset.percent) || 0;
      const fill   = item.querySelector('.skill-fill');
      const label  = item.querySelector('.skill-pct');

      // Animer la barre
      requestAnimationFrame(() => {
        fill.style.width = pct + '%';
      });

      // Animer le compteur
      const duration = 1200;
      const step     = 16;
      const increments = Math.ceil(duration / step);
      let count = 0;
      const timer = setInterval(() => {
        count += Math.ceil(pct / increments);
        if (count >= pct) { count = pct; clearInterval(timer); }
        label.textContent = count + '%';
      }, step);

      skillObserver.unobserve(item);
    });
  }, { threshold: 0.3 });

  skillItems.forEach(item => skillObserver.observe(item));

  /* ── 8. EFFET TYPING ─────────────────────────────────────── */
  const typingEl  = document.getElementById('typingText');
  const phrases   = [
    'Étudiante en Génie Informatique',
    'Community Manager',
    'Créatrice de contenu',
    'Passionnée de pâtisserie 🍰',
  ];
  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    if (!typingEl) return;
    const phrase = phrases[pIdx];

    if (!deleting) {
      typingEl.textContent = phrase.substring(0, cIdx + 1);
      cIdx++;
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 2000); // pause avant effacement
        return;
      }
      setTimeout(type, 65);
    } else {
      typingEl.textContent = phrase.substring(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }
  // Démarrer le typing après le loader
  setTimeout(type, 2000);

  /* ── 9. FILTRES GALERIE ──────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Bouton actif
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.45s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ── 10. FORMULAIRE CONTACT ──────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;

    // Simulation d'envoi (remplacer par votre logique réelle)
    setTimeout(() => {
      contactForm.reset();
      btn.textContent = '✓ Message envoyé';
      btn.style.background = 'linear-gradient(135deg,#4CAF50,#81C784)';
      formSuccess && formSuccess.classList.add('show');

      // Réinitialiser après 4s
      setTimeout(() => {
        btn.textContent = 'Envoyer le message';
        btn.disabled = false;
        btn.style.background = '';
        formSuccess && formSuccess.classList.remove('show');
        // Recréer les icônes perdues dans le bouton
        if (window.lucide) lucide.createIcons();
      }, 4000);
    }, 1800);
  });

  /* ── 11. SMOOTH SCROLL POUR ANCRES ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 12. PARALLAX LÉGER SUR HERO ─────────────────────────── */
  const heroPhoto = document.querySelector('.hero-photo-wrap');
  window.addEventListener('scroll', () => {
    if (!heroPhoto) return;
    const y = window.scrollY * 0.08;
    heroPhoto.style.transform = `translateY(${y}px)`;
  }, { passive: true });

}); // fin DOMContentLoaded
