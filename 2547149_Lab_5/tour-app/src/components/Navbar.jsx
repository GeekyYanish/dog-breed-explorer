import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-zinc-950 shadow-md">
      <h1 className="text-xl font-semibold tracking-tight">TourAtEase</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>
        <Link to="/destinations" className="hover:text-blue-400 transition">Destinations</Link>
        <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
      </div>
    </nav>
  );
}
