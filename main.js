// Marley Gladman-Grace — Personal Portfolio
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));

  // Header border once the page is scrolled.
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile navigation.
  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Scrollspy: highlight the nav link of the section currently in view.
  // Section offsets are cached (they only change on resize) and the
  // handler is throttled with requestAnimationFrame to avoid forced
  // synchronous layout on every scroll tick.
  var sectionOffsets = [];

  function cacheSectionOffsets() {
    sectionOffsets = sections.map(function (section) {
      return { id: section.id, top: section.offsetTop };
    });
  }
  cacheSectionOffsets();
  window.addEventListener("resize", cacheSectionOffsets);

  function updateScrollSpy() {
    var marker = window.scrollY + window.innerHeight * 0.35;
    var currentId = "";

    sectionOffsets.forEach(function (entry) {
      if (entry.top <= marker) {
        currentId = entry.id;
      }
    });

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var scrollSpyTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!scrollSpyTicking) {
        scrollSpyTicking = true;
        window.requestAnimationFrame(function () {
          updateScrollSpy();
          scrollSpyTicking = false;
        });
      }
    },
    { passive: true }
  );
  updateScrollSpy();

  // Reveal-on-scroll animations.
  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  // Keep the footer year current.
  var yearSpan = document.getElementById("footer-year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }
})();
