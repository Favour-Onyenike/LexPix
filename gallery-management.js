document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.admin-gallery');
    const addImageForm = document.querySelector('.add-image-form');
    const logoutBtn = document.querySelector('.logout-btn');

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    function loadGallery() {
        const galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
        galleryGrid.innerHTML = '';
        
        if (galleryItems.length === 0) {
            galleryGrid.innerHTML = '<p>No images in gallery.</p>';
            return;
        }

        galleryItems.forEach((item, index) => {
            const galleryItem = `
                <div class="gallery-item" data-category="${item.category}">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="gallery-item-overlay">
                        <h3>${item.title}</h3>
                        <p>Category: ${item.category}</p>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </div>
                </div>
            `;
            galleryGrid.innerHTML += galleryItem;
        });

        // Add delete functionality
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteGalleryItem(index);
            });
        });
    }

    function deleteGalleryItem(index) {
        if (confirm('Are you sure you want to delete this image?')) {
            const galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
            galleryItems.splice(index, 1);
            localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
            loadGallery();
        }
    }

    // Handle image upload
    addImageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const file = this.image.files[0];
        if (!file) {
            alert('Please select an image');
            return;
        }

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
    });

    // Initial load
    loadGallery();
});