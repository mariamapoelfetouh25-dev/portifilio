document.addEventListener('DOMContentLoaded', () => {

  const body = document.body;
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Mobile menu
  const closeMenu = () => {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    body.style.overflow = '';
  };

  const openMenu = () => {
    hamburger?.classList.add('active');
    mobileMenu?.classList.add('active');
    body.style.overflow = 'hidden';
  };

  // Navbar scroll effect
  const handleNavScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  // Project filtering
  let isFiltering = false;

  const filterProjects = (filter) => {
    if (isFiltering) return;
    isFiltering = true;

    projectCards.forEach(card => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;

      if (shouldShow) {
        card.classList.remove('hidden');
        card.classList.add('showing');
      } else {
        card.classList.add('hiding');
        setTimeout(() => {
          card.classList.remove('showing', 'hiding');
          card.classList.add('hidden');
        }, 400);
      }
    });

    setTimeout(() => { isFiltering = false; }, 500);
  };

  // Page load
  setTimeout(() => body.classList.add('page-loaded'), 150);

  // Scroll listener
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Hamburger menu
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(btn.dataset.filter);
    });
  });

  // Scroll reveal for project cards
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.classList.add('revealed');
          revealObserver.unobserve(card);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    projectCards.forEach((card, index) => {
      card.style.transitionDelay = `${(index % 4) * 0.1}s`;
      revealObserver.observe(card);
    });
  } else {
    projectCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
  }

});
