export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-zinc-400 hover:text-white text-xl">×</button>
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <div className="text-zinc-300">{children}</div>
      </div>
    </div>
  );
}
