// Reviews array initialization
const reviews = JSON.parse(localStorage.getItem('reviews')) || [];

// Counter animation functions
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target) + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current) + '+';
        }
    }, 40);
}

function startCounterAnimation() {
    const stats = [
        { element: document.querySelector('.stat:nth-child(1) h3'), target: 25 },
        { element: document.querySelector('.stat:nth-child(2) h3'), target: 20 },
        { element: document.querySelector('.stat:nth-child(3) h3'), target: 3 },
        { element: document.querySelector('.stat:nth-child(4) h3'), target: 200 }
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => {
                    if (stat.element) {
                        animateCounter(stat.element, stat.target);
                    }
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}
// Add this line to ensure the function runs when the page loads
document.addEventListener('DOMContentLoaded', startCounterAnimation);
function toggleAbout() {
    const content = document.getElementById('about-content');
    const readMore = document.querySelector('.read-more');
    
    content.classList.toggle('expanded');
    readMore.textContent = content.classList.contains('expanded') ? 'Read Less' : 'Read More';
}
function toggleAboutContent() {
    const extendedContent = document.getElementById('about-content-extended');
    const aboutButton = document.querySelector('.about-button');
    
    if (extendedContent.classList.contains('hidden')) {
        extendedContent.classList.remove('hidden');
        aboutButton.textContent = 'Read Less ←';
    } else {
        extendedContent.classList.add('hidden');
        aboutButton.textContent = 'Read More →';
    }
}

// Review functions
function addReview(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const text = form.querySelector('textarea').value;

    const newReview = {
        name,
        rating,
        text,
        date: new Date().toISOString()
    };

    reviews.unshift(newReview);
    if (reviews.length > 3) {
        reviews.pop();
    }

    localStorage.setItem('reviews', JSON.stringify(reviews));
    displayReviews();
    form.reset();
}

function displayReviews() {
    const recentFeedbacks = document.querySelector('.recent-feedbacks');
    const reviewsHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <h3 class="review-name">${review.name}</h3>
                <div class="star-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');

    const feedbackContent = `
        <h2>Recent Feedbacks</h2>
        ${reviewsHTML}
    `;
    
    recentFeedbacks.innerHTML = feedbackContent;
}

// Event Listeners
// Add after your existing event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize counter animation
    startCounterAnimation();
    
    // Initialize reviews display
    displayReviews();
    
    // Review form submission
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', addReview);
    }

    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const body = document.body;
    
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    closeMenu?.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.style.overflow = 'auto';
    });
    
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    mobileLinks?.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });
});


