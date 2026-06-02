import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#d4a017]/10 py-12 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/images/logo-circle.png" alt="Logo" width={48} height={48} className="rounded-full border border-[#d4a017]/30" />
              <div>
                <p className="font-display text-xl font-light text-[#fafaf8]">Culinary <span className="text-[#d4a017]">Harmony</span></p>
                <p className="text-[#fafaf8]/30 text-xs italic font-display mt-0.5">"Where Flavour Meets Every Occasion"</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="https://www.facebook.com/share/18FQofeLV5/" target="_blank" rel="noopener noreferrer" className="border border-[#1877F2]/30 text-[#1877F2] px-4 py-2 text-xs uppercase hover:bg-[#1877F2]/20 transition-colors">Facebook</a>
              <a href="https://tiktok.com/@lawson.company.tv" target="_blank" rel="noopener noreferrer" className="border border-[#fafaf8]/20 text-[#fafaf8] px-4 py-2 text-xs uppercase hover:border-[#d4a017] hover:text-[#d4a017] transition-colors">TikTok</a>
            </div>
          </div>
          <div className="flex flex-wrap gap-8 text-xs tracking-[0.15em] uppercase">
            {['Services', 'Gallery', 'About', 'Contact'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-[#fafaf8]/50 hover:text-[#d4a017] transition-colors">{item}</Link>
            ))}
          </div>
          <div className="text-sm text-[#fafaf8]/40 flex flex-col gap-2">
            <a href="mailto:lawsonphiri28@gmail.com" className="hover:text-[#d4a017] transition-colors">lawsonphiri28@gmail.com</a>
            <a href="tel:+265999743181" className="hover:text-[#d4a017] transition-colors">0999 743 181</a>
            <p>Blantyre, Malawi</p>
          </div>
        </div>
        <div className="border-t border-[#fafaf8]/5 pt-6 text-center text-xs text-[#fafaf8]/20">
          © 2026 Culinary Harmony · Blantyre, Malawi · All rights reserved
        </div>
      </div>
    </footer>
  );
}
