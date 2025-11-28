// Minimal JS: mobile nav + scroll reveal + hide on scroll (respecting prefers-reduced-motion)
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  // Mobile nav toggle
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    document.body.classList.toggle('nav-open');
    const expanded = nav.classList.contains('open');
    toggle.setAttribute('aria-expanded', String(expanded));
  });

  // Close nav when clicking a link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Hide header on scroll down, show on scroll up
  function updateHeaderVisibility() {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 10) {
      header.classList.remove('hidden');
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down
      header.classList.add('hidden');
      // Close mobile nav if open
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up - show header immediately
      header.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderVisibility);
      ticking = true;
    }
  });

  // Simple scroll-reveal
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();
