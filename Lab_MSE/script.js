document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Element References ---
    const coffeeContainer = document.getElementById('coffee-container');
    const searchInput = document.getElementById('searchInput');
    const sortDropdown = document.getElementById('sortDropdown');
    const feedbackForm = document.getElementById('feedbackForm');
    const greetingSection = document.getElementById('greeting-section');
    const greetingMessage = document.getElementById('greeting-message');
    const locationInfo = document.getElementById('location-info');

    let allCoffees = []; // To store all coffees fetched from the API
    let displayedCoffees = []; // To store coffees currently being displayed (for sorting)
    const API_URL = 'https://api.sampleapis.com/coffee/hot';

    // --- Functions ---

    //Fetches coffee data from the API and displays the first 8 items.
    function fetchCoffees() {
        fetch(API_URL)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(
                        'Network response was not ok. Status: ' +
                            response.status
                    );
                }
                return response.json();
            })
            .then(function (data) {
                allCoffees = data;
                // Initially display the first 8 items or all if less than 8
                displayedCoffees = allCoffees.slice(0, 8);
                renderCoffees(displayedCoffees);
            })
            .catch(function (error) {
                console.error('Could not fetch coffee data:', error);
                coffeeContainer.innerHTML =
                    '<p class="text-red-500 text-center col-span-full">Failed to load coffee menu. Please try again later.</p>';
            });
    }

    function renderCoffees(coffees) {
        coffeeContainer.innerHTML = '';

        if (coffees.length === 0) {
            coffeeContainer.innerHTML =
                '<p class="text-gray-500 text-center col-span-full">No coffee found matching your criteria.</p>';
            return;
        }

        coffees.forEach(function (coffee) {
            const coffeeCard = document.createElement('div');
            coffeeCard.className = 'coffee-card'; // Using custom class from style.css

            // Use innerHTML to build the card structure
            coffeeCard.innerHTML = `
                <img src="${coffee.image}" alt="${
                coffee.title
            }" class="w-full h-48 object-cover">
                <div class="card-content">
                    <h3 class="card-title">${coffee.title}</h3>
                    <p class="card-description">${coffee.description}</p>
                    <p class="card-ingredients">
                        <strong>Ingredients:</strong> ${coffee.ingredients.join(
                            ', '
                        )}
                    </p>
                </div>
            `;
            coffeeContainer.appendChild(coffeeCard);
        });
    }

    //Filters and displays coffees based on the search input
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
                const filteredCoffees = allCoffees.filter(function (coffee) {
            return coffee.title.toLowerCase().includes(searchTerm);
        });
        // Update the list with the first 8 search results
        displayedCoffees = filteredCoffees.slice(0, 8);
        sortAndRender(); // Apply current sort order and render
    }

    //Sorts the `displayedCoffees` array and then renders the result.
    function sortAndRender() {
        const sortOrder = sortDropdown.value;

        displayedCoffees.sort(function (a, b) {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            if (sortOrder === 'asc') {
                return titleA.localeCompare(titleB);
            } else {
                // 'desc'
                return titleB.localeCompare(titleA);
            }
        });

        renderCoffees(displayedCoffees);
    }

    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent the form from reloading the page

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const favoriteCoffee = document
            .getElementById('favoriteCoffee')
            .value.trim();

        // Simple Validation
        if (name === '' || email === '' || favoriteCoffee === '') {
            alert('Please fill in all fields.');
            return;
        }
        // Email regex validation
        const emailPattern = /^\S+@\S+\.\S+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Store in localStorage
        localStorage.setItem('userName', name);
        localStorage.setItem('favoriteCoffee', favoriteCoffee);

        alert('Thank you for your feedback!');
        feedbackForm.reset();
        displayGreeting();
    }

    //Checks localStorage for user data and displays a greeting if found
    function displayGreeting() {
        const userName = localStorage.getItem('userName');
        const favoriteCoffee = localStorage.getItem('favoriteCoffee');

        if (userName && favoriteCoffee) {
            greetingMessage.textContent = `Hello, ${userName}! You Love ${favoriteCoffee}. Welcome back!`;
            greetingSection.classList.remove('hidden');
        }
    }

    //Gets and displays the user's geolocation
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    locationInfo.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
                },
                function (error) {
                    locationInfo.textContent =
                        'Could not get location. Please allow access.';
                    console.error('Geolocation error:', error.message);
                }
            );
        } else {
            locationInfo.textContent =
                'Geolocation is not supported by your browser.';
        }
    }

    // --- Initializations and Event Listeners ---
    fetchCoffees();
    displayGreeting();
    getUserLocation();

    searchInput.addEventListener('input', handleSearch);
    sortDropdown.addEventListener('change', sortAndRender);
    feedbackForm.addEventListener('submit', handleFormSubmit);
});
