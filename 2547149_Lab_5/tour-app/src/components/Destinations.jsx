import { useState } from "react";
import Modal from "./Modal";

const DestinationCard = ({ place, description, image, onClick }) => (
  <div className="bg-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
    <img src={image} alt={place} className="w-full h-56 object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-semibold">{place}</h3>
      <p className="text-zinc-400">{description}</p>
      <button
        onClick={onClick}
        className="mt-4 text-blue-400 hover:underline"
      >
        More Info
      </button>
    </div>
  </div>
);

export default function Destinations() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const spots = [
    {
        place: 'Bali, Indonesia',
        description: 'Tropical beaches, rice terraces & spiritual vibes.',
        image: 'https://images.unsplash.com/photo-1559305289-4c31700ba9cb?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.1.0',
        details: 'Bali offers a perfect blend of spiritual calm and tropical adventure — from Ubud’s peaceful rice fields to the lively Kuta beach nightlife.',
    },
    {
        place: 'Swiss Alps',
        description: 'Snowy peaks, charming villages, and luxury.',
        image: 'https://images.unsplash.com/photo-1507039359328-5605ad5443f9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0',
        details: 'Explore the snow-covered peaks, sip hot chocolate in cozy chalets, and enjoy world-class ski resorts like Zermatt and St. Moritz.',
    },
    {
        place: 'Kyoto, Japan',
        description: 'Temples, cherry blossoms, and serene traditions.',
        image: 'https://images.unsplash.com/photo-1581536763020-d2d7cfdd4df6?q=80&w=2531&auto=format&fit=crop&ixlib=rb-4.1.0',
        details: 'Kyoto is Japan’s cultural heart — where ancient temples, zen gardens, and cherry blossoms create an unforgettable experience.',
    },
    {
        place: 'Santorini, Greece',
        description: 'Blue domes, white cliffs, and Aegean sunsets.',
        image: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        details: 'Famous for its dramatic views and romantic sunsets, Santorini is a dream escape for couples and photographers alike.',
    },
    {
        place: 'Banff, Canada',
        description: 'Turquoise lakes, wild trails, and alpine air.',
        image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        details: 'Banff National Park is a wonderland of glacial lakes, pine forests, and towering peaks — perfect for hikers and nature lovers.',
    },
    {
        place: 'Cape Town, South Africa',
        description: 'Table Mountain views, beaches, and vineyards.',
        image: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        details: 'From the summit of Table Mountain to the penguins at Boulders Beach, Cape Town is packed with adventure and natural beauty.',
    },
    {
        place: 'Petra, Jordan',
        description: 'Ancient city carved in rose-red stone.',
        image: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        details: 'A UNESCO World Heritage site, Petra’s rock-cut architecture and rich history make it one of the New 7 Wonders of the World.',
    },
    {
        place: 'Queenstown, New Zealand',
        description: 'Adventure capital with stunning lake scenery.',
        image: 'https://images.unsplash.com/photo-1591860462446-5a579886f56b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        details: 'Whether you’re bungee jumping or cruising Lake Wakatipu, Queenstown offers a thrilling mix of adrenaline and tranquility.',
    },
    ];


  const openModal = (spot) => {
    setSelected(spot);
    setOpen(true);
  };

  return (
    <section className="px-6 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Top Destinations</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {spots.map((spot, idx) => (
          <DestinationCard
            key={idx}
            {...spot}
            onClick={() => openModal(spot)}
          />
        ))}
      </div>

      {selected && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title={selected.place}
          image={selected.image}
        >
          <p>{selected.details}</p>
        </Modal>
      )}
    </section>
  );
}
