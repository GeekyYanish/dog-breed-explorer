const API_BASE = "http://localhost:3000";

// Load Flights
async function loadFlights() {
  const res = await fetch(`${API_BASE}/flights`);
  const data = await res.json();

  const table = document.getElementById("flightsTable");
  table.innerHTML = "";
  data.flights.forEach(f => {
    table.innerHTML += `
      <tr>
        <td class="p-2 border">${f.id}</td>
        <td class="p-2 border">${f.flight_number}</td>
        <td class="p-2 border">${f.destination}</td>
        <td class="p-2 border">${new Date(f.departure_time).toLocaleString()}</td>
        <td class="p-2 border">${f.seats}</td>
      </tr>
    `;
  });
}

// Add Flight
document.getElementById("addFlightForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const flight_number = document.getElementById("flight_number").value;
  const destination = document.getElementById("destination").value;
  const departure_time = document.getElementById("departure_time").value;
  const seats = parseInt(document.getElementById("seats").value);

  const res = await fetch(`${API_BASE}/flights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flight_number, destination, departure_time, seats })
  });

  const result = await res.json();
  alert(result.message || "Flight added");
  loadFlights();
});

// Book Flight
document.getElementById("bookFlightForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const flight_id = document.getElementById("flight_id").value;
  const passenger_id = document.getElementById("passenger_id").value;

  const res = await fetch(`${API_BASE}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flight_id, passenger_id })
  });

  const result = await res.json();
  alert(result.message || "Booking attempted");
});

// Upload File
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("document", document.getElementById("document").files[0]);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData
  });

  const text = await res.text();
  alert(text);
});
