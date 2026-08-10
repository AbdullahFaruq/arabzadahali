"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "../context/StoreContext";

export default function AutoSlideGallery() {
  const { discoverSlides } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!discoverSlides.length) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % discoverSlides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [discoverSlides.length]);

  if (!discoverSlides.length) return null;

  const activeSlide = discoverSlides[activeIndex];

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-stone-800 bg-stone-900/60 shadow-2xl shadow-black/20">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {discoverSlides.map((slide) => (
          <div key={slide.id} className="min-w-full relative">
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
                {slide.href && (
                  <Link href={slide.href} className="mt-6 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl transition-all">
                    Explore →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {discoverSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? "w-8 bg-amber-400" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {activeSlide && (
        <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-stone-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm md:right-8 md:top-8">
          {String(activeIndex + 1).padStart(2, "0")}
        </div>
      )}
    </div>
  );
}
