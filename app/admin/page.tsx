'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';

const ADMIN_PASSWORD = 'culinaryharmony2026';

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  occasion: string;
  event_date: string;
  guests: number;
  message: string;
  created_at: string;
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [wrongPassword, setWrongPassword] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'gallery'>('bookings');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setWrongPassword(false);
    } else {
      setWrongPassword(true);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchBookings();
      fetchGallery();
    }
  }, [loggedIn]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setBookings(data);
  };

  const fetchGallery = async () => {
    const { data } = await supabase.storage.from('gallery').list('', { limit: 100 });
    if (data) {
      const urls = data.map((file) => {
        const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(file.name);
        return urlData.publicUrl;
      });
      setGalleryImages(urls);
    }
  };

 const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  setUploading(true);
  setUploadSuccess('');

  let successCount = 0;
  for (const file of Array.from(files)) {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('gallery').upload(fileName, file);
    if (!error) successCount++;
  }

  if (successCount === files.length) {
    setUploadSuccess(`${successCount} photo(s) uploaded successfully!`);
  } else {
    setUploadSuccess(`${successCount} of ${files.length} photos uploaded.`);
  }
  fetchGallery();
  setUploading(false);
};

  const handleDelete = async (url: string) => {
    const fileName = url.split('/').pop();
    if (!fileName) return;
    await supabase.storage.from('gallery').remove([fileName]);
    fetchGallery();
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image src="/images/logo-circle.png" alt="Logo" width={80} height={80} className="rounded-full border-2 border-[#d4a017] mx-auto mb-4" />
            <h1 className="font-display text-3xl font-light text-[#fafaf8]">
              Culinary <span className="text-[#d4a017]">Harmony</span>
            </h1>
            <p className="text-[#fafaf8]/40 text-sm mt-1">Admin Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-[#fafaf8]/50 text-xs tracking-[0.15em] uppercase block mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-[#fafaf8]/10 text-[#fafaf8] px-4 py-3 text-sm focus:border-[#d4a017] focus:outline-none"
              />
            </div>
            {wrongPassword && (
              <p className="text-red-400 text-sm">Wrong password. Try again.</p>
            )}
            <button
              type="submit"
              className="bg-[#d4a017] text-[#0a0a0a] py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#e8c04a] transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafaf8]">

      {/* Header */}
      <div className="bg-[#111] border-b border-[#d4a017]/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/images/logo-circle.png" alt="Logo" width={40} height={40} className="rounded-full border border-[#d4a017]/40" />
          <div>
            <p className="font-display text-lg text-[#fafaf8]">Culinary <span className="text-[#d4a017]">Harmony</span></p>
            <p className="text-[#fafaf8]/30 text-xs">Admin Dashboard</p>
          </div>
        </div>
        <button
          onClick={() => setLoggedIn(false)}
          className="text-[#fafaf8]/40 text-xs uppercase tracking-widest hover:text-[#d4a017] transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#fafaf8]/10 px-6">
        <div className="flex gap-8">
          {(['bookings', 'gallery'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-xs tracking-[0.15em] uppercase border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#d4a017] text-[#d4a017]'
                  : 'border-transparent text-[#fafaf8]/40 hover:text-[#fafaf8]'
              }`}
            >
              {tab === 'bookings' ? `📋 Bookings (${bookings.length})` : '🖼️ Gallery'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="font-display text-2xl font-light mb-6">
              All Booking Requests
            </h2>
            {bookings.length === 0 ? (
              <p className="text-[#fafaf8]/40">No bookings yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
               {bookings.map((booking) => (
  <div key={booking.id} className="bg-[#111] border border-[#fafaf8]/10 p-6 hover:border-[#d4a017]/30 transition-colors">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div>
        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Name</p>
        <p className="text-[#fafaf8] font-medium">{booking.name}</p>
      </div>
      <div>
        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Occasion</p>
        <p className="text-[#fafaf8]">{booking.occasion}</p>
      </div>
      <div>
        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Event Date</p>
        <p className="text-[#fafaf8]">{new Date(booking.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
      </div>
      <div>
        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Guests</p>
        <p className="text-[#fafaf8]">{booking.guests} people</p>
      </div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#fafaf8]/5">
      <div>
        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Email</p>
        <a href={`mailto:${booking.email}`} className="text-[#fafaf8]/70 text-sm hover:text-[#d4a017]">{booking.email}</a>
      </div>
      <div>
        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Phone</p>
        <a href={`tel:${booking.phone}`} className="text-[#fafaf8]/70 text-sm hover:text-[#d4a017]">{booking.phone}</a>
      </div>
      <div>
        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Date Received</p>
        <p className="text-[#fafaf8]/70 text-sm">{new Date(booking.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
      </div>
      <div>
        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Time</p>
        <p className="text-[#fafaf8]/70 text-sm">{new Date(booking.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
    {booking.message && (
      <div className="mt-4 pt-4 border-t border-[#fafaf8]/5">
        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Message</p>
        <p className="text-[#fafaf8]/60 text-sm">{booking.message}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-light">Gallery Photos</h2>
              <label className="bg-[#d4a017] text-[#0a0a0a] px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase cursor-pointer hover:bg-[#e8c04a] transition-colors">
                {uploading ? 'Uploading...' : '+ Upload Photo'}
               <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {uploadSuccess && (
              <p className={`mb-4 text-sm ${uploadSuccess.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
                {uploadSuccess}
              </p>
            )}
            {galleryImages.length === 0 ? (
              <p className="text-[#fafaf8]/40">No photos uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((url) => (
                  <div key={url} className="relative group aspect-square overflow-hidden">
                    <Image src={url} alt="Gallery" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(url)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-3 py-1 text-xs uppercase tracking-widest transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}