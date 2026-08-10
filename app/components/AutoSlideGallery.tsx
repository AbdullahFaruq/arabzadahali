"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    title: "Persian Royal Masterpieces",
    subtitle: "Hand-knotted heritage rugs with centuries of story",
    image:
      "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Moroccan Berber Luxury",
    subtitle: "Texture, warmth, and artisan character for modern interiors",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Modern Silk Blend Rugs",
    subtitle: "Minimalist elegance with a rich handmade finish",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Vintage Overdyed Collection",
    subtitle: "Boho charm and timeless craftsmanship in every detail",
    image:
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Custom Turkish Weaves",
    subtitle: "Soft, tactile, statement pieces that shape the room",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function AutoSlideGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-stone-800 bg-stone-900/60 shadow-2xl shadow-black/20">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.title} className="min-w-full relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-[360px] w-full object-cover md:h-[520px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent" />
            <div className="absolute inset-0 flex items-center px-6 md:px-12">
              <div className="max-w-xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Curated collection</p>
                <h3 className="text-3xl font-black text-white md:text-5xl">{slide.title}</h3>
                <p className="mt-3 max-w-md text-sm text-stone-200 md:text-base">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? "w-8 bg-amber-400" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
