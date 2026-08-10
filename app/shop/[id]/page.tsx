"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/ProductCard";
import StarRating from "../../components/StarRating";
import { use } from "react";

const mockReviews = [
  { id: 1, name: "Sarah M.", rating: 5, date: "Dec 2024", comment: "Absolutely stunning rug. The colors are even more vibrant in person. Delivery was fast and packaging was excellent.", avatar: "SM" },
  { id: 2, name: "James K.", rating: 5, date: "Nov 2024", comment: "Worth every penny. The craftsmanship is incredible — you can feel the quality the moment you touch it.", avatar: "JK" },
  { id: 3, name: "Priya L.", rating: 4, date: "Oct 2024", comment: "Beautiful piece. Took a week to arrive but the wait was worth it. My living room looks completely transformed.", avatar: "PL" },
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart, toggleWishlist, isWishlisted, products } = useStore();
  const product = products.find((p) => p.id === Number(id));
  if (!product) notFound();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.size);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "features" | "reviews">("description");

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-stone-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-amber-400 transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-amber-400 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-stone-300 truncate max-w-48">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-stone-900 aspect-square">
              <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              {discount && <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">-{discount}%</span>}
              {!product.inStock && (
                <div className="absolute inset-0 bg-stone-950/70 flex items-center justify-center">
                  <span className="bg-stone-800 text-stone-300 font-bold px-6 py-3 rounded-2xl text-lg">Sold Out</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-amber-500" : "border-stone-800 hover:border-stone-600"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{product.category}</span>
                <h1 className="text-3xl font-black text-white mt-1 leading-tight">{product.name}</h1>
              </div>
              <button onClick={() => toggleWishlist(product.id)} className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${wishlisted ? "bg-rose-500 border-rose-500 text-white" : "border-stone-700 text-stone-400 hover:border-rose-500 hover:text-rose-400"}`}>
                <svg className="w-5 h-5" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm font-bold text-white">{product.rating}</span>
              <span className="text-sm text-stone-500">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-black text-white">{product.price.toLocaleString("tr-TR")}₺</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-stone-500 line-through">{product.originalPrice.toLocaleString("tr-TR")}₺</span>
                  <span className="bg-red-500/20 text-red-400 text-sm font-bold px-3 py-1 rounded-lg">Save {(product.originalPrice - product.price).toLocaleString("tr-TR")}₺</span>
                </>
              )}
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-stone-900 rounded-2xl border border-stone-800">
              {[
                { label: "Material", value: product.material },
                { label: "Size", value: product.size },
                { label: "Color", value: product.color },
                { label: "Category", value: product.category },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-xs text-stone-500 mb-0.5">{m.label}</p>
                  <p className="text-sm font-semibold text-white">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-white">Size: <span className="text-amber-400">{selectedSize}</span></p>
                <button className="text-xs text-amber-500 hover:text-amber-400 underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {["2.5x10", "4x6", "5x7", "5x8", "6x9", "8x10", "9x12", "10x14"].map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selectedSize === s ? "bg-amber-600 border-amber-600 text-white" : "border-stone-700 text-stone-400 hover:border-stone-500 hover:text-white"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-12 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-lg">−</button>
                <span className="w-12 text-center text-white font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-11 h-12 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-lg">+</button>
              </div>
              <button
                onClick={() => { for (let i = 0; i < qty; i++) addToCart(product, selectedSize); }}
                disabled={!product.inStock}
                className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30"
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>

            {/* Buy now */}
            {product.inStock && (
              <Link href="/cart" onClick={() => addToCart(product, selectedSize)} className="block w-full text-center bg-white text-stone-950 font-black py-3.5 rounded-xl hover:bg-stone-100 transition-colors mb-6">
                Buy Now
              </Link>
            )}

            {/* Trust */}
            <div className="flex flex-wrap gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">🚚 Free shipping over ₺500</span>
              <span className="flex items-center gap-1.5">↩️ 30-day returns</span>
              <span className="flex items-center gap-1.5">🔒 Secure checkout</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex gap-1 border-b border-stone-800 mb-8">
            {(["description", "features", "reviews"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-amber-500 text-amber-400" : "border-transparent text-stone-500 hover:text-white"}`}>
                {t} {t === "reviews" && `(${mockReviews.length})`}
              </button>
            ))}
          </div>

          {tab === "description" && (
            <p className="text-stone-400 leading-relaxed max-w-3xl">{product.description}</p>
          )}
          {tab === "features" && (
            <ul className="space-y-3 max-w-xl">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-stone-300">
                  <span className="w-5 h-5 rounded-full bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-400 text-xs shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          )}
          {tab === "reviews" && (
            <div className="space-y-5 max-w-2xl">
              {mockReviews.map((r) => (
                <div key={r.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{r.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white text-sm">{r.name}</span>
                        <span className="text-xs text-stone-500">{r.date}</span>
                      </div>
                      <StarRating rating={r.rating} size="sm" />
                      <p className="text-stone-400 text-sm mt-2 leading-relaxed">{r.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
