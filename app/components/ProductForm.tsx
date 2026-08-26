"use client";
import { useState } from "react";
import { Product } from "../types";
import { categories, colors, sizes } from "../data/products";
import { formatSize, parseSize } from "../lib/size";
import ImageUploader from "./ImageUploader";

type FormData = Omit<Product, "id">;

const empty: FormData = {
  name: "", price: 0, originalPrice: undefined, rating: 5, reviews: 0,
  category: "Persian", color: "Red", size: "2.4x3m", material: "",
  image: "", images: [""], badge: "", description: "", features: [""], inStock: true,
};

export default function ProductForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save Product",
}: {
  initial?: Product;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}) {
  const [form, setForm] = useState<FormData>(
    initial ? { ...initial } : empty
  );

  // Size is stored as a single "16x8m" string, edited as two metre values.
  const initialDims = parseSize(form.size);
  const [width, setWidth] = useState(initialDims ? String(initialDims.width) : "");
  const [length, setLength] = useState(initialDims ? String(initialDims.length) : "");

  const set = (key: keyof FormData, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setDimension = (which: "width" | "length", raw: string) => {
    const next = { width, length, [which]: raw };
    if (which === "width") setWidth(raw);
    else setLength(raw);

    const w = parseFloat(next.width.replace(",", "."));
    const l = parseFloat(next.length.replace(",", "."));
    set("size", w > 0 && l > 0 ? formatSize(w, l) : "");
  };

  const setImage = (i: number, val: string) => {
    const imgs = [...form.images];
    imgs[i] = val;
    set("images", imgs);
    if (i === 0) set("image", val);
  };

  const addImage = () => set("images", [...form.images, ""]);
  const removeImage = (i: number) => {
    const imgs = form.images.filter((_, idx) => idx !== i);
    set("images", imgs.length ? imgs : [""]);
    set("image", imgs[0] || "");
  };

  const setFeature = (i: number, val: string) => {
    const f = [...form.features];
    f[i] = val;
    set("features", f);
  };
  const addFeature = () => set("features", [...form.features, ""]);
  const removeFeature = (i: number) => set("features", form.features.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      features: form.features.filter(Boolean),
      images: form.images.filter(Boolean),
      image: form.images.filter(Boolean)[0] || form.image,
    });
  };

  const inputCls = "w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 px-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors";
  const labelCls = "block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Product Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Persian Royal Medallion" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Material *</label>
          <input required value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="e.g. Hand-knotted Wool" className={inputCls} />
        </div>
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>Price (₺) *</label>
          <input required type="number" min={0} value={form.price || ""} onChange={(e) => set("price", e.target.value)} placeholder="0" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Original Price (₺)</label>
          <input type="number" min={0} value={form.originalPrice || ""} onChange={(e) => set("originalPrice", e.target.value || undefined)} placeholder="Optional" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Rating</label>
          <input type="number" min={1} max={5} step={0.1} value={form.rating} onChange={(e) => set("rating", parseFloat(e.target.value))} className={inputCls} />
        </div>
      </div>

      {/* Category / Color / Size */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>Category *</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls + " cursor-pointer"}>
            {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Color *</label>
          <select value={form.color} onChange={(e) => set("color", e.target.value)} className={inputCls + " cursor-pointer"}>
            {colors.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Size (metres) *</label>
          <div className="flex items-center gap-2">
            <input
              required
              type="number"
              min={0.1}
              step={0.1}
              value={width}
              onChange={(e) => setDimension("width", e.target.value)}
              placeholder="16"
              className={inputCls}
            />
            <span className="text-stone-400 font-bold">×</span>
            <input
              required
              type="number"
              min={0.1}
              step={0.1}
              value={length}
              onChange={(e) => setDimension("length", e.target.value)}
              placeholder="8"
              className={inputCls}
            />
            <span className="text-stone-400 font-bold">m</span>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Saved as <span className="text-amber-400 font-semibold">{form.size || "16x8m"}</span>
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  const dims = parseSize(s);
                  if (!dims) return;
                  setWidth(String(dims.width));
                  setLength(String(dims.length));
                  set("size", s);
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${form.size === s ? "bg-amber-600 text-white" : "bg-stone-800 text-stone-400 hover:text-white"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Badge / Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Badge</label>
          <select value={form.badge || ""} onChange={(e) => set("badge", e.target.value || undefined)} className={inputCls + " cursor-pointer"}>
            <option value="">None</option>
            {["Best Seller", "New", "Premium", "Rare", "Eco", "Trending"].map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => set("inStock", !form.inStock)} className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${form.inStock ? "bg-amber-600" : "bg-stone-700"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.inStock ? "translate-x-7" : "translate-x-1"}`} />
            </div>
            <span className="text-sm font-semibold text-white">{form.inStock ? "In Stock" : "Out of Stock"}</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description *</label>
        <textarea required value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Describe the product..." className={inputCls + " resize-none"} />
      </div>

      {/* Images */}
      <div>
        <label className={labelCls}>Product Images</label>
        <div className="space-y-3">
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1">
                <ImageUploader
                  value={img}
                  onChange={(val) => setImage(i, val)}
                  placeholder={`Image ${i + 1} URL (https://...)`}
                />
              </div>
              {form.images.length > 1 && (
                <button type="button" onClick={() => removeImage(i)} className="mt-1 w-11 h-11 flex items-center justify-center bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors shrink-0">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addImage} className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition-colors font-medium">
            + Add another image
          </button>
        </div>
      </div>

      {/* Features */}
      <div>
        <label className={labelCls}>Features</label>
        <div className="space-y-2">
          {form.features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input value={f} onChange={(e) => setFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} className={inputCls} />
              {form.features.length > 1 && (
                <button type="button" onClick={() => removeFeature(i)} className="w-11 h-11 flex items-center justify-center bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors shrink-0">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addFeature} className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition-colors font-medium">
            + Add feature
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="px-8 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 font-semibold py-4 rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
