document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Throttle helper — limits function calls to once per `ms` milliseconds
  const throttle = (fn, ms) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn(...args);
      }
    };
  };

  // ─── 1. NAVBAR SCROLL EFFECT ─────────────────────────────────────
  const navbar = document.querySelector(".navbar");

  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ─── 2. HAMBURGER / MOBILE MENU ──────────────────────────────────
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

  const openMenu = () => {
    hamburger.classList.add("active");
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  };

  const toggleMenu = () => {
    if (mobileMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", toggleMenu);

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (e) => {
      if (
        mobileMenu.classList.contains("active") &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        closeMenu();
      }
    });
  }

  // ─── 3. SMOOTH SCROLLING ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#" || href.includes(".html")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      if (prefersReducedMotion) {
        window.scrollTo(0, targetPosition);
      } else {
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });

  // ─── 4. TYPING ANIMATION ─────────────────────────────────────────
  const typedTextEl = document.querySelector(".typed-text");
  const typedCursorEl = document.querySelector(".typed-cursor");

  if (typedTextEl) {
    const strings = [
      "AI & Cyber Security Student",
      "Web Developer",
      "Founder of NovaCode",
    ];
    const typeSpeed = 70;
    const deleteSpeed = 35;
    const endPause = 2500;
    const stringPause = 400;

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimeout = null;

    if (prefersReducedMotion) {
      typedTextEl.textContent = strings[0];
      if (typedCursorEl) typedCursorEl.style.display = "none";
    } else {
      const type = () => {
        const currentString = strings[stringIndex];

        if (isDeleting) {
          charIndex--;
          typedTextEl.textContent = currentString.substring(0, charIndex);

          if (charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % strings.length;
            typeTimeout = setTimeout(type, stringPause);
            return;
          }
          typeTimeout = setTimeout(type, deleteSpeed);
        } else {
          charIndex++;
          typedTextEl.textContent = currentString.substring(0, charIndex);

          if (charIndex === currentString.length) {
            isDeleting = true;
            typeTimeout = setTimeout(type, endPause);
            return;
          }
          typeTimeout = setTimeout(type, typeSpeed);
        }
      };

      typeTimeout = setTimeout(type, stringPause);
    }
  }

  // ─── 5. SCROLL REVEAL ────────────────────────────────────────────
  const animateElements = document.querySelectorAll("[data-animate]");

  if (prefersReducedMotion) {
    animateElements.forEach((el) => el.classList.add("revealed"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add("revealed");

            const children = el.querySelectorAll(
              "[data-animate-child], .stagger-child"
            );
            children.forEach((child, i) => {
              child.style.transitionDelay = `${i * 0.1}s`;
              child.classList.add("revealed");
            });

            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    animateElements.forEach((el) => revealObserver.observe(el));
  } else {
    animateElements.forEach((el) => el.classList.add("revealed"));
  }

  // ─── 6. ACTIVE NAV LINK ──────────────────────────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-nav-links a"
  );

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", throttle(updateActiveLink, 100), { passive: true });
  updateActiveLink();

  // ─── 7. SCROLL TO TOP ────────────────────────────────────────────
  const scrollToTopBtn = document.querySelector(".scroll-to-top");

  if (scrollToTopBtn) {
    const toggleScrollToTop = () => {
      if (window.scrollY > 400) {
        scrollToTopBtn.classList.add("visible");
      } else {
        scrollToTopBtn.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", throttle(toggleScrollToTop, 100), { passive: true });

    scrollToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // ─── 8. AURORA PARALLAX ──────────────────────────────────────────
  if (isDesktop && !prefersReducedMotion) {
    const fields = document.querySelectorAll(".aurora-field");
    let afRafId = null;

    const fieldSpeeds = [0.02, -0.015, 0.01];

    const updateFieldParallax = () => {
      const scrollY = window.scrollY;
      fields.forEach((field, i) => {
        if (i < fieldSpeeds.length) {
          const y = scrollY * fieldSpeeds[i];
          const x = Math.sin(scrollY * 0.0008 + i) * 12;
          field.style.transform = `translate(${x}px, ${y}px)`;
        }
      });
      afRafId = null;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (afRafId === null) {
          afRafId = requestAnimationFrame(updateFieldParallax);
        }
      },
      { passive: true }
    );
  }

  // ─── 9. PAGE LOAD ───────────────────────────────────────────────
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 300);
});
