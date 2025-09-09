import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper component to render an icon with a label
const InfoPill = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
    <span className="text-gray-500 dark:text-gray-400">{icon}</span>
    <div>
      <span className="font-semibold text-gray-800 dark:text-gray-200">{label}:</span>
      <span className="ml-1 text-gray-600 dark:text-gray-300">{value}</span>
    </div>
  </div>
);

// Child Component: BreedCard
// This component receives a single breed's data via props and displays it.
// It demonstrates prop destructuring: ({ breed })
const BreedCard = ({ breed }) => {
  // Destructure the necessary attributes from the breed object
  const { name, description, life, male_weight, hypoallergenic } = breed.attributes;

  // Format the data for display
  const lifespan = `${life.min} - ${life.max} years`;
  const weight = `${male_weight.min} - ${male_weight.max} kg`;
  const isHypoallergenic = hypoallergenic ? 'Yes' : 'No';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 overflow-y-auto text-sm">{description}</p>
        
        <div className="flex flex-wrap gap-3">
            <InfoPill icon=<i class="fa-solid fa-heart text-red-500"></i> label="Lifespan" value={lifespan} />
            <InfoPill icon=<i class="fa-solid fa-weight-scale text-blue-500"></i> label="Weight" value={weight} />
            <InfoPill icon=<i class="fa-solid fa-hand-dots text-green-700"></i> label="Hypoallergenic" value={isHypoallergenic} />
        </div>
      </div>
    </div>
  );
};


// Parent Component: App
function App() {
  // State to store the list of dog breeds
  const [breeds, setBreeds] = useState([]);
  // State to handle loading status
  const [loading, setLoading] = useState(true);
  // State to handle any potential errors
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        setLoading(true);
        // Use axios to get data from the API
        const response = await axios.get('https://dogapi.dog/api/v2/breeds');
        // The breed data is nested under response.data.data
        setBreeds(response.data.data);
        setError(null);
      } catch (err) {
        // Handle potential errors during the API call
        setError('Failed to fetch dog breeds. Please try again later.');
        console.error("API Fetch Error:", err);
      } finally {
        // Set loading to false once the request is complete (either success or failure)
        setLoading(false);
      }
    };

    fetchDogBreeds();
  }, []); // The empty dependency array ensures this effect runs only once

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-2">
            <i class="fa-solid fa-dog"></i> Dog Breed Explorer
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Discover information about your favorite dog breeds.
          </p>
        </header>

        <main>
          {/* Display a loading message while data is being fetched */}
          {loading && (
             <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
                <p className="ml-4 text-xl">Loading Breeds...</p>
            </div>
          )}

          {/* Display an error message if the API call fails */}
          {error && (
            <div className="text-center p-6 bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-300 rounded-lg shadow-md">
              <p className="text-xl font-semibold">Oops! Something went wrong.</p>
              <p>{error}</p>
            </div>
          )}

          {/* Display the breed cards once the data is fetched successfully */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Map over the breeds array and pass each breed's data to the BreedCard component */}
              {breeds.map(breed => (
                <BreedCard key={breed.id} breed={breed} />
              ))}
            </div>
          )}
        </main>
         <footer className="text-center mt-12 py-4">
            <p className="text-gray-500 dark:text-gray-400">
              Powered by the <a href="https://dogapi.dog/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">Dog API</a>
            </p>
        </footer>
      </div>
    </div>
  );
}

export default App;