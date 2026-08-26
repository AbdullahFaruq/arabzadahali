import Link from "next/link";
import { WHATSAPP_DISPLAY, whatsappChatUrl } from "../lib/whatsapp";

const EMAIL = "İstanbulrugs1@gmail.com";

const contactCards = [
  {
    icon: "📍",
    title: "Visit us",
    value: "Taşderek Çeşme Sokak, Orhan Gülüç Han No 16, Shop 101",
    accent: "text-amber-400",
  },
  {
    icon: "📞",
    title: "Call us",
    value: WHATSAPP_DISPLAY,
    accent: "text-emerald-400",
  },
  {
    icon: "✉️",
    title: "Email us",
    value: EMAIL,
    accent: "text-sky-400",
  },
  {
    icon: "🕒",
    title: "Hours",
    value: "Open 24/7",
    accent: "text-violet-400",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-stone-950 text-white min-h-screen">
      <section className="border-b border-stone-800 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),_transparent_40%)]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-300">Contact</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div>
              <p className="text-amber-500 text-xs font-bold tracking-[0.28em] uppercase mb-4">Get in touch</p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight">We’ll help you find the right rug for your home.</h1>
              <p className="mt-5 text-stone-300 text-lg leading-relaxed max-w-xl">
                Whether you need guidance on sizing, custom sourcing, or styling, our team is ready to help with thoughtful recommendations and a smooth buying experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={whatsappChatUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white font-black px-7 py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/30"
                >
                  WhatsApp us
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center justify-center border border-stone-700 hover:border-amber-500/50 text-stone-200 hover:text-amber-400 font-semibold px-7 py-3.5 rounded-2xl transition-all"
                >
                  Email us
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {contactCards.map((card) => (
                <div key={card.title} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 hover:border-amber-500/30 transition-colors">
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <p className="text-sm text-stone-400">{card.title}</p>
                  <p className={`mt-2 text-lg font-bold ${card.accent}`}>{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8">
            <p className="text-amber-500 text-xs font-bold tracking-[0.28em] uppercase mb-4">Need help choosing?</p>
            <h2 className="text-3xl font-black text-white">Tell us about your room</h2>
            <p className="text-stone-400 mt-4 leading-relaxed">
              Share your style, room size, and budget and we’ll suggest a few matching rugs from our handpicked collection.
            </p>

            <div className="mt-8 space-y-4 text-sm text-stone-300">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 mt-2 rounded-full bg-amber-500" />
                <p>Custom size recommendations</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 mt-2 rounded-full bg-amber-500" />
                <p>Styling advice for modern, vintage, and layered interiors</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 mt-2 rounded-full bg-amber-500" />
                <p>Support for bulk orders or interior styling projects</p>
              </div>
            </div>
          </div>

          <form className="bg-stone-900 border border-stone-800 rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">Name</label>
                <input placeholder="Your full name" className="w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-4 py-3 rounded-2xl outline-none focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">Email</label>
                <input placeholder="you@example.com" className="w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-4 py-3 rounded-2xl outline-none focus:border-amber-500 transition-colors" />
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">Subject</label>
              <input placeholder="How can we help?" className="w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-4 py-3 rounded-2xl outline-none focus:border-amber-500 transition-colors" />
            </div>

            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">Message</label>
              <textarea rows={6} placeholder="Tell us a bit about your space, style, and what you are looking for..." className="w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-4 py-3 rounded-2xl outline-none focus:border-amber-500 transition-colors resize-none" />
            </div>

            <button type="button" className="mt-6 w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
              Send message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
