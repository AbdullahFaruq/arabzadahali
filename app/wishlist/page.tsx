"use client";
import Link from "next/link";
import { useStore } from "../context/StoreContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const wishlisted = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-stone-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-stone-300">Favorilerim</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white">Favorilerim</h1>
            <p className="text-stone-400 mt-1">{wishlisted.length} kayıtlı ürün</p>
          </div>
        </div>

        {wishlisted.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-6">♡</div>
            <h2 className="text-3xl font-black text-white mb-3">Favori listeniz boş</h2>
            <p className="text-stone-400 mb-8">Beğendiğin halıları kaydet, sonra kolayca bul</p>
            <Link href="/shop" className="inline-block bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/30">
              Halılara Göz At →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {wishlisted.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
