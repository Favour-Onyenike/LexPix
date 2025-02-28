// Login button
document.getElementById("loginBtn")?.addEventListener("click", function () {
    window.location.href = "login.html";
  });
  
  // Reviews array initialization
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  
  // Counter animation functions
  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = Math.round(target) + "+";
        clearInterval(timer);
      } else {
        element.textContent = Math.round(current) + "+";
      }
    }, 40);
  }
  
  function startCounterAnimation() {
    const stats = [
      { element: document.querySelector(".stat:nth-child(1) h3"), target: 25 },
      { element: document.querySelector(".stat:nth-child(2) h3"), target: 20 },
      { element: document.querySelector(".stat:nth-child(3) h3"), target: 3 },
      { element: document.querySelector(".stat:nth-child(4) h3"), target: 200 },
    ];
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((stat) => {
              if (stat.element) {
                animateCounter(stat.element, stat.target);
              }
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
  
    const statsSection = document.querySelector(".stats-section");
    if (statsSection) {
      observer.observe(statsSection);
    }
  }
  
  // Toggle About section content
  function toggleAboutContent() {
    const extendedContent = document.getElementById("about-content-extended");
    const aboutButton = document.querySelector(".about-button");
  
    if (extendedContent?.classList.contains("hidden")) {
      extendedContent.classList.remove("hidden");
      aboutButton.textContent = "Read Less ←";
    } else {
      extendedContent?.classList.add("hidden");
      aboutButton.textContent = "Read More →";
    }
  }
  
  // Review functions
  function addReview(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const text = form.querySelector("textarea").value;
  
    if (!name || !rating || !text) {
      alert("Please fill out all fields.");
      return;
    }
  
    const newReview = {
      name,
      rating,
      text,
      date: new Date().toISOString(),
    };
  
    reviews.unshift(newReview);
    if (reviews.length > 3) {
      reviews.pop();
    }
  
    localStorage.setItem("reviews", JSON.stringify(reviews));
    displayReviews();
    form.reset();
  }
  
  function displayReviews() {
    const recentFeedbacks = document.querySelector(".recent-feedbacks");
    if (!recentFeedbacks) return;
  
    const reviewsHTML = reviews
      .map(
        (review) => `
        <div class="review-card">
          <div class="review-header">
            <h3 class="review-name">${review.name}</h3>
            <div class="star-rating">${"★".repeat(review.rating)}${"☆".repeat(
          5 - review.rating
        )}</div>
          </div>
          <p class="review-text">${review.text}</p>
        </div>
      `
      )
      .join("");
  
    recentFeedbacks.innerHTML = `
      <h2>Recent Feedbacks</h2>
      ${reviewsHTML}
    `;
  }
  
  // Event Listeners
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize counter animation
    startCounterAnimation();
  
    // Initialize reviews display
    displayReviews();
  
    // Review form submission
    const reviewForm = document.querySelector(".review-form");
    if (reviewForm) {
      reviewForm.addEventListener("submit", addReview);
    }
  
    // Mobile menu functionality
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");
    const closeMenu = document.querySelector(".close-menu");
    const menuOverlay = document.createElement("div");
    menuOverlay.className = "menu-overlay";
    document.body.appendChild(menuOverlay);
  
    // Toggle Mobile Menu
    function toggleMenu() {
      mobileMenu?.classList.toggle("active");
      menuOverlay?.classList.toggle("active");
    }
  
    // Event Listeners for Mobile Menu
    if (hamburger) {
      hamburger.addEventListener("click", toggleMenu);
    } else {
      console.error("Hamburger button not found!");
    }
  
    if (closeMenu) {
      closeMenu.addEventListener("click", toggleMenu);
    }
  
    if (menuOverlay) {
      menuOverlay.addEventListener("click", toggleMenu);
    }
  
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          if ("scrollBehavior" in document.documentElement.style) {
            window.scrollTo({
              top: target.offsetTop - 60,
              behavior: "smooth",
            });
          } else {
            // Fallback for older browsers
            window.scrollTo(0, target.offsetTop - 60);
          }
          // Close mobile menu if open
          mobileMenu?.classList.remove("active");
          menuOverlay?.classList.remove("active");
        }
      });
    });
  
    // About section content toggle
    const aboutButton = document.querySelector(".about-button");
    const extendedContent = document.getElementById("about-content-extended");
  
    if (aboutButton && extendedContent) {
      aboutButton.addEventListener("click", toggleAboutContent);
    }
  
    // Form submission with cross-browser compatibility
    const contactForm = document.querySelector(".contact-form form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        // Add your form submission logic here
      });
    }
  });