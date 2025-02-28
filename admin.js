document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initLogout();
    initReviewsManagement();
    initGalleryManagement();
});

// Logout functionality
function initLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

// Reviews Management
function initReviewsManagement() {
    const reviewsList = document.querySelector('.reviews-list');
    
    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviewsList.innerHTML = '';
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p>No reviews found.</p>';
            return;
        }
        
        reviews.forEach((review, index) => {
            const date = new Date(review.date).toLocaleDateString();
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            
            const reviewElement = `
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-info">
                            <h3 class="review-name">${review.name}</h3>
                            <p class="review-email">${review.email}</p>
                            <p class="review-date">${date}</p>
                        </div>
                    </div>
                    <div class="star-rating">${stars}</div>
                    <p class="review-text">${review.review}</p>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            reviewsList.innerHTML += reviewElement;
        });

        addDeleteListeners();
    }

    function addDeleteListeners() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteReview(index);
            });
        });
    }

    function deleteReview(index) {
        if (confirm('Are you sure you want to delete this review?')) {
            let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
            reviews.splice(index, 1);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            loadReviews();
        }
    }

    // Initial load of reviews
    loadReviews();
}

// Gallery Management
function initGalleryManagement() {
    const galleryGrid = document.querySelector('.admin-gallery');
    const addImageForm = document.querySelector('.add-image-form');
    
    function loadGallery() {
        const galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
        galleryGrid.innerHTML = '';
        
        galleryItems.forEach((item, index) => {
            const galleryItem = `
                <div class="gallery-item" data-category="${item.category}">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="gallery-item-overlay">
                        <h3>${item.title}</h3>
                        <p>Category: ${item.category}</p>
                        <button class="delete-gallery-btn" data-index="${index}">Delete</button>
                    </div>
                </div>
            `;
            galleryGrid.innerHTML += galleryItem;
        });

        addGalleryDeleteListeners();
    }

    function addGalleryDeleteListeners() {
        document.querySelectorAll('.delete-gallery-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteGalleryItem(index);
            });
        });
    }

    function handleImageUpload(e) {
        e.preventDefault();
        
        const file = this.image.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const newItem = {
                category: addImageForm.category.value,
                title: addImageForm.title.value,
                image: e.target.result
            };

            const galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
            galleryItems.unshift(newItem);
            localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
            
            loadGallery();
            addImageForm.reset();
        };
        
        reader.readAsDataURL(file);
    }

    function deleteGalleryItem(index) {
        if (confirm('Are you sure you want to delete this image?')) {
            const galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
            galleryItems.splice(index, 1);
            localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
            loadGallery();
        }
    }

    // Add event listeners
    if (addImageForm) {
        addImageForm.addEventListener('submit', handleImageUpload);
    }

    // Initial load
    if (galleryGrid) {
        loadGallery();
    }
}