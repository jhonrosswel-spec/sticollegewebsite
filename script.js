const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");
const filterButtons = document.querySelectorAll(".filter-btn");
const facilityCards = document.querySelectorAll(".facility-card");
const navItems = document.querySelectorAll(".nav-links a");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    facilityCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = selectedFilter === "all" || selectedFilter === category;

      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();

  alert(`Thank you, ${name}! This is a frontend-only demo form. No message was sent.`);
  contactForm.reset();
});

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

const imageOpenButtons = document.querySelectorAll(".image-open");
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");

imageOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modalImage.src = button.dataset.image;
    imageModal.classList.add("show");
  });
});

modalClose.addEventListener("click", () => {
  imageModal.classList.remove("show");
  modalImage.src = "";
});

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    imageModal.classList.remove("show");
    modalImage.src = "";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    imageModal.classList.remove("show");
    modalImage.src = "";
  }
});

/* Logo click dark mode */
const themeLogo = document.getElementById("themeLogo");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

themeLogo.addEventListener("click", (event) => {
  event.preventDefault();

  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

/* SAFE CLICK-ONLY PAGE TRANSITION */
(function () {
  const sections = Array.from(document.querySelectorAll("main > section[id]"));

  const clickableLinks = Array.from(
    document.querySelectorAll(".nav-links a[href^='#'], .hero-actions a[href^='#'], .text-link[href^='#']")
  );

  const navbarLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));

  if (!sections.length) return;

  document.body.classList.add("page-panels");

  let currentIndex = 0;

  function updateNavbar(activeId) {
    navbarLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });
  }

  function showPanel(targetId, shouldUpdateUrl = true) {
    const targetIndex = sections.findIndex((section) => section.id === targetId);

    if (targetIndex === -1) return;

    const directionClass = targetIndex >= currentIndex ? "panel-from-right" : "panel-from-left";

    sections.forEach((section) => {
      section.classList.remove("active-panel", "panel-from-right", "panel-from-left");
    });

    const targetSection = sections[targetIndex];
    targetSection.classList.add("active-panel", directionClass);

    currentIndex = targetIndex;
    updateNavbar(targetSection.id);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });

    if (shouldUpdateUrl) {
      history.pushState(null, "", `#${targetSection.id}`);
    }
  }

  clickableLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").replace("#", "");
      const targetExists = sections.some((section) => section.id === targetId);

      if (!targetExists) return;

      event.preventDefault();

      const navLinks = document.getElementById("navLinks");
      if (navLinks) {
        navLinks.classList.remove("show");
      }

      showPanel(targetId, true);
    });
  });

  window.addEventListener("popstate", () => {
    const hashTarget = window.location.hash.replace("#", "") || "home";
    showPanel(hashTarget, false);
  });

  const startingTarget = window.location.hash.replace("#", "") || "home";
  const startingIndex = sections.findIndex((section) => section.id === startingTarget);

  if (startingIndex !== -1) {
    currentIndex = startingIndex;
    showPanel(startingTarget, false);
  } else {
    showPanel("home", false);
  }
})();

/* BOTTOM PAGE DOTS */
const pageDots = document.querySelectorAll(".page-dot");

function setActiveDot(targetHref) {
  pageDots.forEach((dot) => {
    dot.classList.toggle("active", dot.getAttribute("href") === targetHref);
  });
}

pageDots.forEach((dot) => {
  dot.addEventListener("click", (event) => {
    const targetHref = dot.getAttribute("href");
    const matchingNavLink = document.querySelector(`.nav-links a[href="${targetHref}"]`);

    if (matchingNavLink) {
      event.preventDefault();
      matchingNavLink.click();
      setActiveDot(targetHref);
    }
  });
});

document.querySelectorAll(".nav-links a, .hero-actions a, .text-link").forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href");

    if (href && href.startsWith("#")) {
      setActiveDot(href);
    }
  });
});

setActiveDot(window.location.hash || "#home");
