"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  if (submitted) return (
    <p className="text-emerald-400 font-semibold text-sm">✓ You're subscribed! Welcome to the family.</p>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-5 py-3.5 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors"
      />
      <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30 whitespace-nowrap">
        Subscribe →
      </button>
    </form>
  );
}
