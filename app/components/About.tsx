import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="bg-[#0a0a0a] py-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — Image */}
        <div className="relative">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/images/logo-circle.png"
              alt="Culinary Harmony Team"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
          </div>
          {/* Gold accent box */}
          <div className="absolute -bottom-6 -right-6 bg-[#d4a017] p-6 w-40 text-center hidden lg:block">
            <span className="font-display text-4xl font-light text-[#0a0a0a] block">5+</span>
            <span className="text-[0.65rem] tracking-[0.15em] uppercase text-[#0a0a0a]/70 block mt-1">Years of Excellence</span>
          </div>
        </div>

        {/* Right — Content */}
        <div>
          <span className="text-[#d4a017] text-xs tracking-[0.25em] uppercase block mb-4">Our Story</span>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-[#fafaf8] leading-tight mb-6">
            Crafting <em className="italic text-[#d4a017]">Culinary</em><br />
            Harmony for<br />
            Every Table
          </h2>
          <p className="text-[#fafaf8]/60 text-base leading-relaxed mb-4">
            Born in the warm heart of Africa, Culinary Harmony was built on one belief:
            that extraordinary food transforms ordinary moments into lifelong memories.
          </p>
          <p className="text-[#fafaf8]/60 text-base leading-relaxed mb-8">
            We combine traditional Malawian flavours with refined culinary techniques
            to serve celebrations that deserve nothing less than perfection. Based in
            Blantyre, we travel throughout Malawi — bringing our kitchen, our passion,
            and our artistry wherever your celebration takes place.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-4">
            {[
              { title: 'Professional Kitchen Team', desc: 'Our chefs travel with full equipment — no compromise on quality regardless of location.' },
              { title: 'Transparent Pricing', desc: 'Customised packages for every budget — view pricing online and book with ease.' },
              { title: 'Country-Wide Coverage', desc: 'From Blantyre to Lilongwe, Mzuzu to Mangochi — we travel every corner of Malawi.' },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 items-start border-l-2 border-[#d4a017] pl-4">
                <div>
                  <p className="text-[#fafaf8] text-sm font-medium mb-1">{f.title}</p>
                  <p className="text-[#fafaf8]/50 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}