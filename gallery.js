document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Sample gallery items (replace with your actual images)
    // Replace the galleryItems constant with this
    const galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
    function renderGallery(filter = 'all') {
        galleryGrid.innerHTML = '';
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.category === filter) {
                const galleryItem = `
                    <div class="gallery-item" data-category="${item.category}">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="gallery-item-overlay">
                            <h3>${item.title}</h3>
                        </div>
                    </div>
                `;
                galleryGrid.innerHTML += galleryItem;
            }
        });
    }

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderGallery(this.getAttribute('data-filter'));
        });
    });

    // Initial render
    renderGallery();
});