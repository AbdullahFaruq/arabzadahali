"use client";

import { useEffect, useState } from "react";
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
              alt=""
              className="h-[360px] w-full object-cover md:h-[520px]"
            />
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
    </div>
  );
}
