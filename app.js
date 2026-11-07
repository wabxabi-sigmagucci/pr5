document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".page-section");
  const navLinks = document.querySelectorAll(".nav-link");
  const validRoutes = ["home", "menu", "about"];
  const nav = document.querySelector(".main-nav");
  const menuToggle = document.querySelector("#menu-toggle");

  function showRoute() {
    let route = window.location.hash.slice(1).toLowerCase();

    if (!validRoutes.includes(route)) {
      route = "home";
      if (window.location.hash !== "#home") {
        history.replaceState(null, "", "#home");
      }
    }

    sections.forEach((section) => {
      section.classList.toggle("is-hidden", section.id !== route);
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${route}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  if (!window.location.hash) {
    history.replaceState(null, "", "#home");
  }
  showRoute();
  window.addEventListener("hashchange", showRoute);

  // One global timer is created once and is not restarted during routing.
  const stopwatchDisplay = document.querySelector("#stopwatch-time");
  let elapsedSeconds = 0;

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  window.setInterval(() => {
    elapsedSeconds += 1;
    stopwatchDisplay.textContent = formatTime(elapsedSeconds);
  }, 1000);

  // Menu category filtering.
  const categoryButtons = document.querySelectorAll(".category-button");
  const productCards = document.querySelectorAll(".product-card");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.category;

      categoryButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      productCards.forEach((card) => {
        const shouldShow = selectedCategory === "all" || card.dataset.category === selectedCategory;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  // Mobile navigation toggle.
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  // Review form and character counter.
  const reviewForm = document.querySelector("#review-form");
  const nameInput = document.querySelector("#review-name");
  const messageInput = document.querySelector("#review-message");
  const characterCount = document.querySelector("#char-count");
  const reviewList = document.querySelector("#review-list");
  const reviewCount = document.querySelector("#review-count");
  const formStatus = document.querySelector("#form-status");

  function updateReviewCount() {
    reviewCount.textContent = String(reviewList.querySelectorAll(".review-card").length);
  }

  messageInput.addEventListener("input", () => {
    characterCount.textContent = `${messageInput.value.length} / 240`;
  });

  function showFormStatus(message, isError = false) {
    formStatus.textContent = message;
    formStatus.classList.toggle("is-error", isError);
  }

  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
      showFormStatus("Please fill in both fields.", true);
      return;
    }

    if (name.length < 2 || message.length < 5) {
      showFormStatus("Name must contain 2 characters and review 5 characters.", true);
      return;
    }

    const reviewCard = document.createElement("article");
    reviewCard.className = "review-card";

    const stars = document.createElement("div");
    stars.className = "review-stars";
    stars.setAttribute("aria-label", "5 out of 5 stars");
    stars.textContent = "★★★★★";

    const reviewText = document.createElement("p");
    reviewText.textContent = `“${message}”`;

    const reviewerName = document.createElement("span");
    reviewerName.textContent = name.toUpperCase();

    reviewCard.append(stars, reviewText, reviewerName);
    reviewList.prepend(reviewCard);

    reviewForm.reset();
    characterCount.textContent = "0 / 240";
    showFormStatus("Thank you! Your note has been added.");
    updateReviewCount();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      formStatus.textContent = "";
      formStatus.classList.remove("is-error");
    }
  });

  document.querySelector("#current-year").textContent = String(new Date().getFullYear());
  updateReviewCount();
});
