'use client';

import { useState } from 'react';
import Image from 'next/image';

const photos = [
  { src: '/images/food-1.png', label: 'Beef Stew & Vegetables' },
  { src: '/images/food-2.png', label: 'Fried Chicken & Salad' },
  { src: '/images/food-3.png', label: 'Beef Stew Top View' },
  { src: '/images/food-4.png', label: 'Meat Stew & Greens' },
  { src: '/images/food-5.png', label: 'Mixed Grill Plate' },
  { src: '/images/food-6.png', label: 'Chicken Curry' },
  { src: '/images/food-7.png', label: 'Bruschetta Toast' },
  { src: '/images/food-8.png', label: 'Crispy Chicken Strips' },
  { src: '/images/food-9.png', label: 'Sauced Chicken' },
  { src: '/images/food-10.png', label: 'Baked Goods & Cookies' },
];

export default function Gallery() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section id="gallery" className="bg-[#f2f0ea] py-24 px-6 lg:px-16">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <span className="text-[#d4a017] text-xs tracking-[0.25em] uppercase block mb-3">
          Our Work
        </span>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <h2 className="font-display text-4xl lg:text-6xl font-light text-[#0a0a0a]">
            A Taste of <em className="italic text-[#d4a017]">What We Create</em>
          </h2>
          <p className="text-[#0a0a0a]/50 text-sm max-w-xs">
            Click any photo to view it in full screen
          </p>
        </div>
      </div>

      {/* Masonry-style Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            onClick={() => setSelected(photo.src)}
            className={`relative overflow-hidden cursor-pointer group
              ${i === 0 || i === 5 ? 'col-span-2 row-span-2' : ''}
            `}
            style={{ aspectRatio: i === 0 || i === 5 ? '1/1' : '4/3' }}
          >
            <Image
              src={photo.src}
              alt={photo.label}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/50 transition-all duration-300 flex items-end">
              <p className="text-[#fafaf8] text-sm font-light tracking-wide px-4 pb-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {photo.label}
              </p>
            </div>
            {/* Gold corner accent */}
            <div className="absolute top-0 left-0 w-0 h-0 border-t-[3px] border-l-[3px] border-[#d4a017] group-hover:w-8 group-hover:h-8 transition-all duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 right-6 text-[#fafaf8] text-3xl hover:text-[#d4a017] transition-colors"
            onClick={() => setSelected(null)}
          >
            ✕
          </button>
          <div className="relative w-full max-w-4xl max-h-[85vh] aspect-square">
            <Image
              src={selected}
              alt="Food photo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

    </section>
  );
}