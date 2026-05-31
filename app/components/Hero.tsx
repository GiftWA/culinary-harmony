import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

      {/* Left Side */}
      <div className="relative z-10 flex flex-col justify-center px-8 lg:px-16 pt-32 pb-16 bg-[#0a0a0a]">
        <p className="flex items-center gap-3 text-[#d4a017] text-xs tracking-[0.25em] uppercase mb-6">
          <span className="block w-8 h-[1px] bg-[#d4a017]"></span>
          Fine Catering · Blantyre, Malawi
        </p>

        <h1 className="font-display text-5xl lg:text-7xl font-light leading-[1.05] mb-6">
          Where <em className="text-[#d4a017] not-italic font-light">Flavour</em><br />
          Meets Every<br />
          <em className="text-[#d4a017] italic">Occasion</em>
        </h1>

        <p className="text-[#fafaf8]/60 text-base leading-relaxed max-w-md mb-10">
          We bring restaurant-quality cuisine to your most cherished celebrations —
          weddings, bridal showers, birthday parties, and private homes.
          Serving all of Malawi, from the heart of Blantyre.
        </p>

        <div className="flex flex-wrap gap-4 mb-16">
          <Link href="#book"
            className="bg-[#d4a017] text-[#0a0a0a] px-8 py-4 text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#e8c04a] transition-colors">
            Reserve Your Date
          </Link>
          <Link href="#services"
            className="border border-[#fafaf8]/30 text-[#fafaf8] px-8 py-4 text-xs font-medium tracking-[0.15em] uppercase hover:border-[#d4a017] hover:text-[#d4a017] transition-colors">
            Explore Services
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-10 pt-8 border-t border-[#fafaf8]/10">
          {[
            { num: '5+', label: 'Years of Craft' },
            { num: '200+', label: 'Events Catered' },
            { num: 'All', label: 'Malawi Covered' },
          ].map((stat) => (
            <div key={stat.label}>
              <span className="font-display text-3xl font-light text-[#d4a017] block">{stat.num}</span>
              <span className="text-[0.65rem] tracking-[0.18em] uppercase text-[#fafaf8]/40 mt-1 block">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side — Photo Grid */}
      <div className="relative hidden lg:grid grid-cols-2 grid-rows-2 gap-[3px]">
        {[
          { src: '/images/food-1.png', label: 'Beef Stew' },
          { src: '/images/food-2.png', label: 'Fried Chicken' },
          { src: '/images/food-6.png', label: 'Chicken Curry' },
          { src: '/images/food-9.png', label: 'Crispy Strips' },
        ].map((img) => (
          <div key={img.src} className="relative overflow-hidden">
            <Image
              src={img.src}
              alt={img.label}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}
        {/* Left gradient fade */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
      </div>

    </section>
  );
}