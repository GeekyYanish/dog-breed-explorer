import { useState } from 'react';
import Modal from './Modal';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    reason: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const closeModal = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', message: '', reason: '' });
  };

  return (
    <section className="px-6 py-16 max-w-4xl mx-auto">
      <div className="bg-zinc-900/60 border border-zinc-800 shadow-xl rounded-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center mb-2">Get in Touch</h2>
        <p className="text-zinc-400 text-center mb-8">
          Have questions, suggestions, or just want to say hi? We'd love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-1 text-zinc-400">Your Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Appleseed"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-zinc-400">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-zinc-400">Reason for Contact</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a reason</option>
              <option value="booking">Booking Inquiry</option>
              <option value="feedback">Site Feedback</option>
              <option value="support">Support Request</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-zinc-400">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-lg"
          >
            Send Message
          </button>
        </form>
      </div>

      <Modal
        isOpen={submitted}
        onClose={closeModal}
        title="Message Sent"
        image="https://source.unsplash.com/800x400/?thankyou,nature"
      >
        <p className="text-zinc-200">
          Thank you, <strong>{formData.name}</strong>! Your <em>{formData.reason}</em> inquiry has been received.
          We’ll be in touch shortly.
        </p>
      </Modal>
    </section>
  );
}
