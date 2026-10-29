document.addEventListener("DOMContentLoaded", () => {
  // ========================================================================
  // 1. Dark and Light Theme Toggle
  // ========================================================================
  const themeToggleBtn = document.getElementById("theme-toggle-button");
  const htmlElement = document.documentElement;

  function setTheme(theme) {
    if (theme === "dark") {
      htmlElement.classList.add("dark");
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute("aria-pressed", "true");
      }
    } else {
      htmlElement.classList.remove("dark");
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute("aria-pressed", "false");
      }
    }
    localStorage.setItem("portfolio_theme", theme);
  }

  const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isCurrentlyDark = htmlElement.classList.contains("dark");
      const nextTheme = isCurrentlyDark ? "light" : "dark";
      setTheme(nextTheme);
    });
  }

  // ========================================================================
  // 2. Active Navbar Link on Scroll & Smooth Scrolling
  // ========================================================================
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  const header = document.getElementById("header");
  let isNavClickScrolling = false;
  let navClickTimeout = null;

  function updateActiveNavLink() {
    if (isNavClickScrolling) return;

    const scrollY = window.scrollY;
    const headerHeight = header ? header.offsetHeight : 80;

    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 50;

    if (isAtBottom && navLinks.length > 0) {
      navLinks.forEach((link) => link.classList.remove("active"));
      navLinks[navLinks.length - 1].classList.add("active");
      return;
    }

    let currentSectionId = "";

    navLinks.forEach((link) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId !== "#") {
        const section = document.querySelector(targetId);
        if (section) {
          const sectionTop = section.offsetTop - headerHeight - 80;
          const sectionHeight = section.offsetHeight;
          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSectionId = targetId;
          }
        }
      }
    });

    if (!currentSectionId && scrollY < 200 && navLinks.length > 0) {
      currentSectionId = navLinks[0].getAttribute("href");
    }

    navLinks.forEach((link) => {
      if (link.getAttribute("href") === currentSectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();

          navLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");

          isNavClickScrolling = true;
          clearTimeout(navClickTimeout);

          const headerHeight = header ? header.offsetHeight : 80;
          const targetTop = targetSection.offsetTop - headerHeight;

          window.scrollTo({
            top: targetTop > 0 ? targetTop : 0,
            behavior: "smooth",
          });

          navClickTimeout = setTimeout(() => {
            isNavClickScrolling = false;
            updateActiveNavLink();
          }, 800);
        }
      }
    });
  });

  // ========================================================================
  // 3. Scroll-to-Top Button
  // ========================================================================
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  function updateScrollToTopVisibility() {
    if (!scrollToTopBtn) return;
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.remove("opacity-0", "invisible");
      scrollToTopBtn.classList.add("opacity-100", "visible");
    } else {
      scrollToTopBtn.classList.remove("opacity-100", "visible");
      scrollToTopBtn.classList.add("opacity-0", "invisible");
    }
  }

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  window.addEventListener("scroll", () => {
    updateActiveNavLink();
    updateScrollToTopVisibility();
  });

  updateActiveNavLink();
  updateScrollToTopVisibility();

  // ========================================================================
  // 4. Portfolio Navigation Tabs (Filter)
  // ========================================================================
  const portfolioFilterBtns = document.querySelectorAll(".portfolio-filter");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  const activeFilterClasses = [
    "active",
    "bg-linear-to-r",
    "from-primary",
    "to-secondary",
    "text-white",
    "hover:shadow-lg",
    "hover:shadow-primary/50",
  ];

  const inactiveFilterClasses = [
    "bg-white",
    "dark:bg-slate-800",
    "text-slate-600",
    "dark:text-slate-300",
    "hover:bg-slate-100",
    "dark:hover:bg-slate-700",
    "border",
    "border-slate-300",
    "dark:border-slate-700",
  ];

  portfolioFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      portfolioFilterBtns.forEach((b) => {
        b.classList.remove(...activeFilterClasses);
        b.classList.add(...inactiveFilterClasses);
        b.setAttribute("aria-pressed", "false");
      });

      btn.classList.remove(...inactiveFilterClasses);
      btn.classList.add(...activeFilterClasses);
      btn.setAttribute("aria-pressed", "true");

      const filterValue = btn.getAttribute("data-filter");

      portfolioItems.forEach((item) => {
        const itemCategory = item.getAttribute("data-category");
        if (filterValue === "all" || itemCategory === filterValue) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  // ========================================================================
  // 5. Testimonials Carousel
  // ========================================================================
  const carousel = document.getElementById("testimonials-carousel");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prev-testimonial");
  const nextBtn = document.getElementById("next-testimonial");
  const indicators = document.querySelectorAll(".carousel-indicator");

  let currentIndex = 0;

  function getVisibleCardsCount() {
    if (window.innerWidth >= 1024) {
      return 3;
    } else if (window.innerWidth >= 640) {
      return 2;
    } else {
      return 1;
    }
  }

  function updateCarousel() {
    if (!carousel || cards.length === 0) return;

    const visibleCards = getVisibleCardsCount();
    const maxIndex = Math.max(0, cards.length - visibleCards);

    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    }

    const stepPercent = 100 / visibleCards;
    carousel.style.transform = `translateX(${currentIndex * stepPercent}%)`;

    indicators.forEach((dot, idx) => {
      const isSelected =
        idx === currentIndex ||
        (currentIndex >= indicators.length && idx === indicators.length - 1);

      if (isSelected) {
        dot.classList.add("bg-accent");
        dot.classList.remove("dark:bg-slate-600");
        dot.setAttribute("aria-selected", "true");
      } else {
        dot.classList.remove("bg-accent");
        dot.classList.add("dark:bg-slate-600");
        dot.setAttribute("aria-selected", "false");
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const visibleCards = getVisibleCardsCount();
      const maxIndex = Math.max(0, cards.length - visibleCards);
      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarousel();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const visibleCards = getVisibleCardsCount();
      const maxIndex = Math.max(0, cards.length - visibleCards);
      if (currentIndex <= 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex--;
      }
      updateCarousel();
    });
  }

  indicators.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetIndex = parseInt(dot.getAttribute("data-index"), 10);
      if (!isNaN(targetIndex)) {
        currentIndex = targetIndex;
        updateCarousel();
      }
    });
  });

  if (carousel) {
    let touchStartX = 0;

    carousel.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - touchStartX;

        if (Math.abs(diffX) > 40) {
          if (diffX < 0) {
            if (nextBtn) nextBtn.click();
          } else {
            if (prevBtn) prevBtn.click();
          }
        }
      },
      { passive: true }
    );
  }

  window.addEventListener("resize", () => {
    updateCarousel();
  });

  updateCarousel();

  // ========================================================================
  // 6. Customization Sidebar (Colors, Fonts, Reset)
  // ========================================================================
  const settingsToggle = document.getElementById("settings-toggle");
  const settingsSidebar = document.getElementById("settings-sidebar");
  const closeSettingsBtn = document.getElementById("close-settings");
  const resetSettingsBtn = document.getElementById("reset-settings");
  const fontButtons = document.querySelectorAll(".font-option");
  const themeColorsGrid = document.getElementById("theme-colors-grid");

  function openSettings() {
    if (!settingsSidebar) return;
    settingsSidebar.classList.remove("translate-x-full");
    settingsSidebar.setAttribute("aria-hidden", "false");
    if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "true");
  }

  function closeSettings() {
    if (!settingsSidebar) return;
    settingsSidebar.classList.add("translate-x-full");
    settingsSidebar.setAttribute("aria-hidden", "true");
    if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "false");
  }

  if (settingsToggle) {
    settingsToggle.addEventListener("click", () => {
      const isClosed = settingsSidebar.classList.contains("translate-x-full");
      if (isClosed) {
        openSettings();
      } else {
        closeSettings();
      }
    });
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener("click", closeSettings);
  }

  document.addEventListener("click", (e) => {
    if (
      settingsSidebar &&
      !settingsSidebar.classList.contains("translate-x-full") &&
      !settingsSidebar.contains(e.target) &&
      settingsToggle &&
      !settingsToggle.contains(e.target)
    ) {
      closeSettings();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      settingsSidebar &&
      !settingsSidebar.classList.contains("translate-x-full")
    ) {
      closeSettings();
    }
  });

  function applyFont(fontName) {
    document.body.classList.remove(
      "font-tajawal",
      "font-alexandria",
      "font-cairo"
    );
    document.body.classList.add(`font-${fontName}`);

    fontButtons.forEach((btn) => {
      const isCurrent = btn.getAttribute("data-font") === fontName;
      btn.setAttribute("aria-checked", isCurrent ? "true" : "false");
      if (isCurrent) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    localStorage.setItem("portfolio_font", fontName);
  }

  fontButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const chosenFont = btn.getAttribute("data-font");
      if (chosenFont) {
        applyFont(chosenFont);
      }
    });
  });

  const savedFont = localStorage.getItem("portfolio_font") || "tajawal";
  applyFont(savedFont);

  const colorThemes = [
    {
      id: "indigo",
      name: "أرجواني (الافتراضي)",
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#ec4899",
    },
    {
      id: "blue",
      name: "أزرق نيلي",
      primary: "#3b82f6",
      secondary: "#2563eb",
      accent: "#06b6d4",
    },
    {
      id: "emerald",
      name: "زمردي أخضر",
      primary: "#10b981",
      secondary: "#059669",
      accent: "#14b8a6",
    },
    {
      id: "rose",
      name: "وردي ياقوتي",
      primary: "#f43f5e",
      secondary: "#e11d48",
      accent: "#fb7185",
    },
    {
      id: "amber",
      name: "عنبري ذهبي",
      primary: "#f59e0b",
      secondary: "#d97706",
      accent: "#ea580c",
    },
    {
      id: "purple",
      name: "بنفسجي عميق",
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      accent: "#c084fc",
    },
    {
      id: "cyan",
      name: "سماوي تركواز",
      primary: "#06b6d4",
      secondary: "#0891b2",
      accent: "#22d3ee",
    },
    {
      id: "red",
      name: "أحمر قرمزي",
      primary: "#ef4444",
      secondary: "#dc2626",
      accent: "#f87171",
    },
  ];

  function applyThemeColors(theme) {
    htmlElement.style.setProperty("--color-primary", theme.primary);
    htmlElement.style.setProperty("--color-secondary", theme.secondary);
    htmlElement.style.setProperty("--color-accent", theme.accent);

    localStorage.setItem("portfolio_theme_color", JSON.stringify(theme));

    const colorButtons = document.querySelectorAll(".color-theme-button");
    colorButtons.forEach((btn) => {
      const isSelected = btn.getAttribute("data-color-id") === theme.id;
      btn.setAttribute("aria-checked", isSelected ? "true" : "false");
      if (isSelected) {
        btn.classList.add("ring-2", "ring-offset-2", "ring-primary");
        btn.innerHTML =
          '<i class="fa-solid fa-check text-white text-xs" aria-hidden="true"></i>';
      } else {
        btn.classList.remove("ring-2", "ring-offset-2", "ring-primary");
        btn.innerHTML = "";
      }
    });
  }

  function initColorThemes() {
    if (!themeColorsGrid) return;
    themeColorsGrid.innerHTML = "";

    colorThemes.forEach((theme) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "color-theme-button w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center shadow-md focus:outline-none";
      btn.style.backgroundColor = theme.primary;
      btn.setAttribute("data-color-id", theme.id);
      btn.setAttribute("aria-label", theme.name);
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", "false");

      btn.addEventListener("click", () => {
        applyThemeColors(theme);
      });

      themeColorsGrid.appendChild(btn);
    });
  }

  initColorThemes();

  const savedColorsRaw = localStorage.getItem("portfolio_theme_color");
  if (savedColorsRaw) {
    try {
      const savedThemeObj = JSON.parse(savedColorsRaw);
      applyThemeColors(savedThemeObj);
    } catch (e) {
      applyThemeColors(colorThemes[0]);
    }
  } else {
    applyThemeColors(colorThemes[0]);
  }

  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener("click", () => {
      applyThemeColors(colorThemes[0]);
      localStorage.removeItem("portfolio_theme_color");

      applyFont("tajawal");
      localStorage.removeItem("portfolio_font");
    });
  }

  // ========================================================================
  // 7. Custom Select Dropdowns ("نوع المشروع" and "الميزانية المتوقعة")
  // ========================================================================
  const customSelectWrappers = document.querySelectorAll(".custom-select-wrapper");

  function closeAllDropdowns(exceptWrapper = null) {
    customSelectWrappers.forEach((wrapper) => {
      if (wrapper !== exceptWrapper) {
        const select = wrapper.querySelector(".custom-select");
        const optionsMenu = wrapper.querySelector(".custom-options");
        const chevron = wrapper.querySelector(".fa-chevron-down");

        if (optionsMenu) optionsMenu.classList.add("hidden");
        if (select) select.setAttribute("aria-expanded", "false");
        if (chevron) chevron.classList.remove("rotate-180");
        wrapper.style.zIndex = "";
      }
    });
  }

  customSelectWrappers.forEach((wrapper) => {
    const select = wrapper.querySelector(".custom-select");
    const optionsMenu = wrapper.querySelector(".custom-options");
    const options = wrapper.querySelectorAll(".custom-option");
    const selectedText = wrapper.querySelector(".selected-text");
    const chevron = wrapper.querySelector(".fa-chevron-down");

    if (!select || !optionsMenu) return;

    optionsMenu.style.top = "100%";
    optionsMenu.style.right = "0";

    select.addEventListener("click", (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = !optionsMenu.classList.contains("hidden");

      closeAllDropdowns(wrapper);

      if (isCurrentlyOpen) {
        optionsMenu.classList.add("hidden");
        select.setAttribute("aria-expanded", "false");
        if (chevron) chevron.classList.remove("rotate-180");
        wrapper.style.zIndex = "";
      } else {
        optionsMenu.classList.remove("hidden");
        select.setAttribute("aria-expanded", "true");
        if (chevron) chevron.classList.add("rotate-180");
        wrapper.style.zIndex = "40";
      }
    });

    select.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select.click();
      } else if (e.key === "Escape") {
        optionsMenu.classList.add("hidden");
        select.setAttribute("aria-expanded", "false");
        if (chevron) chevron.classList.remove("rotate-180");
        wrapper.style.zIndex = "";
      }
    });

    options.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        const value = option.getAttribute("data-value") || option.textContent.trim();

        if (selectedText) {
          selectedText.textContent = value;
          selectedText.classList.remove("text-slate-500", "dark:text-slate-400");
          selectedText.classList.add("text-slate-800", "dark:text-white", "font-medium");
        }

        select.setAttribute("data-selected-value", value);

        optionsMenu.classList.add("hidden");
        select.setAttribute("aria-expanded", "false");
        if (chevron) chevron.classList.remove("rotate-180");
        wrapper.style.zIndex = "";
      });
    });
  });

  document.addEventListener("click", () => {
    closeAllDropdowns();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllDropdowns();
    }
  });
});
