// Add at the beginning of your file
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const sideMenu = document.querySelector('.side-menu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.add('active');
        sideMenu.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        sideMenu.classList.remove('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            sideMenu.classList.remove('active');
        }
    });
    
    // Event form functionality
    const addEventForm = document.querySelector('.add-event-form');
    const imageInput = document.getElementById('eventImages');
    const previewContainer = document.querySelector('.image-preview-container');
    let selectedFiles = [];

    function loadEvents() {
        const eventsList = document.querySelector('.events-list');
        const events = JSON.parse(localStorage.getItem('events')) || [];
        
        eventsList.innerHTML = '';
        
        if (events.length === 0) {
            eventsList.innerHTML = '<p>No events added yet.</p>';
            return;
        }

        events.forEach((event, index) => {
            const eventElement = `
                <div class="event-item">
                    <img src="${event.images[0]}" alt="${event.name}">
                    <div class="event-details">
                        <h3>${event.name}</h3>
                        <p class="event-date">${new Date(event.date).toLocaleDateString()}</p>
                        <p>${event.description}</p>
                        <button class="delete-btn" data-index="${index}">Delete Event</button>
                    </div>
                </div>
            `;
            eventsList.innerHTML += eventElement;
        });

        // Add delete functionality
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteEvent(index);
            });
        });
    }

    function deleteEvent(index) {
        if (confirm('Are you sure you want to delete this event?')) {
            const events = JSON.parse(localStorage.getItem('events')) || [];
            events.splice(index, 1);
            localStorage.setItem('events', JSON.stringify(events));
            loadEvents();
        }
    }

    imageInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        previewContainer.innerHTML = '';
        selectedFiles = [];

        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = `
                    <div class="image-preview" data-index="${index}">
                        <img src="${e.target.result}" alt="Preview">
                        <button type="button" class="remove-preview" data-index="${index}">×</button>
                    </div>
                `;
                previewContainer.insertAdjacentHTML('beforeend', preview);
                selectedFiles.push(file);
            };
            reader.readAsDataURL(file);
        });
    });

    previewContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-preview')) {
            const index = parseInt(e.target.dataset.index);
            e.target.parentElement.remove();
            selectedFiles = selectedFiles.filter((_, i) => i !== index);
        }
    });

    addEventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedFiles.length === 0) {
            alert('Please select at least one image');
            return;
        }

        const processImages = selectedFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(processImages).then(images => {
            const newEvent = {
                name: addEventForm.eventName.value,
                date: addEventForm.eventDate.value,
                description: addEventForm.eventDescription.value,
                images: images
            };

            const events = JSON.parse(localStorage.getItem('events')) || [];
            events.unshift(newEvent);
            localStorage.setItem('events', JSON.stringify(events));
            
            loadEvents();
            addEventForm.reset();
            previewContainer.innerHTML = '';
            selectedFiles = [];
        });
    });

    // Initial load of events
    loadEvents();
});