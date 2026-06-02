'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

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

type GalleryFile = {
  name: string;
  url: string;
  category: string;
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [wrongPassword, setWrongPassword] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'gallery'>('bookings');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [galleryFiles, setGalleryFiles] = useState<GalleryFile[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteUrl, setPendingDeleteUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [categories, setCategories] = useState<string[]>(['All', 'Uncategorized']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>('Uncategorized');

  useEffect(() => {
    const savedCategories = localStorage.getItem('galleryCategories');
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      setCategories(['All', ...parsed, 'Uncategorized']);
    }
  }, []);

  const saveCategory = (categoryName: string) => {
    const existingCategories = categories.filter(c => c !== 'All' && c !== 'Uncategorized');
    if (!existingCategories.includes(categoryName)) {
      const newCategories = [...existingCategories, categoryName];
      localStorage.setItem('galleryCategories', JSON.stringify(newCategories));
      setCategories(['All', ...newCategories, 'Uncategorized']);
    }
  };

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
    const { data, error } = await supabase.storage.from('gallery').list('', { limit: 1000 });
    if (error) {
      console.error('Error fetching gallery:', error);
      return;
    }
    if (data) {
      const savedCategories = localStorage.getItem('galleryCategories');
      let knownCategories: string[] = savedCategories ? JSON.parse(savedCategories) : [];
      
      const filesWithUrls = data.map((file) => {
        let category = 'Uncategorized';
        const fileName = file.name;
        const underscoreIndex = fileName.indexOf('_');
        if (underscoreIndex > 0) {
          const potentialCategory = fileName.substring(0, underscoreIndex);
          const formattedCategory = potentialCategory.charAt(0).toUpperCase() + potentialCategory.slice(1);
          
          if (knownCategories.includes(formattedCategory)) {
            category = formattedCategory;
          } else if (['Wedding', 'Birthday', 'Corporate', 'Events', 'Bridal', 'Party', 'Shower'].includes(formattedCategory)) {
            category = formattedCategory;
            if (!knownCategories.includes(formattedCategory)) {
              knownCategories.push(formattedCategory);
              localStorage.setItem('galleryCategories', JSON.stringify(knownCategories));
            }
          }
        }
        
        return {
          name: file.name,
          url: supabase.storage.from('gallery').getPublicUrl(file.name).data.publicUrl,
          category: category
        };
      });
      
      setGalleryFiles(filesWithUrls);
      const uniqueCategories = new Set(filesWithUrls.map(f => f.category));
      const sortedCategories = ['All', ...Array.from(uniqueCategories).filter(c => c !== 'Uncategorized').sort(), 'Uncategorized'];
      setCategories(sortedCategories);
    }
  };

  // Delete booking function
  const deleteBooking = async (id: string) => {
    if (confirm('Delete this booking request?')) {
      setDeletingBooking(id);
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) {
        showToast('Delete failed: ' + error.message, 'error');
      } else {
        showToast('Booking deleted successfully!', 'success');
        fetchBookings();
      }
      setDeletingBooking(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(Array.from(files));
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setUploadSuccess('');

    let successCount = 0;
    
    for (const file of files) {
      let categoryForUpload = uploadCategory;
      if (categoryForUpload === 'All') {
        categoryForUpload = 'Uncategorized';
      }
      
      const categoryName = categoryForUpload !== 'Uncategorized' 
        ? categoryForUpload.toLowerCase().replace(/\s/g, '_')
        : '';
      
      const fileName = categoryName 
        ? `${categoryName}_${Date.now()}-${file.name}`
        : `${Date.now()}-${file.name}`;
      
      const { error } = await supabase.storage.from('gallery').upload(fileName, file);
      if (!error) successCount++;
    }

    if (successCount === files.length) {
      setUploadSuccess(`${successCount} photo(s) uploaded successfully!`);
      showToast(`${successCount} photo(s) uploaded successfully!`, 'success');
    } else {
      setUploadSuccess(`${successCount} of ${files.length} photos uploaded.`);
      showToast(`${successCount} of ${files.length} photos uploaded.`, 'error');
    }
    await fetchGallery();
    setUploading(false);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteClick = (url: string) => {
    setPendingDeleteUrl(url);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteUrl) return;
    
    setShowDeleteModal(false);
    setDeleting(pendingDeleteUrl);
    
    try {
      const fileToDelete = galleryFiles.find(file => file.url === pendingDeleteUrl);
      
      if (!fileToDelete) {
        showToast('Could not find the file to delete', 'error');
        setDeleting(null);
        setPendingDeleteUrl(null);
        return;
      }
      
      const { error: deleteError } = await supabase.storage
        .from('gallery')
        .remove([fileToDelete.name]);
      
      if (deleteError) {
        showToast('Delete failed: ' + deleteError.message, 'error');
      } else {
        setGalleryFiles(prev => prev.filter(file => file.url !== pendingDeleteUrl));
        showToast('Photo deleted successfully!', 'success');
        await fetchGallery();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setDeleting(null);
      setPendingDeleteUrl(null);
    }
  };

  const toggleImageSelection = (url: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(url)) {
      newSelection.delete(url);
    } else {
      newSelection.add(url);
    }
    setSelectedImages(newSelection);
  };

  const selectAll = () => {
    const filteredFiles = getFilteredFiles();
    if (selectedImages.size === filteredFiles.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(filteredFiles.map(f => f.url)));
    }
  };

  const confirmBulkDelete = async () => {
    setShowBulkDeleteModal(false);
    const filesToDelete = galleryFiles.filter(file => selectedImages.has(file.url));
    
    for (const file of filesToDelete) {
      await supabase.storage.from('gallery').remove([file.name]);
    }
    
    setSelectedImages(new Set());
    await fetchGallery();
    showToast(`${filesToDelete.length} photo(s) deleted successfully!`, 'success');
  };

  const getFilteredFiles = () => {
    if (selectedCategory === 'All') {
      return galleryFiles;
    }
    return galleryFiles.filter(file => file.category === selectedCategory);
  };

  const openPreview = (url: string) => {
    setPreviewImage(url);
  };

  const createNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      saveCategory(newCategory);
      setSelectedCategory(newCategory);
      setUploadCategory(newCategory);
      setShowCategoryInput(false);
      showToast(`Category "${newCategory}" created! Now upload photos to this category.`, 'success');
      setNewCategory('');
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/images/logo-circle.png" alt="Logo" width={80} height={80} className="rounded-full border-2 border-[#d4a017] mx-auto mb-4" />
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

  const filteredFiles = getFilteredFiles();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafaf8]">

      {/* Header */}
      <div className="bg-[#111] border-b border-[#d4a017]/20 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/logo-circle.png" alt="Logo" width={40} height={40} className="rounded-full border border-[#d4a017]/40" />
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
      <div className="border-b border-[#fafaf8]/10 px-4 sm:px-6">
        <div className="flex gap-4 sm:gap-8">
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

      <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">

        {/* Bookings Tab - WITH DELETE BUTTON */}
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
                  <div key={booking.id} className="bg-[#111] border border-[#fafaf8]/10 p-4 sm:p-6 hover:border-[#d4a017]/30 transition-colors">
                    {/* First row - 2 columns on mobile, 4 on desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                      <div>
                        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Name</p>
                        <p className="text-[#fafaf8] font-medium text-sm sm:text-base break-words">{booking.name}</p>
                      </div>
                      <div>
                        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Occasion</p>
                        <p className="text-[#fafaf8] text-sm sm:text-base break-words">{booking.occasion}</p>
                      </div>
                      <div>
                        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Event Date</p>
                        <p className="text-[#fafaf8] text-sm sm:text-base">{new Date(booking.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Guests</p>
                        <p className="text-[#fafaf8] text-sm sm:text-base">{booking.guests} people</p>
                      </div>
                    </div>
                    
                    {/* Second row - stacked on mobile, side by side on desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-[#fafaf8]/5">
                      <div>
                        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Email</p>
                        <a href={`mailto:${booking.email}`} className="text-[#fafaf8]/70 text-sm hover:text-[#d4a017] break-words block">{booking.email}</a>
                      </div>
                      <div>
                        <p className="text-[#d4a017] text-xs uppercase tracking-widest mb-1">Phone</p>
                        <a href={`tel:${booking.phone}`} className="text-[#fafaf8]/70 text-sm hover:text-[#d4a017] break-words block">{booking.phone}</a>
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
                        <p className="text-[#fafaf8]/60 text-sm break-words">{booking.message}</p>
                      </div>
                    )}
                    
                    {/* DELETE BOOKING BUTTON - Added here */}
                    <div className="mt-4 pt-4 border-t border-[#fafaf8]/5 flex justify-end">
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        disabled={deletingBooking === booking.id}
                        className={`text-red-400 hover:text-red-300 text-xs uppercase tracking-widest transition-colors ${
                          deletingBooking === booking.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {deletingBooking === booking.id ? 'Deleting...' : 'Delete Booking'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="font-display text-2xl font-light">Gallery Photos</h2>
              <div className="flex gap-3 w-full sm:w-auto">
                {selectedImages.size > 0 && (
                  <button
                    onClick={() => setShowBulkDeleteModal(true)}
                    className="bg-red-500 text-white px-4 sm:px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-red-600 transition-colors flex-1 sm:flex-none"
                  >
                    Delete Selected ({selectedImages.size})
                  </button>
                )}
                <button
                  onClick={selectAll}
                  className="border border-[#d4a017] text-[#d4a017] px-4 sm:px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#d4a017]/10 transition-colors flex-1 sm:flex-none"
                >
                  {selectedImages.size === filteredFiles.length && filteredFiles.length > 0 ? 'Deselect All' : 'Select All'}
                </button>
                <label className={`bg-[#d4a017] text-[#0a0a0a] px-4 sm:px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase cursor-pointer hover:bg-[#e8c04a] transition-colors text-center flex-1 sm:flex-none ${isDragging ? 'ring-2 ring-white' : ''}`}>
                  {uploading ? 'Uploading...' : '+ Upload Photo'}
                  <input type="file" accept="image/*" multiple onChange={handleFileInput} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>

            {/* Category Selection for Upload */}
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <span className="text-xs text-[#fafaf8]/60 uppercase tracking-widest">Upload to:</span>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="bg-[#111] border border-[#d4a017]/30 text-[#fafaf8] px-4 py-2 text-sm focus:outline-none"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Category Filter - Scrollable on mobile */}
            <div className="mb-6 flex gap-2 flex-wrap overflow-x-auto pb-2">
              {categories.map(cat => {
                const count = cat === 'All' 
                  ? galleryFiles.length 
                  : galleryFiles.filter(f => f.category === cat).length;
                
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-3 sm:px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#d4a017] text-[#0a0a0a]'
                        : 'border border-[#fafaf8]/20 text-[#fafaf8]/60 hover:border-[#d4a017] hover:text-[#d4a017]'
                    }`}
                  >
                    {cat} {cat !== 'All' && `(${count})`}
                  </button>
                );
              })}
              <button
                onClick={() => setShowCategoryInput(!showCategoryInput)}
                className="whitespace-nowrap px-3 sm:px-4 py-2 text-xs uppercase tracking-widest border border-dashed border-[#fafaf8]/20 text-[#fafaf8]/60 hover:border-[#d4a017] hover:text-[#d4a017]"
              >
                + New Category
              </button>
            </div>

            {/* New Category Input */}
            {showCategoryInput && (
              <div className="mb-6 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter category name (e.g., Bridal Shower)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-[#111] border border-[#fafaf8]/10 text-[#fafaf8] px-4 py-2 text-sm flex-1"
                />
                <button
                  onClick={createNewCategory}
                  className="bg-[#d4a017] text-[#0a0a0a] px-6 py-2 text-xs font-bold uppercase"
                >
                  Create
                </button>
              </div>
            )}

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mb-6 border-2 border-dashed transition-colors p-4 sm:p-8 text-center ${
                isDragging ? 'border-[#d4a017] bg-[#d4a017]/10' : 'border-[#fafaf8]/20'
              }`}
            >
              <p className="text-[#fafaf8]/60 text-xs sm:text-sm">
                {isDragging ? 'Drop your photos here!' : `📸 Drag & drop photos here (will be saved to "${uploadCategory}" category)`}
              </p>
            </div>

            {uploadSuccess && (
              <p className={`mb-4 text-sm ${uploadSuccess.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
                {uploadSuccess}
              </p>
            )}
            
            {filteredFiles.length === 0 ? (
              <p className="text-[#fafaf8]/40">No photos in {selectedCategory === 'All' ? 'gallery' : selectedCategory.toLowerCase()} yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredFiles.map((file) => (
                  <div key={file.url} className="relative group aspect-square overflow-hidden rounded-lg bg-[#111]">
                    <div 
                      className="w-full h-full cursor-pointer"
                      onClick={() => openPreview(file.url)}
                    >
                      <img 
                        src={file.url} 
                        alt="Gallery" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    
                    <div 
                      className="absolute top-2 left-2 z-10 bg-black/50 rounded p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedImages.has(file.url)}
                        onChange={() => toggleImageSelection(file.url)}
                        className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-[#d4a017]"
                      />
                    </div>
                    
                    {file.category && file.category !== 'Uncategorized' && (
                      <div className="absolute top-2 right-2 bg-black/70 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] uppercase tracking-wider rounded">
                        {file.category}
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/0 sm:group-hover:bg-black/60 transition-all flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(file.url);
                        }}
                        disabled={deleting === file.url}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-widest transition-all ${
                          deleting === file.url ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                        } text-white rounded sm:opacity-0 sm:group-hover:opacity-100 opacity-100`}
                      >
                        {deleting === file.url ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 bg-black/50 text-white w-10 h-10 rounded-full hover:bg-red-500 transition-colors text-xl flex items-center justify-center"
            >
              ✕
            </button>
            <p className="absolute -bottom-8 left-0 text-[#fafaf8]/60 text-sm">
              Click anywhere to close
            </p>
          </div>
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-[#d4a017]/30 p-6 sm:p-8 max-w-md w-full mx-4 rounded-lg">
            <h3 className="font-display text-xl mb-4 text-[#fafaf8]">Delete Photo?</h3>
            <p className="text-[#fafaf8]/70 mb-6">This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 sm:px-6 py-2 border border-[#fafaf8]/20 text-[#fafaf8] hover:bg-[#fafaf8]/10 transition-colors text-sm uppercase tracking-widest rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 sm:px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors text-sm uppercase tracking-widest rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-[#d4a017]/30 p-6 sm:p-8 max-w-md w-full mx-4 rounded-lg">
            <h3 className="font-display text-xl mb-4 text-[#fafaf8]">
              Delete {selectedImages.size} {selectedImages.size === 1 ? 'Photo' : 'Photos'}?
            </h3>
            <p className="text-[#fafaf8]/70 mb-6">This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 sm:px-6 py-2 border border-[#fafaf8]/20 text-[#fafaf8] hover:bg-[#fafaf8]/10 transition-colors text-sm uppercase tracking-widest rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                className="px-4 sm:px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors text-sm uppercase tracking-widest rounded"
              >
                Delete {selectedImages.size === 1 ? 'Photo' : 'All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-5">
          <div className={`px-6 py-3 shadow-lg rounded ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white text-sm`}>
            {toast.message}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}