// Function to get the user's current location and display it on an embedded Google Map
function showLocation() {
  // Get references to the map iframe and coordinates text container
  const iframe = document.getElementById("map-frame");
  const coordsText = document.getElementById("coordinates");

  // Check if the browser supports geolocation
  if (navigator.geolocation) {
    // Request the user's current position
    navigator.geolocation.getCurrentPosition(
      // Success callback: runs if location is retrieved successfully
      (position) => {
        const lat = position.coords.latitude;   // Get latitude
        const lon = position.coords.longitude;  // Get longitude

        // Set the iframe's source to embed a Google Map centered on user's location
        iframe.src = `https://www.google.com/maps?q=${lat},${lon}&hl=en&z=14&output=embed`;

        // Display the user's coordinates in readable format
        coordsText.innerText = `Your current location: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`;
      },
      // Error callback: runs if user denies location access or there's an error
      () => {
        coordsText.innerText = "Location access denied.";
      }
    );
  } else {
    // Geolocation is not supported by this browser
    coordsText.innerText = "Geolocation not supported by your browser.";
  }
}
