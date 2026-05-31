'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', occasion: '', date: '', guests: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-[#111] py-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#d4a017] text-xs tracking-[0.25em] uppercase block mb-3">Get In Touch</span>
          <h2 className="font-display text-4xl lg:text-6xl font-light text-[#fafaf8]">
            Ready to Create Something <em className="italic text-[#d4a017]">Beautiful?</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — Contact Info */}
          <div id="book">
            <h3 className="font-display text-2xl font-light text-[#fafaf8] mb-8">Contact Details</h3>
            {[
              { label: 'Email', value: 'lawsonphiri28@gmail.com', href: 'mailto:lawsonphiri28@gmail.com' },
              { label: 'Phone / WhatsApp', value: '0999 743 181', href: 'tel:+265999743181' },
              { label: 'Location', value: 'Blantyre, Malawi', href: '#' },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 items-start mb-6 pb-6 border-b border-[#fafaf8]/10">
                <div>
                  <p className="text-[#d4a017] text-xs tracking-[0.15em] uppercase mb-1">{item.label}</p>
                  <Link href={item.href} className="text-[#fafaf8] text-base hover:text-[#d4a017] transition-colors">
                    {item.value}
                  </Link>
                </div>
              </div>
            ))}

            {/* Pricing preview */}
            <div className="bg-[#0a0a0a] p-6 mt-4">
              <p className="text-[#d4a017] text-xs tracking-[0.2em] uppercase mb-4">Starting Prices</p>
              {[
                { service: 'Weddings', price: 'From MK 150,000' },
                { service: 'Bridal Showers', price: 'From MK 80,000' },
                { service: 'Birthday Parties', price: 'From MK 60,000' },
                { service: 'Private Home Dining', price: 'From MK 50,000' },
              ].map((p) => (
                <div key={p.service} className="flex justify-between items-center py-2 border-b border-[#fafaf8]/5 last:border-0">
                  <span className="text-[#fafaf8]/70 text-sm">{p.service}</span>
                  <span className="text-[#d4a017] text-sm font-medium">{p.price}</span>
                </div>
              ))}
              <p className="text-[#fafaf8]/30 text-xs mt-3">* Final price depends on guest count and location</p>
            </div>
          </div>

          {/* Right — Booking Form */}
          <div>
            <h3 className="font-display text-2xl font-light text-[#fafaf8] mb-8">Book Your Event</h3>
            {submitted ? (
              <div className="bg-[#d4a017]/10 border border-[#d4a017]/30 p-8 text-center">
                <p className="text-[#d4a017] font-display text-2xl mb-2">Thank You!</p>
                <p className="text-[#fafaf8]/60 text-sm">We've received your booking request and will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', placeholder: '0999 000 000' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-[#fafaf8]/50 text-xs tracking-[0.15em] uppercase block mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      value={form[field.name as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#fafaf8]/10 text-[#fafaf8] px-4 py-3 text-sm focus:border-[#d4a017] focus:outline-none transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-[#fafaf8]/50 text-xs tracking-[0.15em] uppercase block mb-2">Occasion Type</label>
                  <select
                    required
                    value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#fafaf8]/10 text-[#fafaf8] px-4 py-3 text-sm focus:border-[#d4a017] focus:outline-none transition-colors"
                  >
                    <option value="">Select occasion</option>
                    <option>Wedding</option>
                    <option>Bridal Shower</option>
                    <option>Birthday Party</option>
                    <option>Private Home Dining</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#fafaf8]/50 text-xs tracking-[0.15em] uppercase block mb-2">Event Date</label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#fafaf8]/10 text-[#fafaf8] px-4 py-3 text-sm focus:border-[#d4a017] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[#fafaf8]/50 text-xs tracking-[0.15em] uppercase block mb-2">No. of Guests</label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      required
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#fafaf8]/10 text-[#fafaf8] px-4 py-3 text-sm focus:border-[#d4a017] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#fafaf8]/50 text-xs tracking-[0.15em] uppercase block mb-2">Additional Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us more about your event..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#fafaf8]/10 text-[#fafaf8] px-4 py-3 text-sm focus:border-[#d4a017] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#d4a017] text-[#0a0a0a] py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#e8c04a] transition-colors mt-2"
                >
                  Submit Booking Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}