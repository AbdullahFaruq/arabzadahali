"use client";
import { useState, useEffect, useCallback } from "react";
import { useStore } from "../context/StoreContext";

export default function HeroSlider() {
  const { slides } = useStore();
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCur((c) => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCur((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => { setCur(0); }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[92vh] min-h-[600px] overflow-hidden bg-stone-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === cur ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Arrows — side on desktop, hidden on mobile */}
      <button onClick={prev} className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-200 text-xl">‹</button>
      <button onClick={next} className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-200 text-xl">›</button>

      {/* Bottom controls — dots + arrows on mobile */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button onClick={prev} className="md:hidden w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all text-lg">‹</button>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} className={`rounded-full transition-all duration-300 ${i === cur ? "w-8 h-2 bg-amber-500" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`} />
        ))}
        <button onClick={next} className="md:hidden w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all text-lg">›</button>
      </div>

      {!paused && (
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/10 z-20">
          <div key={cur} className="h-full bg-amber-500/70 animate-progress" />
        </div>
      )}
    </div>
  );
}
