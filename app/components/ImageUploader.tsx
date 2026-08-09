"use client";
import { useRef } from "react";

export default function ImageUploader({
  value,
  onChange,
  placeholder = "https://...",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const inputCls =
    "w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors";

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={value.startsWith("data:") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={value.startsWith("data:") ? "📁 Local file selected" : placeholder}
          className={inputCls + " flex-1"}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="shrink-0 flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-amber-400 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {value && (
        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-700 bg-stone-800 group">
          <img
            src={value}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg transition-opacity"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
