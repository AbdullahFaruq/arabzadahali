"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  const s = slides[cur] ?? slides[0];

  return (
    <div className="relative w-full h-[92vh] min-h-[600px] overflow-hidden bg-stone-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === cur ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div key={cur} className="max-w-2xl">
            <span className={`animate-fade-up inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full bg-gradient-to-r ${s.accent} text-white mb-6 shadow-lg`}>
              {s.tag}
            </span>
            <h1 className="animate-fade-up delay-100 text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 whitespace-pre-line">
              {s.title}
            </h1>
            <p className="animate-fade-up delay-200 text-lg text-stone-300 mb-10 max-w-lg leading-relaxed">{s.sub}</p>
            <div className="animate-fade-up delay-300 flex flex-wrap gap-4">
              <Link href={s.href} className={`inline-flex items-center gap-2 bg-gradient-to-r ${s.accent} text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300`}>
                {s.cta} →
              </Link>
              <Link href="/shop" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300">
                View All Rugs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-8 right-8 z-20 hidden md:flex items-center gap-3">
        <span className="text-4xl font-black text-white/20">{String(cur + 1).padStart(2, "0")}</span>
        <div className="w-px h-8 bg-white/20" />
        <span className="text-sm text-white/40">{String(slides.length).padStart(2, "0")}</span>
      </div>

      <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-200 text-xl">‹</button>
      <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-200 text-xl">›</button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} className={`rounded-full transition-all duration-300 ${i === cur ? "w-8 h-2 bg-amber-500" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`} />
        ))}
      </div>

      {!paused && (
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/10 z-20">
          <div key={cur} className="h-full bg-amber-500/70 animate-progress" />
        </div>
      )}
    </div>
  );
}
