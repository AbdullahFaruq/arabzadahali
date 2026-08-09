"use client";
import Link from "next/link";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className="group bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-stone-800">
        <Link href={`/shop/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${product.badge === "Best Seller" ? "bg-amber-500 text-white" : product.badge === "New" ? "bg-emerald-500 text-white" : product.badge === "Premium" ? "bg-violet-500 text-white" : product.badge === "Rare" ? "bg-rose-500 text-white" : product.badge === "Eco" ? "bg-teal-500 text-white" : "bg-blue-500 text-white"}`}>
              {product.badge}
            </span>
          )}
          {discount && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-red-500 text-white">-{discount}%</span>}
          {!product.inStock && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-stone-700 text-stone-300">Sold Out</span>}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${wishlisted ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" : "bg-stone-900/80 backdrop-blur-sm text-stone-400 hover:text-rose-400 hover:bg-stone-800"}`}
        >
          <svg className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick add — appears on hover */}
        {product.inStock && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold py-3 transition-colors"
            >
              + Quick Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Link href={`/shop/${product.id}`} className="text-sm font-semibold text-white hover:text-amber-400 transition-colors leading-snug line-clamp-2">
            {product.name}
          </Link>
        </div>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-stone-600"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-stone-500 ml-1">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white">${product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-xs text-stone-500 line-through">${product.originalPrice.toLocaleString()}</span>}
          </div>
          <span className="text-xs text-stone-500 bg-stone-800 px-2 py-0.5 rounded-lg">{product.size}</span>
        </div>
      </div>
    </div>
  );
}
