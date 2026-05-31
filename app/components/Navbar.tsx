'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[#0a0a0a]/95 backdrop-blur-md py-2 shadow-[0_2px_20px_rgba(212,160,23,0.1)]'
        : 'bg-gradient-to-b from-black/60 to-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-2 border-[#d4a017] scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <Image
              src="/images/logo-circle.png"
              alt="Culinary Harmony Logo"
              width={52}
              height={52}
              className="rounded-full border-2 border-[#d4a017]/50 group-hover:border-[#d4a017] transition-all duration-300 shadow-[0_0_15px_rgba(212,160,23,0.2)]"
            />
          </div>
            <div className="flex flex-col leading-tight">
            <span className="font-display text-2xl font-light tracking-[0.08em] text-[#fafaf8]">
              Culinary
            </span>
            <span className="font-display text-2xl font-semibold italic tracking-[0.06em] text-[#d4a017] -mt-1">
              Harmony
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {['Services', 'Gallery', 'About', 'Contact'].map((item) => (
            <li key={item}>
              <Link
                href={`#${item.toLowerCase()}`}
                className="relative text-xs font-medium tracking-[0.15em] uppercase text-[#fafaf8]/70 hover:text-[#d4a017] transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#d4a017] hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="#book"
              className="relative bg-[#d4a017] text-[#0a0a0a] px-6 py-2.5 text-xs font-bold tracking-[0.15em] uppercase overflow-hidden group/btn inline-block"
            >
              <span className="relative z-10">Book Now</span>
              <span className="absolute inset-0 bg-[#e8c04a] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[1.5px] bg-[#fafaf8] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-6 h-[1.5px] bg-[#fafaf8] transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : ''}`} />
          <span className={`block w-6 h-[1.5px] bg-[#fafaf8] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-[#0a0a0a]/98 border-t border-[#d4a017]/20 px-6 py-6 flex flex-col gap-5">
          {['Services', 'Gallery', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm tracking-[0.15em] uppercase text-[#fafaf8]/70 hover:text-[#d4a017] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Link
            href="#book"
            className="bg-[#d4a017] text-[#0a0a0a] px-5 py-3 text-xs font-bold tracking-[0.15em] uppercase text-center hover:bg-[#e8c04a] transition-colors mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}