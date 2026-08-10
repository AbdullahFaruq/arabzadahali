import Link from "next/link";

const stats = [
  { value: "27+", label: "Years of craftsmanship" },
  { value: "12k", label: "Rugs curated" },
  { value: "4.9/5", label: "Average client rating" },
  { value: "30 days", label: "Easy returns" },
];

const values = [
  {
    title: "Authentic artistry",
    text: "Each rug is selected from trusted artisan communities and verified for origin, material, and handcrafted quality.",
    icon: "🧵",
  },
  {
    title: "Thoughtful sourcing",
    text: "We work directly with weavers, cooperatives, and family-run workshops to support ethical production and lasting relationships.",
    icon: "🌍",
  },
  {
    title: "Design-led curation",
    text: "Our collection balances heritage patterns with modern interiors so every rug feels personal, elevated, and timeless.",
    icon: "🏡",
  },
];

const storyPoints = [
  "Founded in 1998 with a deep appreciation for handmade textiles and global craft traditions.",
  "Curated collections inspired by Persian, Turkish, Moroccan, and contemporary design movements.",
  "Committed to transparency, fair sourcing, and elevated customer experience from first message to final delivery.",
];

export default function AboutPage() {
  return (
    <main className="bg-stone-950 text-white min-h-screen">
      <section className="relative overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-300">About us</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <p className="text-amber-500 text-xs font-bold tracking-[0.28em] uppercase mb-4">Our story</p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight">Handmade beauty, chosen with intention.</h1>
              <p className="mt-6 text-stone-300 text-lg leading-relaxed max-w-xl">
                Arabzada brings together artisan-made rugs, elevated design, and a personal shopping experience for homes that deserve character and warmth.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/shop" className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-500 text-white font-black px-7 py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
                  Explore the collection
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center border border-stone-700 hover:border-amber-500/50 text-stone-200 hover:text-amber-400 font-semibold px-7 py-3.5 rounded-2xl transition-all">
                  Contact us
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl shadow-black/30">
              <img
                src="https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80"
                alt="Handmade rug collection"
                className="w-full h-[520px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <p className="text-stone-400 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8">
            <p className="text-amber-500 text-xs font-bold tracking-[0.28em] uppercase">Why we exist</p>
            <h2 className="text-3xl font-black text-white mt-4">A home should feel lived in, layered, and personal.</h2>
            <p className="text-stone-400 mt-5 leading-relaxed">
              We believe rugs are more than decoration. They define rooms, anchor conversations, and reflect the people who live within them.
            </p>
            <div className="mt-8 space-y-4">
              {storyPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 text-stone-300">
                  <span className="w-2.5 h-2.5 mt-2 rounded-full bg-amber-500 shrink-0" />
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((value) => (
              <div key={value.title} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 hover:border-amber-500/40 transition-colors">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-black text-white">{value.title}</h3>
                <p className="text-stone-400 mt-3 leading-relaxed text-sm">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-900/60 border-y border-stone-800 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-amber-500 text-xs font-bold tracking-[0.28em] uppercase">Our promise</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-4">Beautiful rugs, honest sourcing, and a service experience you can trust.</h2>
          <p className="mt-5 text-stone-400 text-lg leading-relaxed max-w-3xl mx-auto">
            From first enquiry to final delivery, we aim to make the process thoughtful, transparent, and easy — so your space feels as special as the piece you choose.
          </p>
        </div>
      </section>
    </main>
  );
}
