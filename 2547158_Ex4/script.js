const form = document.getElementById('feedbackForm');
const feedbackList = document.getElementById('feedbackList');
const feedbackSection = document.getElementById('feedbackSection');
const welcomeMsg = document.getElementById('welcomeBackMsg');
const comments = document.getElementById('comments');
const charCount = document.getElementById('charCount');
const clearBtn = document.getElementById('clearBtn');

// Show welcome message if returning in session
if (sessionStorage.getItem('visited')) {
    welcomeMsg.style.display = 'block';
} else {
    sessionStorage.setItem('visited', 'true');
}

// Load and Display Feedbacks
function loadFeedbacks() {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbackList.innerHTML = ''; // Clear existing feedback display

    // If no feedbacks, hide the section
    if (feedbacks.length === 0) {
        feedbackSection.classList.add('hidden');
        return;
    } else {
        feedbackSection.classList.remove('hidden');
    }

    // Loop through each feedback object and render as a card
    feedbacks.forEach((fb) => {
        const card = document.createElement('div');
        card.className =
            'bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700';

        // Populate card with feedback content
        card.innerHTML = `
    <h4 class="text-lg font-semibold text-yellow-400">${fb.name}</h4>
    <p class="text-sm text-gray-300">${fb.email} | ${fb.department}</p>
    <p class="text-sm mt-1">Rating: <strong class="text-red-400">${
        fb.rating
    }</strong></p>
    <br/>
    <hr/>
    <p class="mt-2 text-gray-200">
        ${
            fb.comments
                ? fb.comments
                : '<i class="text-gray-400">No comments</i>'
        }
    </p>
`;
        // Append card to feedback list
        feedbackList.appendChild(card);
    });
}

// Form Submission Handler
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form action

     // Create feedback object from form data
    const feedback = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        rating: form.querySelector("input[name='rating']:checked").value,
        comments: comments.value,
    };

    // Retrieve existing feedbacks or initialize empty array
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push(feedback); // Add new feedback
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks)); // Save updated feedback list to local storage

    form.reset();  // Reset form and UI
    charCount.textContent = '0 characters';
    loadFeedbacks(); // Refresh feedback display
    alert('✅ Feedback submitted!');
});

// Real-time Character Counter
comments.addEventListener('input', () => {
    charCount.textContent = `${comments.value.length} characters`;
});

// Clear All Feedbacks Button
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all feedbacks?')) {
        localStorage.removeItem('feedbacks');
        loadFeedbacks();
    }
});

// Load feedbacks when page loads
window.onload = loadFeedbacks;
