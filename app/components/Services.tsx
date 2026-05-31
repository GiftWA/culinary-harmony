import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    num: '01',
    title: 'Weddings',
    desc: 'From intimate garden ceremonies to grand banquets — menus as unique as your love story. Full service, presentation, and staffing included.',
    img: '/images/event-wedding.jpg',
  },
  {
    num: '02',
    title: 'Bridal Showers',
    desc: 'Celebrate the bride-to-be with beautifully presented canapés and curated bridal menus. Elegant, joyful, and unforgettable.',
    img: '/images/event-bridal.jpg',
  },
  {
    num: '03',
    title: 'Birthday Parties',
    desc: 'Every birthday deserves a feast. From children\'s parties to milestone celebrations — menus that delight every guest.',
    img: '/images/event-birthday.jpg',
  },
  {
    num: '04',
    title: 'Private Home Dining',
    desc: 'Transform your home into a restaurant. We set up, cook, serve, and clean — you simply enjoy an extraordinary experience.',
    img: '/images/event-private.jpg',
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-[#0a0a0a] py-24 px-6 lg:px-16">

      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[#d4a017] text-xs tracking-[0.25em] uppercase block mb-3">
          What We Do
        </span>
        <h2 className="font-display text-4xl lg:text-6xl font-light text-[#fafaf8]">
          Our <em className="italic text-[#d4a017]">Signature</em> Services
        </h2>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {services.map((service) => (
          <div key={service.num} className="group relative h-[480px] overflow-hidden cursor-pointer">

            {/* Background Image */}
            <Image
              src={service.img}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-all duration-300" />

            {/* Gold bottom border on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#d4a017] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <span className="font-display text-5xl font-light text-[#d4a017]/20 group-hover:text-[#d4a017]/40 transition-colors block mb-2">
                {service.num}
              </span>
              <h3 className="font-display text-2xl font-light text-[#fafaf8] mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-[#fafaf8]/60 leading-relaxed mb-4 max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-500">
                {service.desc}
              </p>
              <Link
                href="#book"
                className="inline-flex items-center gap-2 text-[#d4a017] text-xs tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Book This <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Travel Banner with Blantyre city */}
      <div className="relative mt-16 max-w-7xl mx-auto overflow-hidden">
        <Image
          src="/images/blantyre-city.jpg"
          alt="Blantyre City"
          width={1400}
          height={400}
          className="w-full h-[260px] object-cover"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/75" />
        <div className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between gap-6 px-8 lg:px-16">
          <div>
            <p className="text-[#d4a017] text-xs tracking-[0.2em] uppercase mb-2">
              Nationwide Coverage
            </p>
            <h3 className="font-display text-2xl lg:text-4xl font-light text-[#fafaf8]">
              We Come to You —<br />
              <em className="italic text-[#d4a017]">Anywhere in Malawi</em>
            </h3>
            <p className="text-[#fafaf8]/60 text-sm mt-2">
              Based in Blantyre, we travel country-wide with full equipment and staff.
            </p>
          </div>
          <Link
            href="#book"
            className="border-2 border-[#d4a017] text-[#d4a017] px-8 py-4 text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#d4a017] hover:text-[#0a0a0a] transition-colors whitespace-nowrap"
          >
            Get a Quote →
          </Link>
        </div>
      </div>

    </section>
  );
}