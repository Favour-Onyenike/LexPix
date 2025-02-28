document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.admin-gallery');
    const addImageForm = document.querySelector('.add-image-form');
    const logoutBtn = document.querySelector('.logout-btn');

    // Logout functionality with browser compatibility check
    logoutBtn.addEventListener('click', () => {
        if (window.location && window.location.href) {
            window.location.href = 'index.html';
        } else {
            document.location.href = 'index.html';
        }
    });

    function loadGallery() {
        let galleryItems = [];
        try {
            galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
        } catch (error) {
            console.error('Error loading gallery:', error);
            galleryItems = [];
        }
        
        galleryGrid.innerHTML = '';
        
        if (galleryItems.length === 0) {
            galleryGrid.innerHTML = '<p>No images in gallery.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        galleryItems.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.setAttribute('data-category', item.category);
            
            div.innerHTML = `
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="gallery-item-overlay">
                    <h3>${item.title}</h3>
                    <p>Category: ${item.category}</p>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            fragment.appendChild(div);
        });

        galleryGrid.appendChild(fragment);

        // Add delete functionality with error handling
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const index = this.getAttribute('data-index');
                deleteGalleryItem(index);
            });
        });
    }

    function deleteGalleryItem(index) {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                const galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
                galleryItems.splice(index, 1);
                localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
                loadGallery();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Failed to delete the image. Please try again.');
            }
        }
    }

    // Handle image upload with enhanced error handling
    addImageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const file = this.image.files[0];
        if (!file) {
            alert('Please select an image');
            return;
        }

        // Check file size and type
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('Image size should be less than 5MB');
            return;
        }

        if (!file.type.match('image.*')) {
            alert('Please select a valid image file');
            return;
        }

        const reader = new FileReader();
        
        reader.onerror = function() {
            alert('Error reading file. Please try again.');
        };

        reader.onload = function(e) {
            try {
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
            } catch (error) {
                console.error('Error saving image:', error);
                alert('Failed to save the image. Please try again.');
            }
        };
        
        reader.readAsDataURL(file);
    });

    // Initial load with error handling
    try {
        loadGallery();
    } catch (error) {
        console.error('Error during initial load:', error);
        galleryGrid.innerHTML = '<p>Error loading gallery. Please refresh the page.</p>';
    }
});